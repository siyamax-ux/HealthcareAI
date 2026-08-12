import React from 'react';
import { 
  Activity, Heart, Thermometer, ShieldAlert, Cpu, Stethoscope, FileText, Mic, 
  Users, BarChart3, ChevronRight, Video, Calendar, Sparkles, CheckCircle2, 
  MapPin, Phone, Mail, Globe, AlertTriangle, RefreshCw, Smartphone, Search,
  Award, CloudOff, HelpCircle, ArrowUpRight, Play, Eye
} from 'lucide-react';

export const mockData = {
  stats: [
    { label: "Villages Connected", value: "2,450+", icon: MapPin, color: "from-cyan-500 to-blue-600" },
    { label: "AI Consultations", value: "185,000+", icon: Cpu, color: "from-purple-500 to-indigo-600" },
    { label: "Emergency Alerts Handled", value: "14,200+", icon: ShieldAlert, color: "from-emerald-500 to-teal-600" },
    { label: "Active Tele-Doctors", value: "650+", icon: Stethoscope, color: "from-rose-500 to-pink-600" }
  ],

  doctors: [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialization: "General Physician & AI Triage Specialist",
      experience: "14 Yrs Exp",
      rating: "4.9 (320+ consultations)",
      languages: ["Hindi", "English", "Bhojpuri"],
      availability: "Available Now",
      status: "online",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 2,
      name: "Dr. Ananya Patel",
      specialization: "Pediatrician & Rural Health Lead",
      experience: "10 Yrs Exp",
      rating: "4.95 (410+ consultations)",
      languages: ["Hindi", "Gujarati", "English"],
      availability: "In 15 Mins",
      status: "busy",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Dr. Vikram Sethi",
      specialization: "Cardiologist & Emergency Care",
      experience: "18 Yrs Exp",
      rating: "4.88 (500+ consultations)",
      languages: ["Hindi", "Punjabi", "English"],
      availability: "Available Today",
      status: "online",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ],

  diseaseForecast: [
    { month: 'Jan', dengue: 24,  malaria: 18,  viral: 65,  cholera: 8,   riskLevel: 'Low',              alert: false },
    { month: 'Feb', dengue: 18,  malaria: 12,  viral: 50,  cholera: 6,   riskLevel: 'Low',              alert: false },
    { month: 'Mar', dengue: 35,  malaria: 28,  viral: 72,  cholera: 12,  riskLevel: 'Moderate',         alert: false },
    { month: 'Apr', dengue: 50,  malaria: 45,  viral: 85,  cholera: 18,  riskLevel: 'Moderate',         alert: false },
    { month: 'May', dengue: 95,  malaria: 88,  viral: 120, cholera: 30,  riskLevel: 'High',             alert: true  },
    { month: 'Jun', dengue: 140, malaria: 130, viral: 160, cholera: 55,  riskLevel: 'Critical Outbreak',alert: true  },
    { month: 'Jul', dengue: 188, malaria: 175, viral: 195, cholera: 78,  riskLevel: 'Critical Outbreak',alert: true  },
    { month: 'Aug', dengue: 210, malaria: 195, viral: 220, cholera: 92,  riskLevel: 'Critical Outbreak',alert: true  },
    { month: 'Sep', dengue: 175, malaria: 160, viral: 185, cholera: 70,  riskLevel: 'Critical Outbreak',alert: true  },
    { month: 'Oct', dengue: 110, malaria: 95,  viral: 130, cholera: 38,  riskLevel: 'High',             alert: true  },
    { month: 'Nov', dengue: 55,  malaria: 42,  viral: 90,  cholera: 18,  riskLevel: 'Moderate',         alert: false },
    { month: 'Dec', dengue: 30,  malaria: 24,  viral: 70,  cholera: 10,  riskLevel: 'Low',              alert: false },
  ],

  /* Year-over-year actuals (2025) vs AI forecast (2026) for comparison */
  forecastComparison: [
    { month: 'Jan', actual2025: 28,  forecast2026: 24  },
    { month: 'Feb', actual2025: 22,  forecast2026: 18  },
    { month: 'Mar', actual2025: 40,  forecast2026: 35  },
    { month: 'Apr', actual2025: 58,  forecast2026: 50  },
    { month: 'May', actual2025: 105, forecast2026: 95  },
    { month: 'Jun', actual2025: 155, forecast2026: 140 },
    { month: 'Jul', actual2025: 200, forecast2026: 188 },
    { month: 'Aug', actual2025: 228, forecast2026: 210 },
    { month: 'Sep', actual2025: 190, forecast2026: 175 },
    { month: 'Oct', actual2025: 120, forecast2026: 110 },
    { month: 'Nov', actual2025: 65,  forecast2026: 55  },
    { month: 'Dec', actual2025: 35,  forecast2026: 30  },
  ],

  familyMembers: [
    {
      id: "FM-01",
      name: "Ramsevak Kumar",
      relation: "Head of Family",
      age: 54,
      bloodType: "O+",
      healthScore: 88,
      status: "Healthy",
      lastCheckup: "3 Days ago",
      vaccination: "Up to date",
      chronicCondition: "Mild Hypertension"
    },
    {
      id: "FM-02",
      name: "Sunita Devi",
      relation: "Spouse",
      age: 49,
      bloodType: "B+",
      healthScore: 92,
      status: "Excellent",
      lastCheckup: "Yesterday",
      vaccination: "Up to date",
      chronicCondition: "None"
    },
    {
      id: "FM-03",
      name: "Amit Kumar",
      relation: "Son",
      age: 22,
      bloodType: "O+",
      healthScore: 96,
      status: "Optimal",
      lastCheckup: "1 Week ago",
      vaccination: "Completed",
      chronicCondition: "None"
    }
  ],

  successStories: [
    {
      quote: "GramSwasthya AI detected early signs of dengue in our village cluster 2 weeks before traditional reporting. It saved over 40 lives with immediate preventive camps.",
      author: "Sarpanch Rameshwar Yadav",
      location: "Chhatarpur District, MP",
      role: "Village Head",
      impact: "40+ Lives Saved"
    },
    {
      quote: "The Hindi voice doctor allowed my mother to describe her knee pain without needing me to translate. The AI report helped Dr. Sharma prescribe exact medication remotely.",
      author: "Pooja Verma",
      location: "Sonbhadra, UP",
      role: "Local Teacher",
      impact: "Zero Travel Cost Saved"
    },
    {
      quote: "As a village Accredited Social Health Activist (ASHA worker), scanning doctor notes with AI OCR has cut my report submission time from hours to just minutes.",
      author: "Kavita Devi",
      location: "Bhojpur, Bihar",
      role: "Health Worker",
      impact: "80% Time Reduction"
    }
  ],

  faqs: [
    {
      q: "How does GramSwasthya AI symptom checker work?",
      a: "Our AI model is trained on multi-lingual clinical triaging protocols. It asks conversational questions in your local dialect (Voice or Text), analyzes symptoms against verified epidemiological data, and generates a preliminary risk report."
    },
    {
      q: "Is internet connectivity mandatory in remote villages?",
      a: "No! GramSwasthya AI features offline healthcare sync. Health workers can perform OCR scans, input vital signs, and record patient histories offline. Data automatically syncs once connection is detected."
    },
    {
      q: "Which regional Indian languages are supported?",
      a: "Currently supported: Hindi, Bhojpuri, Maithili, Gujarati, Punjabi, Bengali, Marathi, and English. We continuously add dialect nuances for seamless voice interactions."
    },
    {
      q: "How are patient health records secured?",
      a: "We follow strict HIPAA-level end-to-end encryption. Health data is anonymized before AI processing and stored securely using blockchain-ready cryptographic hashes."
    }
  ]
};
