import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import i18n from '../i18n/index.js';

/* ══════════════════════════════════════════════════════════
   STATE → LANGUAGE MAPPING (all 28 states + major UTs)
══════════════════════════════════════════════════════════ */
export const STATE_LANG_MAP = {
  // Hindi belt
  'uttar pradesh':        { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'madhya pradesh':       { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'rajasthan':            { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'bihar':                { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'jharkhand':            { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'chhattisgarh':         { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'uttarakhand':          { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'himachal pradesh':     { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'haryana':              { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'delhi':                { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  // Regional
  'punjab':               { code: 'pa', name: 'Punjabi',    native: 'ਪੰਜਾਬੀ',     flag: '🇮🇳' },
  'gujarat':              { code: 'gu', name: 'Gujarati',   native: 'ગુજરાતી',    flag: '🇮🇳' },
  'maharashtra':          { code: 'mr', name: 'Marathi',    native: 'मराठी',      flag: '🇮🇳' },
  'west bengal':          { code: 'bn', name: 'Bengali',    native: 'বাংলা',       flag: '🇮🇳' },
  'karnataka':            { code: 'kn', name: 'Kannada',    native: 'ಕನ್ನಡ',      flag: '🇮🇳' },
  'kerala':               { code: 'ml', name: 'Malayalam',  native: 'മലയാളം',     flag: '🇮🇳' },
  'tamil nadu':           { code: 'ta', name: 'Tamil',      native: 'தமிழ்',      flag: '🇮🇳' },
  'telangana':            { code: 'te', name: 'Telugu',     native: 'తెలుగు',     flag: '🇮🇳' },
  'andhra pradesh':       { code: 'te', name: 'Telugu',     native: 'తెలుగు',     flag: '🇮🇳' },
  'assam':                { code: 'as', name: 'Assamese',   native: 'অসমীয়া',    flag: '🇮🇳' },
  'odisha':               { code: 'or', name: 'Odia',       native: 'ଓଡ଼ିଆ',     flag: '🇮🇳' },
  'goa':                  { code: 'mr', name: 'Marathi',    native: 'मराठी',      flag: '🇮🇳' },
  'manipur':              { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'nagaland':             { code: 'en', name: 'English',    native: 'English',    flag: '🇮🇳' },
  'meghalaya':            { code: 'en', name: 'English',    native: 'English',    flag: '🇮🇳' },
  'mizoram':              { code: 'en', name: 'English',    native: 'English',    flag: '🇮🇳' },
  'tripura':              { code: 'bn', name: 'Bengali',    native: 'বাংলা',       flag: '🇮🇳' },
  'sikkim':               { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'arunachal pradesh':    { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'jammu and kashmir':    { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
  'ladakh':               { code: 'hi', name: 'Hindi',      native: 'हिंदी',      flag: '🇮🇳' },
};

/* ══════════════════════════════════════════════════════════
   COUNTRY → LANGUAGE MAPPING (international)
══════════════════════════════════════════════════════════ */
export const COUNTRY_LANG_MAP = {
  'IN': { code: 'hi', name: 'Hindi',    native: 'हिंदी',    flag: '🇮🇳' },
  'US': { code: 'en', name: 'English',  native: 'English',  flag: '🇺🇸' },
  'GB': { code: 'en', name: 'English',  native: 'English',  flag: '🇬🇧' },
  'AU': { code: 'en', name: 'English',  native: 'English',  flag: '🇦🇺' },
  'CA': { code: 'en', name: 'English',  native: 'English',  flag: '🇨🇦' },
  'FR': { code: 'fr', name: 'French',   native: 'Français', flag: '🇫🇷' },
  'DE': { code: 'de', name: 'German',   native: 'Deutsch',  flag: '🇩🇪' },
  'AT': { code: 'de', name: 'German',   native: 'Deutsch',  flag: '🇦🇹' },
  'CH': { code: 'de', name: 'German',   native: 'Deutsch',  flag: '🇨🇭' },
  'ES': { code: 'es', name: 'Spanish',  native: 'Español',  flag: '🇪🇸' },
  'MX': { code: 'es', name: 'Spanish',  native: 'Español',  flag: '🇲🇽' },
  'AR': { code: 'es', name: 'Spanish',  native: 'Español',  flag: '🇦🇷' },
  'JP': { code: 'ja', name: 'Japanese', native: '日本語',    flag: '🇯🇵' },
  'CN': { code: 'zh', name: 'Chinese',  native: '中文',      flag: '🇨🇳' },
  'TW': { code: 'zh', name: 'Chinese',  native: '中文',      flag: '🇹🇼' },
  'RU': { code: 'ru', name: 'Russian',  native: 'Русский',  flag: '🇷🇺' },
  'SA': { code: 'ar', name: 'Arabic',   native: 'العربية',  flag: '🇸🇦' },
  'AE': { code: 'ar', name: 'Arabic',   native: 'العربية',  flag: '🇦🇪' },
  'BD': { code: 'bn', name: 'Bengali',  native: 'বাংলা',    flag: '🇧🇩' },
  'PK': { code: 'ur', name: 'Urdu',     native: 'اردو',     flag: '🇵🇰' },
};

/* ══════════════════════════════════════════════════════════
   LOCALIZED GREETINGS per language code
══════════════════════════════════════════════════════════ */
export const LOCALIZED_GREETINGS = {
  hi: { greeting: 'नमस्ते! 🙏', subtitle: 'Main aapka AI Health Companion hoon. Apna health sawaal Hindi mein poochein.', welcome: 'स्वागत है! हम आपकी स्वास्थ्य सेवा के लिए यहाँ हैं।' },
  pa: { greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏', subtitle: 'ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਆਪਣਾ ਸਿਹਤ ਸਵਾਲ ਪੁੱਛੋ।', welcome: 'ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਅਸੀਂ ਤੁਹਾਡੀ ਸਿਹਤ ਲਈ ਇੱਥੇ ਹਾਂ।' },
  gu: { greeting: 'નમસ્તે! 🙏', subtitle: 'હું તમારો AI આરોગ્ય સહાયક છું. તમારો આરોગ્ય પ્રશ્ન પૂછો.', welcome: 'આપનું સ્વાગત છે! અમે આપની આરોગ્ય સેવા માટે અહીં છીએ.' },
  mr: { greeting: 'नमस्कार! 🙏', subtitle: 'मी तुमचा AI आरोग्य सहाय्यक आहे. तुमचा आरोग्य प्रश्न विचारा.', welcome: 'आपले स्वागत आहे! आम्ही आपल्या आरोग्यासाठी येथे आहोत.' },
  bn: { greeting: 'নমস্কার! 🙏', subtitle: 'আমি আপনার AI স্বাস্থ্য সহায়ক। আপনার স্বাস্থ্য প্রশ্ন করুন।', welcome: 'আপনাকে স্বাগতম! আমরা আপনার স্বাস্থ্যসেবার জন্য এখানে আছি।' },
  kn: { greeting: 'ನಮಸ್ಕಾರ! 🙏', subtitle: 'ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆ ಕೇಳಿ.', welcome: 'ಸ್ವಾಗತ! ನಾವು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವೆಗಾಗಿ ಇಲ್ಲಿದ್ದೇವೆ.' },
  ml: { greeting: 'നമസ്‌തേ! 🙏', subtitle: 'ഞാൻ നിങ്ങളുടെ AI ആരോഗ്യ സഹായിയാണ്. നിങ്ങളുടെ ചോദ്യം ചോദിക്കൂ.', welcome: 'സ്വാഗതം! ഞങ്ങൾ നിങ്ങളുടെ ആരോഗ്യ സേവനത്തിനായി ഇവിടെ ഉണ്ട്.' },
  ta: { greeting: 'வணக்கம்! 🙏', subtitle: 'நான் உங்கள் AI சுகாதார உதவியாளர். உங்கள் சுகாதார கேள்வியை கேளுங்கள்.', welcome: 'வரவேற்கிறோம்! உங்கள் சுகாதாரத்திற்காக நாங்கள் இங்கே இருக்கிறோம்.' },
  te: { greeting: 'నమస్కారం! 🙏', subtitle: 'నేను మీ AI ఆరోగ్య సహాయకుడిని. మీ ఆరోగ్య ప్రశ్న అడగండి.', welcome: 'స్వాగతం! మేము మీ ఆరోగ్య సేవ కోసం ఇక్కడ ఉన్నాం.' },
  as: { greeting: 'নমস্কাৰ! 🙏', subtitle: 'মই আপোনাৰ AI স্বাস্থ্য সহায়ক। আপোনাৰ স্বাস্থ্য প্ৰশ্ন সোধক।', welcome: 'আপোনাক স্বাগতম! আমি আপোনাৰ স্বাস্থ্যসেৱাৰ বাবে ইয়াত আছোঁ।' },
  or: { greeting: 'ନମସ୍କାର! 🙏', subtitle: 'ମୁଁ ଆପଣଙ୍କ AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।', welcome: 'ସ୍ୱାଗତ! ଆମେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ପାଇଁ ଏଠାରେ ଅଛୁ।' },
  fr: { greeting: 'Bonjour! 👋', subtitle: "Je suis votre assistant de santé IA. Posez votre question en français.", welcome: 'Bienvenue! Nous sommes là pour vos besoins de santé.' },
  de: { greeting: 'Hallo! 👋', subtitle: 'Ich bin Ihr KI-Gesundheitsassistent. Stellen Sie Ihre Frage auf Deutsch.', welcome: 'Willkommen! Wir sind für Ihre Gesundheitsversorgung hier.' },
  es: { greeting: '¡Hola! 👋', subtitle: 'Soy su asistente de salud IA. Haga su pregunta en español.', welcome: '¡Bienvenido! Estamos aquí para sus necesidades de salud.' },
  ja: { greeting: 'こんにちは！ 👋', subtitle: '私はあなたのAI健康アシスタントです。日本語で質問してください。', welcome: 'ようこそ！私たちはあなたの医療ニーズのためにここにいます。' },
  zh: { greeting: '你好！ 👋', subtitle: '我是您的AI健康助手。请用中文提问。', welcome: '欢迎！我们在此为您的医疗保健需求服务。' },
  ru: { greeting: 'Здравствуйте! 👋', subtitle: 'Я ваш AI-помощник по здоровью. Задайте вопрос на русском.', welcome: 'Добро пожаловать! Мы здесь для вашего здравоохранения.' },
  ar: { greeting: 'مرحبا! 👋', subtitle: 'أنا مساعدك الصحي الذكي. اسأل سؤالك بالعربية.', welcome: 'أهلاً وسهلاً! نحن هنا لخدمة احتياجاتك الصحية.' },
  en: { greeting: 'Hello! 👋', subtitle: "I'm your AI Health Assistant. Ask your health question in English.", welcome: 'Welcome! We are here to serve your healthcare needs.' },
};

/* ══════════════════════════════════════════════════════════
   LOCALIZED EMERGENCY INSTRUCTIONS
══════════════════════════════════════════════════════════ */
export const LOCALIZED_EMERGENCY = {
  hi: {
    heartAttack: ['तुरंत 108 डायल करें', 'मरीज को सीधे लिटाएं', 'कपड़े ढीले करें', 'एस्पिरिन 325mg दें', 'CPR शुरू करें'],
    snakeBite:   ['हिलें-डुलें नहीं', 'घाव से ऊपर बांधें नहीं', 'तुरंत अस्पताल जाएं', '108 कॉल करें'],
    burns:       ['10 मिनट ठंडे पानी से धोएं', 'कपड़ा न लगाएं', 'छाले न फोड़ें', 'अस्पताल जाएं'],
    cta: 'तुरंत मदद के लिए 108 डायल करें',
  },
  pa: {
    heartAttack: ['ਤੁਰੰਤ 108 ਡਾਇਲ ਕਰੋ', 'ਮਰੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਲਿਟਾਓ', 'ਕੱਪੜੇ ਢਿੱਲੇ ਕਰੋ', 'ਐਸਪਿਰਿਨ 325mg ਦਿਓ', 'CPR ਸ਼ੁਰੂ ਕਰੋ'],
    snakeBite:   ['ਹਿਲਣਾ ਨਾ', 'ਜ਼ਖਮ ਬੰਨ੍ਹਣਾ ਨਾ', 'ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ', '108 ਕਾਲ ਕਰੋ'],
    burns:       ['10 ਮਿੰਟ ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਧੋਵੋ', 'ਕੱਪੜਾ ਨਾ ਲਗਾਓ', 'ਛਾਲੇ ਨਾ ਤੋੜੋ', 'ਹਸਪਤਾਲ ਜਾਓ'],
    cta: 'ਤੁਰੰਤ ਮਦਦ ਲਈ 108 ਡਾਇਲ ਕਰੋ',
  },
  gu: {
    heartAttack: ['તાત્કાલિક 108 ડાયલ કરો', 'દર્દીને સૂઈ જવા દો', 'કપડા ઢીલા કરો', 'એસ્પિરિન 325mg આપો', 'CPR શરૂ કરો'],
    snakeBite:   ['હલો-ચાલો નહીં', 'ઘા ઉપર ન બાંધો', 'તાત્કાલિક હોસ્પિટલ જાઓ', '108 કૉલ કરો'],
    burns:       ['10 મિનિટ ઠંડા પાણીથી ધોઓ', 'કપડું ન લગાવો', 'ફોડ ન ફોડો', 'હોસ્પિટલ જાઓ'],
    cta: 'તાત્કાલિક મદદ માટે 108 ડાયલ કરો',
  },
  mr: {
    heartAttack: ['त्वरित 108 डायल करा', 'रुग्णाला सरळ झोपवा', 'कपडे सैल करा', 'अॅस्पिरिन 325mg द्या', 'CPR सुरू करा'],
    snakeBite:   ['हलू नका', 'जखमेवर बांधू नका', 'त्वरित रुग्णालयात जा', '108 कॉल करा'],
    burns:       ['10 मिनिटे थंड पाण्याने धुवा', 'कपडा लावू नका', 'फोड फोडू नका', 'रुग्णालयात जा'],
    cta: 'त्वरित मदतीसाठी 108 डायल करा',
  },
  bn: {
    heartAttack: ['অবিলম্বে 108 ডায়াল করুন', 'রোগীকে শুইয়ে দিন', 'কাপড় ঢিলা করুন', 'অ্যাসপিরিন 325mg দিন', 'CPR শুরু করুন'],
    snakeBite:   ['নড়াচড়া করবেন না', 'ক্ষতস্থানের উপরে বাঁধবেন না', 'দ্রুত হাসপাতালে যান', '108 কল করুন'],
    burns:       ['10 মিনিট ঠান্ডা জল দিয়ে ধুন', 'কাপড় লাগাবেন না', 'ফোস্কা ফাটাবেন না', 'হাসপাতালে যান'],
    cta: 'তাৎক্ষণিক সাহায্যের জন্য 108 ডায়াল করুন',
  },
  ta: {
    heartAttack: ['உடனடியாக 108 அழைக்கவும்', 'நோயாளியை படுக்கவையுங்கள்', 'ஆடைகளை தளர்த்துங்கள்', 'ஆஸ்பிரின் 325mg கொடுங்கள்', 'CPR தொடங்குங்கள்'],
    snakeBite:   ['அசையாதீர்கள்', 'மேலே கட்டாதீர்கள்', 'உடனே மருத்துவமனை செல்லுங்கள்', '108 அழைக்கவும்'],
    burns:       ['10 நிமிடம் குளிர்ந்த நீரில் கழுவுங்கள்', 'துணி வைக்காதீர்கள்', 'கொப்புளம் உடைக்காதீர்கள்', 'மருத்துவமனை செல்லுங்கள்'],
    cta: 'உடனடி உதவிக்கு 108 அழைக்கவும்',
  },
  te: {
    heartAttack: ['వెంటనే 108 డయల్ చేయండి', 'రోగిని పడుకోబెట్టండి', 'బట్టలు వదులు చేయండి', 'ఆస్పిరిన్ 325mg ఇవ్వండి', 'CPR ప్రారంభించండి'],
    snakeBite:   ['కదలకండి', 'గాయం పైన కట్టు వేయకండి', 'వెంటనే ఆసుపత్రికి వెళ్ళండి', '108 కాల్ చేయండి'],
    burns:       ['10 నిమిషాలు చల్లని నీటితో కడగండి', 'బట్ట వేయకండి', 'బొబ్బలు పగలకొట్టకండి', 'ఆసుపత్రికి వెళ్ళండి'],
    cta: 'తక్షణ సహాయానికి 108 డయల్ చేయండి',
  },
  kn: {
    heartAttack: ['ತಕ್ಷಣ 108 ಡಯಲ್ ಮಾಡಿ', 'ರೋಗಿಯನ್ನು ಮಲಗಿಸಿ', 'ಬಟ್ಟೆ ಸಡಿಲ ಮಾಡಿ', 'ಅಸ್ಪಿರಿನ್ 325mg ಕೊಡಿ', 'CPR ಪ್ರಾರಂಭಿಸಿ'],
    snakeBite:   ['ಅಲ್ಲಾಡಬೇಡಿ', 'ಗಾಯದ ಮೇಲೆ ಕಟ್ಟಬೇಡಿ', 'ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ', '108 ಕರೆ ಮಾಡಿ'],
    burns:       ['10 ನಿಮಿಷ ತಣ್ಣೀರಿನಲ್ಲಿ ತೊಳೆಯಿರಿ', 'ಬಟ್ಟೆ ಹಾಕಬೇಡಿ', 'ಗುಳ್ಳೆ ಒಡೆಯಬೇಡಿ', 'ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ'],
    cta: 'ತಕ್ಷಣ ಸಹಾಯಕ್ಕಾಗಿ 108 ಡಯಲ್ ಮಾಡಿ',
  },
  ml: {
    heartAttack: ['ഉടനടി 108 ഡയൽ ചെയ്യൂ', 'രോഗിയെ കിടത്തൂ', 'വസ്ത്രം അഴിക്കൂ', 'അസ്പിരിൻ 325mg കൊടുക്കൂ', 'CPR ആരംഭിക്കൂ'],
    snakeBite:   ['അനങ്ങരുത്', 'മുറിക്ക് മുകളിൽ കെട്ടരുത്', 'ആശുപത്രിയിൽ പോകൂ', '108 വിളിക്കൂ'],
    burns:       ['10 മിനിറ്റ് തണുത്ത വെള്ളം ഒഴിക്കൂ', 'തുണി ഇടരുത്', 'കുമിള പൊട്ടിക്കരുത്', 'ആശുപത്രിയിൽ പോകൂ'],
    cta: 'ഉടനടി സഹായത്തിന് 108 ഡയൽ ചെയ്യൂ',
  },
  en: {
    heartAttack: ['Call 108 immediately', 'Lay patient flat', 'Loosen clothing', 'Give Aspirin 325mg', 'Start CPR'],
    snakeBite:   ["Don't move", "Don't tie above wound", 'Rush to hospital', 'Call 108'],
    burns:       ['Rinse with cold water 10 min', "Don't apply cloth", "Don't burst blisters", 'Go to hospital'],
    cta: 'Dial 108 for immediate help',
  },
  fr: {
    heartAttack: ['Appelez le 15 immédiatement', 'Allongez le patient', 'Desserrez les vêtements', 'Donnez Aspirine 325mg', 'Commencez la RCP'],
    snakeBite:   ['Ne bougez pas', 'Ne liez pas au-dessus', 'Allez à l\'hôpital', 'Appelez le 15'],
    burns:       ['Rincez à l\'eau froide 10 min', 'Ne couvrez pas', 'Ne percez pas les cloques', 'Allez à l\'hôpital'],
    cta: 'Composez le 15 pour une aide immédiate',
  },
  de: {
    heartAttack: ['112 sofort anrufen', 'Patient hinlegen', 'Kleidung lockern', 'Aspirin 325mg geben', 'CPR beginnen'],
    snakeBite:   ['Nicht bewegen', 'Nicht abbinden', 'Sofort ins Krankenhaus', '112 anrufen'],
    burns:       ['10 Min. mit kaltem Wasser kühlen', 'Kein Stoff auflegen', 'Blasen nicht öffnen', 'Ins Krankenhaus'],
    cta: 'Wählen Sie 112 für sofortige Hilfe',
  },
  es: {
    heartAttack: ['Llame al 112 inmediatamente', 'Acueste al paciente', 'Afloje la ropa', 'Dé Aspirina 325mg', 'Inicie RCP'],
    snakeBite:   ['No se mueva', 'No ate encima', 'Vaya al hospital', 'Llame al 112'],
    burns:       ['Enjuague con agua fría 10 min', 'No aplique tela', 'No reviente ampollas', 'Vaya al hospital'],
    cta: 'Marque 112 para ayuda inmediata',
  },
  ja: {
    heartAttack: ['すぐに119番に電話', '患者を横にする', '衣服を緩める', 'アスピリン325mg投与', 'CPR開始'],
    snakeBite:   ['動かない', '上を縛らない', 'すぐに病院へ', '119番に電話'],
    burns:       ['10分冷水で冷やす', '布を当てない', '水ぶくれを潰さない', '病院へ'],
    cta: '119番に電話してください',
  },
};

/* ══════════════════════════════════════════════════════════
   STATE HEALTH SCHEMES per state
══════════════════════════════════════════════════════════ */
export const STATE_SCHEMES = {
  'uttar pradesh':  ['Mukhyamantri Aarogya Yojana', 'Janani Suraksha Yojana', 'UP Family Health Card'],
  'maharashtra':    ['Mahatma Phule Jan Arogya Yojana', 'Rajiv Gandhi Jeevandayee', 'Aaple Sarkar Health'],
  'gujarat':        ['Mukhyamantri Amrutum Yojana', 'MA Vatsalya', 'Nirogi Gujarat'],
  'punjab':         ['Sarbat Sehat Bima Yojana', 'Punjab Arogya Yojana', 'Mata Kaushalya Yojana'],
  'karnataka':      ['Arogya Karnataka', 'Vajpayee Arogyashri', 'Mukhyamantri Santwana Harish'],
  'kerala':         ['Karunya Arogya Suraksha Padhathi', 'CHIS Plus', 'Pradhan Mantri Jan Arogya'],
  'tamil nadu':     ['Chief Minister Comprehensive Health Insurance', 'Muthulakshmi Reddy Maternity', 'Dr. Muthulakshmi Scheme'],
  'west bengal':    ['Swasthya Sathi', 'Banglar Bari', 'WB Health Scheme'],
  'telangana':      ['Aarogyasri', 'Rajiv Aarogyasri', 'Telangana Health Scheme'],
  'andhra pradesh': ['YSR Aarogyasri', 'NTR Vaidya Seva', 'AP Health Card'],
};

/* ══════════════════════════════════════════════════════════
   DEFAULT LANGUAGE
══════════════════════════════════════════════════════════ */
const DEFAULT_LANG = { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' };
const LS_KEY = 'setuhealth_lang';

/* ══════════════════════════════════════════════════════════
   CONTEXT
══════════════════════════════════════════════════════════ */
const GeoLangContext = createContext(null);

export const GeoLangProvider = ({ children }) => {
  const [detectedState,    setDetectedState]    = useState(null);
  const [detectedCountry,  setDetectedCountry]  = useState(null);
  const [detectedDistrict, setDetectedDistrict] = useState(null);
  const [detectedCity,     setDetectedCity]     = useState(null);
  const [activeLang,       setActiveLang]       = useState(() => {
    // Restore from localStorage on first render
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch { /* ignore */ }
    return DEFAULT_LANG;
  });
  const [detectionStatus,  setDetectionStatus]  = useState('idle');
  const [showPopup,        setShowPopup]        = useState(false);
  const [manualOverride,   setManualOverride]   = useState(() => !!localStorage.getItem(LS_KEY));
  /* Toast notification state */
  const [langToast,        setLangToast]        = useState(null); // { message, lang }
  const toastTimerRef = useRef(null);

  /* ── Sync active language with i18next ── */
  const syncI18n = useCallback((langCode) => {
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }
  }, []);

  /* ── Show language-changed toast ── */
  const showLangToast = useCallback((message, lang) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setLangToast({ message, lang });
    toastTimerRef.current = setTimeout(() => setLangToast(null), 5000);
  }, []);

  /* ── Apply a language entry (internal) ── */
  const applyLang = useCallback((entry, persist = true, toastMsg = null) => {
    setActiveLang(entry);
    syncI18n(entry.code);
    if (persist) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(entry)); } catch { /* ignore */ }
    }
    if (toastMsg) showLangToast(toastMsg, entry);
  }, [syncI18n, showLangToast]);

  /* ── Reverse-geocode via nominatim (no API key needed) ── */
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.address || {};
      const state    = (addr.state || '').toLowerCase().trim();
      const district = addr.county || addr.district || addr.state_district || '';
      const city     = addr.city || addr.town || addr.village || addr.hamlet || '';
      const country  = addr.country_code ? addr.country_code.toUpperCase() : '';
      return { state, district, city, country };
    } catch {
      return null;
    }
  }, []);

  /* ── IP-based fallback via ipapi.co ── */
  const ipGeoDetect = useCallback(async () => {
    try {
      const res  = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const country = (data.country_code || '').toUpperCase();
      if (country === 'IN') {
        const state = (data.region || '').toLowerCase().trim();
        const city  = data.city || '';
        return { state, district: city, city, country };
      }
      return { state: '', district: '', city: data.city || '', country };
    } catch {
      return null;
    }
  }, []);

  /* ── Main detection orchestrator ── */
  const detectLocation = useCallback(() => {
    if (manualOverride) return;
    setDetectionStatus('detecting');

    const applyState = (state, district, city, country) => {
      setDetectedState(state);
      setDetectedDistrict(district);
      setDetectedCity(city);
      setDetectedCountry(country);

      let langEntry;
      if (country === 'IN' && STATE_LANG_MAP[state]) {
        langEntry = STATE_LANG_MAP[state];
      } else if (COUNTRY_LANG_MAP[country]) {
        langEntry = COUNTRY_LANG_MAP[country];
      } else {
        langEntry = DEFAULT_LANG;
      }

      applyLang(langEntry, true, 'Language changed based on your location.');
      setDetectionStatus('done');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 6000);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const result = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (result) {
            applyState(result.state, result.district, result.city, result.country);
          } else {
            const ipResult = await ipGeoDetect();
            if (ipResult) applyState(ipResult.state, ipResult.district, ipResult.city, ipResult.country);
            else setDetectionStatus('failed');
          }
        },
        async () => {
          const ipResult = await ipGeoDetect();
          if (ipResult) applyState(ipResult.state, ipResult.district, ipResult.city, ipResult.country);
          else setDetectionStatus('failed');
        },
        { timeout: 8000 }
      );
    } else {
      ipGeoDetect().then((ipResult) => {
        if (ipResult) applyState(ipResult.state, ipResult.district, ipResult.city, ipResult.country);
        else setDetectionStatus('failed');
      });
    }
  }, [manualOverride, reverseGeocode, ipGeoDetect, applyLang]);

  /* ── Run on mount (skip if manual override already stored) ── */
  useEffect(() => {
    if (!manualOverride) {
      detectLocation();
    } else {
      // Still sync i18n to the stored language
      syncI18n(activeLang.code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Manual language override ── */
  const setLanguageManually = useCallback((langCode) => {
    const allLangs = [
      ...Object.values(STATE_LANG_MAP),
      ...Object.values(COUNTRY_LANG_MAP),
    ];
    const entry = allLangs.find(l => l.code === langCode)
      || { code: langCode, name: langCode, native: langCode, flag: '🌐' };
    // Deduplicate
    const dedupedEntry = { code: entry.code, name: entry.name, native: entry.native, flag: entry.flag };
    applyLang(dedupedEntry, true, 'Language changed manually.');
    setManualOverride(true);
    setDetectionStatus('manual');
  }, [applyLang]);

  const greeting   = LOCALIZED_GREETINGS[activeLang.code] || LOCALIZED_GREETINGS.en;
  const emergency  = LOCALIZED_EMERGENCY[activeLang.code]  || LOCALIZED_EMERGENCY.en;
  const schemes    = STATE_SCHEMES[detectedState] || ['Pradhan Mantri Jan Arogya Yojana (PMJAY)', 'Ayushman Bharat', 'National Health Mission'];

  return (
    <GeoLangContext.Provider value={{
      activeLang, setActiveLang,
      detectedState, detectedDistrict, detectedCity, detectedCountry,
      detectionStatus,
      showPopup, setShowPopup,
      manualOverride, setLanguageManually,
      detectLocation,
      greeting, emergency, schemes,
      langToast, setLangToast,
    }}>
      {children}
    </GeoLangContext.Provider>
  );
};

export const useGeoLang = () => {
  const ctx = useContext(GeoLangContext);
  if (!ctx) throw new Error('useGeoLang must be used inside GeoLangProvider');
  return ctx;
};
