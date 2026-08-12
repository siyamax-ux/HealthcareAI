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
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
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
      image: "https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=400"
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
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
    }
  ],

  diseaseForecast: [
    { month: 'Jan', dengue: 24, malaria: 18, viral: 65, riskLevel: 'Low' },
    { month: 'Feb', dengue: 18, malaria: 12, viral: 50, riskLevel: 'Low' },
    { month: 'Mar', dengue: 35, malaria: 28, viral: 72, riskLevel: 'Moderate' },
    { month: 'Apr', dengue: 50, malaria: 45, viral: 85, riskLevel: 'Moderate' },
    { month: 'May', dengue: 95, malaria: 88, viral: 120, riskLevel: 'High' },
    { month: 'Jun', dengue: 140, malaria: 130, viral: 160, riskLevel: 'Critical Outbreak' },
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
