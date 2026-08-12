// ─────────────────────────────────────────────────────────
//  SetuHealth AI — centralised API client
// ─────────────────────────────────────────────────────────

// On Vercel, frontend and backend are the same origin, so /api works as a
// relative path with no CORS issues.
// In local dev, Vite's proxy forwards /api → localhost:5000 automatically.
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/** Default request timeout in ms */
const DEFAULT_TIMEOUT_MS = 8000;

const getToken = () => localStorage.getItem('setu_token');

/** Demo tokens are fake — never send them to the real backend */
export const isDemoSession = () => {
  const t = getToken();
  return !!t && t.startsWith('demo-token-');
};

const headers = (isMultipart = false) => {
  const h = {};
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (!isMultipart) h['Content-Type'] = 'application/json';
  return h;
};

/** Parse the response, converting HTTP errors to thrown Errors */
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned an unexpected response (HTTP ${res.status}).`);
  }
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (HTTP ${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

/**
 * Wraps fetch with an AbortSignal timeout.
 * No localhost fallback — that caused infinite retry loops in the console.
 */
const safeFetch = async (url, options = {}, callerSignal) => {
  const timeoutCtrl = new AbortController();
  const timeoutId = setTimeout(() => timeoutCtrl.abort(), DEFAULT_TIMEOUT_MS);

  const signals = [timeoutCtrl.signal];
  if (callerSignal) signals.push(callerSignal);
  const signal = AbortSignal.any ? AbortSignal.any(signals) : timeoutCtrl.signal;

  try {
    const res = await fetch(url, { ...options, signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    const msg = err.message?.toLowerCase() ?? '';
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed')) {
      throw new Error('Cannot reach the server. Please ensure the backend is running.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const api = {
  /** GET /api/<path> */
  get: (path, signal) =>
    safeFetch(`${BASE}${path}`, { headers: headers() }, signal).then(handleResponse),

  /** POST /api/<path> with JSON body */
  post: (path, body, signal) =>
    safeFetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }, signal).then(handleResponse),

  /** PUT /api/<path> with JSON body */
  put: (path, body) =>
    safeFetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  /** DELETE /api/<path> */
  delete: (path) =>
    safeFetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: headers(),
    }).then(handleResponse),

  /** POST /api/<path> with FormData (file uploads) */
  postForm: (path, formData) =>
    safeFetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(true),
      body: formData,
    }).then(handleResponse),
};

// ─── Auth helpers ─────────────────────────────────────────
const normalizeUser = (user) => {
  if (!user) return null;
  const u = { ...user };
  if (u.role === 'health_worker') u.role = 'healthworker';
  return u;
};

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(data => {
      if (data?.user) data.user = normalizeUser(data.user);
      return data;
    }),

  register: (payload) => {
    const body = { ...payload };
    if (body.role === 'healthworker') body.role = 'health_worker';
    return api.post('/auth/register', body).then(data => {
      if (data?.user) data.user = normalizeUser(data.user);
      return data;
    });
  },

  getMe: () =>
    api.get('/auth/me').then(data => {
      if (data?.user) data.user = normalizeUser(data.user);
      return data;
    }),

  saveSession: (token, user) => {
    localStorage.setItem('setu_token', token);
    localStorage.setItem('setu_user', JSON.stringify(normalizeUser(user)));
  },

  clearSession: () => {
    localStorage.removeItem('setu_token');
    localStorage.removeItem('setu_user');
  },

  getUser: () => {
    try { return normalizeUser(JSON.parse(localStorage.getItem('setu_user'))); }
    catch { return null; }
  },

  isLoggedIn: () => !!localStorage.getItem('setu_token'),
};

// ─── Analytics ────────────────────────────────────────────
export const analyticsApi = {
  getSummary:          () => api.get('/analytics/summary'),
  getRiskDistribution: () => api.get('/analytics/risk'),
  getStatusDistrib:    () => api.get('/analytics/status'),
  getRecentActivity:   () => api.get('/analytics/recent'),
};

// ─── Patients ─────────────────────────────────────────────
export const patientApi = {
  getAll:            ()          => api.get('/patients'),
  getOne:            (id)        => api.get(`/patients/${id}`),
  create:            (data)      => api.post('/patients', data),
  update:            (id, data)  => api.put(`/patients/${id}`, data),
  remove:            (id)        => api.delete(`/patients/${id}`),
};

// ─── Consultations ────────────────────────────────────────
export const consultationApi = {
  getAll:   ()          => api.get('/consultations'),
  getOne:   (id)        => api.get(`/consultations/${id}`),
  create:   (data)      => api.post('/consultations', data),
  update:   (id, data)  => api.put(`/consultations/${id}`, data),
};

// ─── AI ───────────────────────────────────────────────────
export const aiApi = {
  analyze:   (consultationId)     => api.post('/ai/analyze', { consultationId }),
  riskCheck: (vitals, symptoms)   => api.post('/ai/risk', { vitals, symptoms }),
};

// ─── Emergency ────────────────────────────────────────────
export const emergencyApi = {
  flag:      (consultationId, reason) => api.post('/emergency/flag', { consultationId, reason }),
  getAlerts: ()                       => api.get('/emergency/alerts'),
};

// ─── Doctors / Appointments / Referrals ──────────────────
export const doctorApi = {
  getAll:            (signal) => api.get('/doctors', signal),
  getAppointments:   ()       => api.get('/doctors/appointments'),
  createAppointment: (data)   => api.post('/doctors/appointments', data),
  createReferral:    (data)   => api.post('/doctors/referrals', data),
  getReferrals:      ()       => api.get('/doctors/referrals'),
};

// ─── Documents / OCR ─────────────────────────────────────
export const documentApi = {
  upload: (patientId, file, documentType = 'other', notes = '') => {
    const form = new FormData();
    form.append('document', file);
    form.append('patientId', patientId);
    form.append('documentType', documentType);
    if (notes) form.append('notes', notes);
    return api.postForm('/documents', form);
  },

  getByPatient:  (patientId)  => api.get(`/documents/patient/${patientId}`),
  getOne:        (id)         => api.get(`/documents/${id}`),
  remove:        (id)         => api.delete(`/documents/${id}`),
  extractOcr:    (documentId) => api.post('/ocr/extract', { documentId }),
  getOcrResult:  (documentId) => api.get(`/ocr/${documentId}`),
};
