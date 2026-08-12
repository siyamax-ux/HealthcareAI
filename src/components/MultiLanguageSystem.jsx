import React, { useState, useEffect } from 'react';
import { 
  Globe, Search, Volume2, VolumeX, Eye, EyeOff, Bot, Sparkles, 
  Send, Mic, Phone, MapPin, AlertTriangle, ShieldCheck, FileText, 
  ChevronRight, Check, X, Info, HelpCircle
} from 'lucide-react';

// Database of 23 official/regional Indian languages with ISO code, native script, and simulated TTS greeting
const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते, मैं आपकी क्या सहायता कर सकता हूँ?' },
  { code: 'en', name: 'English', native: 'English', greeting: 'Hello, how can I help you today?' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার, আমি আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం, ఈరోజు నేను మీకు ఎలా సహాయపడగలను?' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', greeting: 'नमस्कार, मी तुम्हाला कशी मदत करू शकतो?' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம், இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?' },
  { code: 'ur', name: 'Urdu', native: 'اردو', greeting: 'ہیلو، آج میں آپ کی کیا مدد کر سکتا ہوں؟' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', greeting: 'નમસ્તે, હું આજે તમને કેવી રીતે મદદ કરી શકું?' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ, ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', greeting: 'നമസ്കാരം, ಇಂದು എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର, ମୁଁ ଆଜି ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', greeting: 'নমস্কাৰ, মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', greeting: 'नमस्ते, मैं तुंदी केह मदद करी सकदा हां?' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', greeting: 'नमस्कार, हांव तुका कशी मदत करू शकता?' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', greeting: 'प्रणाम, हम अहाँक कते सेवा कऽ सकैत छी?' },
  { code: 'mni', name: 'Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ', greeting: 'ꯅꯨꯡꯉꯥꯏꯕ꯭ꯔꯥ, ꯑꯩꯍꯥꯛꯅꯥ ꯀꯔꯝꯅꯥ ꯃꯇꯦꯡ ꯄꯥꯡꯒꯗꯒꯦ?' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', greeting: 'नमो नमः, अद्य अहं कथं साहाय्यं कर्तुं शक्नोमि?' },
  { code: 'ks', name: 'Kashmiri', native: 'كٲշുܪ', greeting: 'سلام، بہِ کیتھ کَنہِ ہیکہٕ تُہنز مدد کٔرِتھ؟' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', greeting: 'ᱡᱚᱦᱟᱨ, ᱤᱧ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', greeting: 'هيلو، آئون اڄ توهان جي ڪهڙي مدد ڪري سگهان ٿو؟' },
  { code: 'brx', name: 'Bodo', native: 'बर\'', greeting: 'हेल`, आं नोंथांनो माबोरै हेफाजाब खालामनो हागौ?' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', greeting: 'नमस्ते, म आज तपाईंलाई कसरी सहयोग गर्न सक्छु?' }
];

// State-wise smart localization database
const STATE_LOCALIZATION = {
  'tamil-nadu': {
    name: 'Tamil Nadu',
    primaryLang: 'ta',
    scheme: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)",
    schemeDesc: "Cashless healthcare package covering up to ₹5 Lakhs per family per year for 1000+ medical and surgical procedures.",
    alert: "Monsoon Dengue preventive fogging scheduled. Empty open standing water containers.",
    hospitals: [
      { name: "Rajaji Govt Medical College", city: "Madurai", phone: "0452-2532535" },
      { name: "Rajiv Gandhi Govt General Hospital", city: "Chennai", phone: "044-25305000" }
    ]
  },
  'punjab': {
    name: 'Punjab',
    primaryLang: 'pa',
    scheme: "Ayushman Bharat - Sarbat Sehat Bima Yojana (SSBY)",
    schemeDesc: "Provides cashless health cover of ₹5 Lakhs per family per year to 46 lakh beneficiary families in Punjab.",
    alert: "Seasonal straw burn particulate warning. Asthma patients should wear masks in mornings.",
    hospitals: [
      { name: "Government Medical College", city: "Amritsar", phone: "0183-2225911" },
      { name: "Civil Hospital", city: "Jalandhar", phone: "0181-2224021" }
    ]
  },
  'gujarat': {
    name: 'Gujarat',
    primaryLang: 'gu',
    scheme: "Mukhyamantri Amrutam (MA) Yojana & MA Vatsalya",
    schemeDesc: "Tertiary medical treatment coverage up to ₹3 Lakhs per year for BPL families and middle-class households.",
    alert: "Dehydration advisory: afternoon temperatures exceeding 42°C. Drink lemon water.",
    hospitals: [
      { name: "Ahmedabad Civil Hospital (Medicity)", city: "Ahmedabad", phone: "079-22683721" },
      { name: "Guru Gobind Singh Govt Hospital", city: "Jamnagar", phone: "0288-2550201" }
    ]
  },
  'west-bengal': {
    name: 'West Bengal',
    primaryLang: 'bn',
    scheme: "Swasthya Sathi Scheme",
    schemeDesc: "Basic health cover for secondary and tertiary care up to ₹5 Lakhs per family per annum through smart cards.",
    alert: "Vector-borne Malaria warning in coastal areas. Use mosquito nets and larvicides.",
    hospitals: [
      { name: "IPGMER & SSKM Hospital", city: "Kolkata", phone: "033-22041100" },
      { name: "Burdwan Medical College & Hospital", city: "Burdwan", phone: "0342-2558646" }
    ]
  },
  'maharashtra': {
    name: 'Maharashtra',
    primaryLang: 'mr',
    scheme: "Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)",
    schemeDesc: "Cashless surgical and critical hospital care up to ₹1.5 Lakhs per family per year across 900+ empanelled centers.",
    alert: "Gastroenteritis cases reported in rural Nashik districts. Drink boiled water.",
    hospitals: [
      { name: "KEM Hospital & Seth GS Medical College", city: "Mumbai", phone: "022-24107000" },
      { name: "Sassoon General Hospital", city: "Pune", phone: "020-26128000" }
    ]
  },
  'karnataka': {
    name: 'Karnataka',
    primaryLang: 'kn',
    scheme: "Arogya Karnataka - Ayushman Bharat Co-Branded",
    schemeDesc: "Universal health card covering up to ₹5 Lakhs for BPL families and co-payment options for APL cardholders.",
    alert: "Chikungunya fogging schedule activated in rural Mandya villages.",
    hospitals: [
      { name: "Victoria Hospital (BMCRI)", city: "Bengaluru", phone: "080-26701150" },
      { name: "Karnataka Institute of Medical Sciences", city: "Hubballi", phone: "0836-2374624" }
    ]
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    primaryLang: 'hi',
    scheme: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    schemeDesc: "India's flagship cashless public insurance scheme providing ₹5 Lakhs per year to rural households.",
    alert: "Acute Encephalitis Syndrome (AES) checkup camps active in Gorakhpur divisions.",
    hospitals: [
      { name: "King George's Medical University (KGMU)", city: "Lucknow", phone: "0522-2257450" },
      { name: "BRD Medical College & Trauma Center", city: "Gorakhpur", phone: "0551-2501720" }
    ]
  }
};

// Dialect/Accent list for simulated speech transcription
const REGIONAL_DIALECTS = {
  hi: ['Standard Hindi', 'Bhojpuri Accent', 'Haryanvi Accent', 'Rajasthani Accent', 'Bundelkhandi Accent'],
  te: ['Coastal Andhra Dialect', 'Telangana Dialect', 'Rayalaseema Accent'],
  ta: ['Kongu Tamil (Coimbatore)', 'Madurai Accent', 'Chennai Slang', 'Nellai Tamil'],
  mr: ['Deshi Marathi', 'Varhadi Dialect', 'Konkani Marathi Accent', 'Puneri Marathi'],
  bn: ['Rarhi Dialect (Kolkata)', 'Vangiya Dialect', 'Manbhumi Accent']
};

export const MultiLanguageSystem = ({ 
  largeText, setLargeText, 
  audioReadAloud, setAudioReadAloud,
  lowLiteracy, setLowLiteracy 
}) => {
  // Lang Selection States
  const [selectedLang, setSelectedLang] = useState('hi');
  const [selectedState, setSelectedState] = useState('uttar-pradesh');
  const [langSearch, setLangSearch] = useState('');
  const [recentLangs, setRecentLangs] = useState(['hi', 'en', 'bn', 'te', 'mr', 'ta']);

  // Sync selected language globally
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: selectedLang } }));
    localStorage.setItem('user_preferred_language', selectedLang);
  }, [selectedLang]);

  // UI Language Translations (Quick Mock)
  const translations = {
    hi: { title: "एआई बहुभाषी ग्रामीण स्वास्थ्य प्रणाली", subtitle: "सभी २३ भारतीय भाषाओं और बोलियों में स्वास्थ्य सेवा", searchPlaceholder: "भाषा खोजें...", langSettings: "पहुंच-योग्यता (Accessibility) नियंत्रण", chatTitle: "वास्तविक समय अनुवाद (ग्रामीण ↔ डॉक्टर)", docTranslator: "एआई मेडिकल दस्तावेज़ अनुवादक", stateInfo: "राज्य-वार स्वास्थ्य योजनाएं", testSpeech: "आवाज आज़माएं", ttsActive: "ऑडियो चालू है", largeTextActive: "बड़ा टेक्स्ट सक्रिय", lowLitActive: "सरल चित्र मोड सक्रिय" },
    en: { title: "AI Multi-Language Rural Healthcare", subtitle: "Healthcare access across 23 official Indian languages and local dialects", searchPlaceholder: "Search language...", langSettings: "Accessibility Controls", chatTitle: "Real-Time Translation (Villager ↔ Doctor)", docTranslator: "AI Medical Document Translator", stateInfo: "State-Wise Health Schemes", testSpeech: "Test Speech", ttsActive: "Audio Active", largeTextActive: "Large Text Active", lowLitActive: "Visual Mode Active" },
    bn: { title: "এআই বহুভাষিক গ্রামীণ স্বাস্থ্য ব্যবস্থা", subtitle: "২৩টি ভারতীয় ভাষা এবং স্থানীয় উপভাষায় স্বাস্থ্য পরিষেবা", searchPlaceholder: "ভাষা খুঁজুন...", langSettings: "অ্যাক্সেসিবিলিটি নিয়ন্ত্রণ", chatTitle: "রিয়েল-টাইম অনুবাদ (গ্রামীণ ↔ ডাক্তার)", docTranslator: "এআই মেডিকেল নথি অনুবাদক", stateInfo: "রাজ্যভিত্তিক স্বাস্থ্য পরিকল্পনা", testSpeech: "ভয়েস টেস্ট করুন", ttsActive: "অডিও সক্রিয়", largeTextActive: "বড় পাঠ্য সক্রিয়", lowLitActive: "ভিজ্যুয়াল মোড সক্রিয়" },
    te: { title: "AI బహుభాషా గ్రామీణ ఆరోగ్య వ్యవస్థ", subtitle: "అన్ని 23 భారతీయ భాషలు మరియు స్థానిక మాండలికాలలో వైద్యం", searchPlaceholder: "భాషను శోధించండి...", langSettings: "యాక్సెసిబిలిటీ నియంత్రణలు", chatTitle: "రియల్-టైమ్ అనువాదం (గ్రామీణ ↔ వైద్యుడు)", docTranslator: "AI మెడికల్ డాక్యుమెంట్ ట్రాన్స్లేటర్", stateInfo: "రాష్ట్రాల వారీగా ఆరోగ్య పథకాలు", testSpeech: "వాయిస్ పరీక్షించండి", ttsActive: "ఆడియో సక్రియంగా ఉంది", largeTextActive: "పెద్ద టెక్స్ట్ సక్రియం", lowLitActive: "విజువల్ మోడ్ సక్రియం" },
    mr: { title: "आय बहुभाषिक ग्रामीण आरोग्य यंत्रणा", subtitle: "२३ भारतीय भाषा आणि स्थानिक बोलीभाषांमध्ये आरोग्य सेवा", searchPlaceholder: "भाषा शोधा...", langSettings: "अॅक्सेसिबिलिटी नियंत्रणे", chatTitle: "रिअल-टाइम भाषांतर (ग्रामस्थ ↔ डॉक्टर)", docTranslator: "आय मेडिकल दस्तऐवज अनुवादक", stateInfo: "राज्यनिहाय आरोग्य योजना", testSpeech: "आवाज तपासा", ttsActive: "ऑडिओ सुरू आहे", largeTextActive: "मोठा मजकूर सक्रिय", lowLitActive: "व्हिज्युअल मोड सक्रिय" },
    ta: { title: "AI பன்மொழி கிராமப்புற சுகாதார அமைப்பு", subtitle: "அனைத்து 23 இந்திய மொழிகள் மற்றும் வட்டார வழக்குகளில் மருத்துவ சேவை", searchPlaceholder: "மொழியைத் தேடுக...", langSettings: "அணுகல்தன்மை கட்டுப்பாடுகள்", chatTitle: "நிகழ்நேர மொழிபெயர்ப்பு (கிராமவாசி ↔ மருத்துவர்)", docTranslator: "AI மருத்துவ ஆவண மொழிபெயர்ப்பாளர்", stateInfo: "மாநில வாரியான சுகாதாரத் திட்டங்கள்", testSpeech: "குரல் சோதனை", ttsActive: "ஆடியோ இயக்கப்பட்டது", largeTextActive: "பெரிய உரை இயக்கப்பட்டது", lowLitActive: "காட்சி முறை இயக்கப்பட்டது" }
  };

  const text = translations[translations[selectedLang] ? selectedLang : 'en'];

  // Chat Simulator States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: 'Hello, how can I help you today?', translated: 'नमस्ते, आज मैं आपकी क्या सहायता कर सकता हूँ?' }
  ]);
  const [villagerInput, setVillagerInput] = useState('');
  const [doctorInput, setDoctorInput] = useState('');
  const [isTranslatingChat, setIsTranslatingChat] = useState(false);
  const [detectedAccent, setDetectedAccent] = useState('Standard Dialect');

  // Chat preset phrases based on language
  const chatPresets = {
    hi: [
      { text: "मेरे पेट में बहुत दर्द है और चक्कर आ रहे हैं।", translated: "I have severe stomach pain and feel dizzy." },
      { text: "क्या मैं डॉक्टर से कल सुबह की अपॉइंटमेंट बुक कर सकता हूँ?", translated: "Can I book a doctor appointment for tomorrow morning?" }
    ],
    ta: [
      { text: "எனக்கு கடுமையான காய்ச்சலும் தலைவலியும் உள்ளது.", translated: "I have a high fever and headache." },
      { text: "மருந்து சீட்டை எப்படி பதிவிறக்கம் செய்வது?", translated: "How do I download the prescription?" }
    ],
    te: [
      { text: "నాకు నిన్నటి నుండి దగ్గు మరియు ఊపిరి తీసుకోవడంలో ఇబ్బంది ఉంది.", translated: "I have had a cough and breathing difficulty since yesterday." },
      { text: "బీపీ చెकప్ ఎప్పుడు చేయించుకోవాలి?", translated: "When should I get a blood pressure checkup?" }
    ],
    mr: [
      { text: "माझ्या आजोबांना छातीत जळजळ होत आहे.", translated: "My grandfather is having heartburn and chest burning." }
    ],
    bn: [
      { text: "আমার গায়ে খুব জ্বর এবং গা হাত পা ব্যথা করছে।", translated: "I have a high fever and body ache." }
    ],
    en: [
      { text: "I have a rash on my hand that is itching.", translated: "I have a rash on my hand that is itching." }
    ]
  };

  // Prescription Document Translator States
  const [inputDoc, setInputDoc] = useState('');
  const [translatedDoc, setTranslatedDoc] = useState('');
  const [docTargetLang, setDocTargetLang] = useState('hi');
  const [isTranslatingDoc, setIsTranslatingDoc] = useState(false);

  const samplePrescription = `PATIENT REPORT: Ramsevak Kumar (54 yrs)
DIAGNOSIS: Acute viral gastroenteritis with moderate dehydration.
PRESCRIPTION:
1. Tab Paracetamol 500mg - 1 tablet three times a day after meals for 3 days.
2. ORS Powder - Dissolve 1 packet in 1 Litre of clean water. Drink slowly throughout the day.
3. Tab Domperidone 10mg - 1 tablet 30 minutes before meals if nausea persists.
INSTRUCTIONS: Avoid solid foods. Take soft rice gruel and plenty of fluids. Rest for 48 hours.`;

  const simulatedPrescriptionTranslations = {
    hi: `मरीज की रिपोर्ट: रामसेवक कुमार (54 वर्ष)
निदान: मध्यम निर्जलीकरण (Dehydration) के साथ तीव्र वायरल गैस्ट्रोएंटेराइटिस।
पर्चा (Prescription):
1. टैबलेट पैरासिटामोल 500mg - 1 टैबलेट दिन में तीन बार, भोजन के बाद, 3 दिनों के लिए।
2. ओआरएस (ORS) पाउडर - 1 पैकेट को 1 लीटर साफ पानी में घोलें। पूरे दिन धीरे-धीरे पिएं।
3. टैबलेट डोमपरिडोन 10mg - यदि मतली बनी रहती है तो भोजन से 30 मिनट पहले 1 टैबलेट।
निर्देश: ठोस भोजन से बचें। नरम चावल का मांड़ और प्रचुर मात्रा में तरल पदार्थ लें। 48 घंटे आराम करें।`,
    bn: `রোগীর রিপোর্ট: রামসেবক কুমার (৫৪ বছর)
রোগ নির্ণয়: মাঝারি জলশূন্যতার সাথে তীব্র ভাইরাল গ্যাস্ট্রোএন্টারটাইটিস।
প্রেসক্রিপশন:
১. ট্যাব প্যারাসিটামল ৫০০ মিলিগ্রাম - খাবারের পর দিনে তিনবার ১টি করে ট্যাবলেট ৩ দিন।
২. ওআরএস পাউডার - ১ প্যাকেট ১ লিটার পরিষ্কার জলে গুলিয়ে নিন। সারাদিন ধরে ধীরে ধীরে পান করুন।
৩. ট্যাব ডমপেরিডোন ১০ মিলিগ্রাম - বমি বমি ভাব থাকলে খাবারের ৩০ মিনিট আগে ১টি ট্যাবলেট।
নির্দেশাবলী: শক্ত খাবার এড়িয়ে চলুন। নরম ভাতের ফ্যান এবং প্রচুর তরল খান। ৪৮ ঘণ্টা বিশ্রাম নিন।`,
    te: `రోగి రిపోర్టు: రామ్ సేవక్ కుమార్ (54 సంవత్సరాలు)
వ్యాధి నిర్ధారణ: మోస్తరు డీహైడ్రేషన్తో కూడిన తీవ్రమైన వైరల్ గ్యాస్ట్రోఎంటరైటిస్.
ప్రిస్క్రిప్షన్:
1. పారాసిటమాల్ 500mg టాబ్లెట్ - రోజుకు మూడు సార్లు ఆహారం తర్వాత 3 రోజుల పాటు.
2. ORS పౌడర్ - 1 ప్యాకెట్ను 1 లీటరు శుభ్రమైన నీటిలో కరిగించండి. రోజంతా నెమ్మదిగా త్రాగాలి.
3. డోంపెరిడోన్ 10mg టాబ్లెట్ - వికారం కొనసాగితే భోజనానికి 30 నిమిషాల ముందు 1 టాబ్లెట్.
సూచనలు: ఘన ఆహారాలు తీసుకోకండి. మెత్తటి గంజి మరియు ద్రవపదార్థాలు ఎక్కువగా తీసుకోండి. 48 గంటలు విశ్రాంతి తీసుకోండి.`,
    ta: `நோயாளி அறிக்கை: ராம்சேவக் குமார் (54 வயது)
கண்டறிதல்: மிதமான நீரிழப்புடன் கூடிய கடுமையான வைரஸ் இரைப்பை குடல் அழற்சி.
மருந்துச் சீட்டு:
1. பாராசிட்டமால் 500mg மாத்திரை - உணவுக்கு பின் 3 நாட்களுக்கு ஒரு நாளைக்கு மூன்று வேளை 1 மாத்திரை.
2. ORS தூள் - 1 பாக்கெட்டை 1 லிட்டர் சுத்தமான நீரில் கரைக்கவும். நாள் முழுவதும் மெதுவாக குடிக்கவும்.
3. டோம்ப்ரிடோன் 10mg மாத்திரை - குமட்டல் நீடித்தால் உணவுக்கு 30 நிமிடங்களுக்கு முன் 1 மாத்திரை.
அறிவுறுத்தல்கள்: திட உணவுகளை தவிர்க்கவும். மென்மையான கஞ்சி மற்றும் ஏராளமான திரவங்களை உட்கொள்ளவும். 48 மணி நேரம் ஓய்வெடுக்கவும்.`
  };

  // State maps localized change
  const handleStateChange = (stateKey) => {
    setSelectedState(stateKey);
    const stateData = STATE_LOCALIZATION[stateKey];
    if (stateData) {
      setSelectedLang(stateData.primaryLang);
      addRecentLang(stateData.primaryLang);
    }
  };

  const addRecentLang = (code) => {
    if (!recentLangs.includes(code)) {
      setRecentLangs(prev => [code, ...prev.slice(0, 5)]);
    }
  };

  // Text-To-Speech Simulator (Read-Aloud)
  const triggerTTS = (phrase) => {
    if (!audioReadAloud) return;
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      
      // Attempt to find Indian accent voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi') || v.lang.includes('ta'));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      // Speak
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`🗣️ Read Aloud: "${phrase}"`);
    }
  };

  // Chat translation trigger
  const handleVillagerSend = (phrase, isPreset = false) => {
    const messageText = phrase || villagerInput;
    if (!messageText.trim()) return;

    setIsTranslatingChat(true);

    // Look for preset mapping
    let englishTrans = "Simulated symptom consultation.";
    
    // Find preset translations
    const allPresets = Object.values(chatPresets).flat();
    const foundPreset = allPresets.find(p => p.text === messageText);
    if (foundPreset) {
      englishTrans = foundPreset.translated;
    } else {
      englishTrans = `Auto-Translated Symptom: ${messageText} (Simulated Backend translation output)`;
    }

    // Dialect Accent detection simulation
    const accents = REGIONAL_DIALECTS[selectedLang] || ['Standard Accent'];
    const randomAccent = accents[Math.floor(Math.random() * accents.length)];
    setDetectedAccent(randomAccent);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'villager', text: messageText, translated: englishTrans, accent: randomAccent }
      ]);
      setVillagerInput('');
      setIsTranslatingChat(false);

      // Trigger TTS greeting
      if (audioReadAloud) {
        triggerTTS(messageText);
      }
    }, 1200);
  };

  const handleDoctorSend = (e) => {
    e.preventDefault();
    if (!doctorInput.trim()) return;

    setIsTranslatingChat(true);

    // Translate English back to target regional language
    let localizedTrans = `Auto-Translated Doctor response in ${INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.name}`;
    
    if (doctorInput.toLowerCase().includes("take one tablet of paracetamol")) {
      localizedTrans = {
        hi: "कृपया अब पैरासिटामोल की एक गोली लें और आराम करें। मैं पर्चा लिख रहा हूँ।",
        ta: "தயவுசெய்து இப்போது ஒரு பாராசிட்டமால் மாத்திரை எடுத்துக்கொண்டு ஓய்வெடுங்கள். நான் மருந்துச்சீட்டு எழுதுகிறேன்.",
        te: "దయచేసి ఇప్పుడు ఒక పారాసిటమాల్ టాబ్లెట్ వేసుకుని విశ్రాంతి తీసుకోండి. నేను ప్రిస్క్రిప్షన్ రాస్తాను.",
        bn: "দয়া করে এখন একটি প্যারাসিটামল ট্যাবলেট নিন এবং বিশ্রাম নিন। আমি প্রেসক্রিপশন লিখছি।",
        mr: "कृपया आता पॅरासिटामॉलची एक गोळी घ्या आणि विश्रांती घ्या. मी प्रिस्क्रिप्शन लिहित आहे।"
      }[selectedLang] || localizedTrans;
    } else {
      localizedTrans = `[${selectedLang.toUpperCase()}]: ${doctorInput}`;
    }

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'doctor', text: doctorInput, translated: localizedTrans }
      ]);
      setDoctorInput('');
      setIsTranslatingChat(false);

      if (audioReadAloud) {
        triggerTTS(localizedTrans);
      }
    }, 1000);
  };

  // Doc translator trigger
  const translateDocument = () => {
    if (!inputDoc.trim()) return;
    setIsTranslatingDoc(true);
    setTimeout(() => {
      const output = simulatedPrescriptionTranslations[docTargetLang] || 
                     `[Translated to ${INDIAN_LANGUAGES.find(l => l.code === docTargetLang)?.name}]:\n\n` + inputDoc;
      setTranslatedDoc(output);
      setIsTranslatingDoc(false);
      
      if (audioReadAloud) {
        triggerTTS("Document translation complete.");
      }
    }, 1800);
  };

  // Load sample prescription helper
  const handleLoadSample = () => {
    setInputDoc(samplePrescription);
    setTranslatedDoc('');
  };

  // Filter list of languages
  const filteredLanguages = INDIAN_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <section id="multilingual" className="py-24 relative overflow-hidden bg-slate-950/80">
      
      {/* Decorative Rotating Grid BG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Globe className="w-4 h-4 animate-spin-slow" />
            <span>Interactive Module 11</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {text.title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {text.subtitle}
          </p>
        </div>

        {/* ACCESSIBILITY & ONE-CLICK LANGUAGE SWITCHER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Panel (5/12): Searchable Lang Selection & Accessibility Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Accessibility Panel */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
                <span>{text.langSettings}</span>
              </h3>

              <div className="space-y-4">
                {/* Large Text Mode Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Large Text Mode</span>
                    <span className="text-[10px] text-slate-500">Increases font size for elderly readers.</span>
                  </div>
                  <button
                    onClick={() => setLargeText(!largeText)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                      largeText ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      largeText ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Read-Aloud Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Audio Read-Aloud (Text-To-Speech)</span>
                    <span className="text-[10px] text-slate-500">Reads prescriptions and guides aloud.</span>
                  </div>
                  <button
                    onClick={() => setAudioReadAloud(!audioReadAloud)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                      audioReadAloud ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      audioReadAloud ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Low Literacy Visual Mode */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Low-Literacy Visual Guide Mode</span>
                    <span className="text-[10px] text-slate-500">Replaces text with voice cues and icons.</span>
                  </div>
                  <button
                    onClick={() => setLowLiteracy(!lowLiteracy)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                      lowLiteracy ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      lowLiteracy ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selector Dropdown / Grid */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Searchable Language Hub</h3>
                <span className="text-[10px] text-slate-500">23 Indian Languages</span>
              </div>

              {/* Language Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={text.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Recently Used Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {recentLangs.map((code) => {
                  const lang = INDIAN_LANGUAGES.find(l => l.code === code);
                  if (!lang) return null;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLang(code);
                        triggerTTS(lang.greeting);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        selectedLang === code 
                          ? 'bg-cyan-500 text-slate-950 font-black shadow' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lang.name} ({lang.native})
                    </button>
                  );
                })}
              </div>

              {/* Languages List Box */}
              <div className="max-h-48 overflow-y-auto pr-1 border border-slate-900 rounded-xl space-y-1 bg-slate-950/40 p-2">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      addRecentLang(lang.code);
                      triggerTTS(lang.greeting);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-all ${
                      selectedLang === lang.code
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'hover:bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{lang.name} ({lang.native})</span>
                    {selectedLang === lang.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel (7/12): Map & State-Wise Localization Data */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clickable India Map Representation */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-cyan-400" />
                <span>State-Wise Smart Localization Maps</span>
              </h3>
              <p className="text-xs text-slate-400">Click a state to simulate localized interface guidelines, regional alerts, and local government programs.</p>
              
              {/* Fake Interactive Map Representation (Grid of States) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.keys(STATE_LOCALIZATION).map((key) => {
                  const state = STATE_LOCALIZATION[key];
                  const isActive = selectedState === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleStateChange(key)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between items-center h-20 ${
                        isActive
                          ? 'bg-gradient-to-tr from-cyan-900/40 to-blue-900/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10 scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[11px] font-black">{state.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-950 font-mono text-slate-400 border border-slate-800">
                        {INDIAN_LANGUAGES.find(l => l.code === state.primaryLang)?.name || 'Local'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Localization Card Output */}
            {STATE_LOCALIZATION[selectedState] && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-950/60 to-slate-950 border border-slate-800 animate-in fade-in slide-in-from-right duration-300 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">Active Smart Locale</span>
                    <h4 className="text-lg font-black text-white">{STATE_LOCALIZATION[selectedState].name} Status</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Default Language</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                      {INDIAN_LANGUAGES.find(l => l.code === STATE_LOCALIZATION[selectedState].primaryLang)?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Scheme Card */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-slate-300 block uppercase tracking-wide">Regional Health Scheme</span>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                      <strong className="text-xs text-white block leading-snug">{STATE_LOCALIZATION[selectedState].scheme}</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{STATE_LOCALIZATION[selectedState].schemeDesc}</p>
                    </div>
                  </div>

                  {/* Regional Alert & Hospital Contact */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-300 block uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Regional Health Advisory</span>
                      </span>
                      <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-300 leading-relaxed font-medium">
                        {STATE_LOCALIZATION[selectedState].alert}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Empanelled District Hospitals</span>
                      <div className="space-y-1">
                        {STATE_LOCALIZATION[selectedState].hospitals.map((h, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                            <span className="font-bold">{h.name} ({h.city})</span>
                            <a href={`tel:${h.phone}`} className="text-cyan-400 font-mono hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* MOCK LOW-LITERACY PANEL (Displays only when lowLiteracy toggle is true) */}
        {lowLiteracy && (
          <div className="mb-12 p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 animate-in slide-in-from-top duration-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-base font-extrabold text-cyan-400 flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400 animate-bounce" />
                <span>Low-Literacy Simplified Visual Care Card</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500 text-slate-950 font-bold uppercase">Active</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Text descriptions have been simplified. Click the speaker buttons below to hear immediate voice help in your local dialect.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div 
                onClick={() => triggerTTS("हार्ट अटैक? तुरंत बैठें और डॉक्टर को कॉल करें।")}
                className="p-4 rounded-2xl bg-slate-950 border border-red-500/20 text-center cursor-pointer hover:border-red-500/50 transition-all space-y-3"
              >
                <div className="text-3xl">❤️</div>
                <strong className="text-xs text-white block">Heart Attack / छाती में दर्द</strong>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 mx-auto">
                  <Volume2 className="w-3 h-3" />
                  <span>सुनें (Listen)</span>
                </button>
              </div>

              <div 
                onClick={() => triggerTTS("सांस नहीं आ रही? सीपीआर छाती दबाना शुरू करें।")}
                className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 text-center cursor-pointer hover:border-cyan-500/50 transition-all space-y-3"
              >
                <div className="text-3xl">⚡</div>
                <strong className="text-xs text-white block">Not Breathing / सांस बंद</strong>
                <button className="px-3 py-1 bg-cyan-500 text-slate-950 rounded-lg text-[9px] font-bold flex items-center gap-1 mx-auto">
                  <Volume2 className="w-3 h-3" />
                  <span>सुनें (Listen)</span>
                </button>
              </div>

              <div 
                onClick={() => triggerTTS("सांप ने काटा? हिले डुले नहीं और घाव साफ़ करें।")}
                className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 text-center cursor-pointer hover:border-amber-500/50 transition-all space-y-3"
              >
                <div className="text-3xl">🐍</div>
                <strong className="text-xs text-white block">Snake Bite / सांप का काटना</strong>
                <button className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-[9px] font-bold flex items-center gap-1 mx-auto">
                  <Volume2 className="w-3 h-3" />
                  <span>सुनें (Listen)</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VILLAGER ↔ DOCTOR REAL-TIME TRANSLATION CHAT SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-12 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span>{text.chatTitle}</span>
                </h3>
                <p className="text-xs text-slate-400">Removing barriers: Villager types/speaks in local language; Doctor reads and replies in English.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Speech Diagnostics:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] font-bold">
                  {detectedAccent}
                </span>
              </div>
            </div>

            {/* Split Dual-Screen Chat UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Chat Screen: VILLAGER NATIVE INTERFACE */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex flex-col h-96">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-black text-white">Patient (Rural Villager Mode)</span>
                  <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase">
                    {INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.name} UI
                  </span>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'villager' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.sender === 'villager'
                          ? 'bg-cyan-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        <div className="font-mono text-[9px] opacity-75 mb-1">
                          {msg.sender === 'villager' ? 'You wrote:' : 'Doctor wrote (Translated):'}
                        </div>
                        {msg.sender === 'villager' ? msg.text : msg.translated}
                      </div>
                    </div>
                  ))}
                  
                  {isTranslatingChat && (
                    <div className="flex justify-center">
                      <div className="px-3 py-1 bg-slate-900 rounded-full text-[10px] text-cyan-400 animate-pulse">
                        AI Translating...
                      </div>
                    </div>
                  )}
                </div>

                {/* Native Preset Buttons */}
                {chatPresets[selectedLang] && (
                  <div className="px-3 py-2 bg-slate-900 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto whitespace-nowrap">
                    {chatPresets[selectedLang].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVillagerSend(p.text, true)}
                        className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white"
                      >
                        🗣️ {p.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={villagerInput}
                    onChange={(e) => setVillagerInput(e.target.value)}
                    placeholder="लिखें या लक्षण बताएं..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                    onClick={() => handleVillagerSend()}
                    className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Chat Screen: DOCTOR CLINICAL INTERFACE */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex flex-col h-96">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-black text-white">Doctor Portal (English Summary Panel)</span>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">MD Emergency Care UI</span>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.sender === 'doctor'
                          ? 'bg-slate-800 text-slate-100 rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        <div className="font-mono text-[9px] opacity-75 mb-1">
                          {msg.sender === 'doctor' ? 'You wrote:' : `Patient (Accent: ${msg.accent}):`}
                        </div>
                        {msg.sender === 'doctor' ? msg.text : msg.translated}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Doctor quick responder script */}
                <div className="px-3 py-2 bg-slate-900 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto whitespace-nowrap">
                  <button
                    onClick={() => setDoctorInput("Take one tablet of Paracetamol now and rest. I will write a prescription.")}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white"
                  >
                    📝 Suggest Paracetamol & Rest
                  </button>
                </div>

                {/* Input Bar */}
                <form onSubmit={handleDoctorSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={doctorInput}
                    onChange={(e) => setDoctorInput(e.target.value)}
                    placeholder="Type prescription or reply in English..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                    type="submit"
                    className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>

          </div>

        </div>

        {/* AI HEALTHCARE DOCUMENT TRANSLATOR */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
          
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>{text.docTranslator}</span>
              </h3>
              <p className="text-xs text-slate-400">Instantly translate English prescriptions, hospital reports, or discharge summaries into regional Indian scripts.</p>
            </div>
            
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg hover:border-cyan-500/20 transition-all"
            >
              Load Sample English Prescription
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input Side */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Source Medical Document (English)</span>
              <textarea
                value={inputDoc}
                onChange={(e) => setInputDoc(e.target.value)}
                placeholder="Paste English prescription or report here..."
                rows={8}
                className="w-full p-4 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono leading-relaxed"
              />
            </div>

            {/* Output Side */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Translated Document</span>
                
                {/* Selector for target language */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Translate To:</span>
                  <select
                    value={docTargetLang}
                    onChange={(e) => setDocTargetLang(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-bold rounded-lg p-1.5 focus:outline-none"
                  >
                    {['hi', 'ta', 'te', 'bn'].map(code => (
                      <option key={code} value={code}>
                        {INDIAN_LANGUAGES.find(l => l.code === code)?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full p-4 bg-slate-950/40 border border-slate-800 rounded-2xl text-xs text-slate-200 font-mono leading-relaxed h-44 overflow-y-auto whitespace-pre-wrap">
                {isTranslatingDoc ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                    <span className="text-[10px] text-cyan-400 animate-pulse font-sans font-bold">Scanning text & translating...</span>
                  </div>
                ) : translatedDoc ? (
                  translatedDoc
                ) : (
                  <span className="text-slate-600 font-sans italic">Select language and click translate...</span>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={translateDocument}
              disabled={!inputDoc.trim() || isTranslatingDoc}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-900 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Translate Document</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
