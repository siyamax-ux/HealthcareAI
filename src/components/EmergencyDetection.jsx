import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Activity, Thermometer, ShieldAlert, Zap, AlertTriangle, 
  CheckCircle2, ArrowRight, PhoneCall, Stethoscope, RefreshCw,
  Search, Mic, MicOff, Volume2, Wifi, WifiOff, FileText, ArrowLeft,
  Play, Pause, Square, AlertCircle, Sparkles, Check, X, Download,
  ShieldCheck, ChevronRight
} from 'lucide-react';

// Localized first-aid guidelines for supported regional Indian languages
const LOCALIZED_EMERGENCY_DATA = {
  hi: {
    'heart-attack': {
      title: 'हार्ट अटैक (दिल का दौरा) गाइड',
      instructions: [
        'मरीज को तुरंत फर्श पर आरामदायक स्थिति में बैठाएं, पीठ को दीवार का सहारा दें।',
        'गले और छाती के आसपास के तंग कपड़ों को ढीला करें।',
        'पूछें कि क्या उनके पास छाती के दर्द की दवा (नाइट्रोग्लिसरीन) है। यदि हाँ, तो उसे लेने में मदद करें।',
        'यदि एलर्जी न हो, तो मरीज को एक पूरी एस्पिरिन (325mg) चबाकर निगलने को कहें।',
        'कमरे को हवादार रखें और मरीज को शांत रखें।',
        'यदि मरीज बेहोश हो जाता है और सांस लेना बंद कर देता है, तो तुरंत सीपीआर (CPR) शुरू करें।'
      ],
      warnings: [
        'मरीज को किसी भी परिस्थिति में चलने या खुद को थकाने न दें।',
        'मरीज को भारी भोजन या पानी न दें।',
        'लक्षणों के कम होने की प्रतीक्षा न करें। तुरंत आपातकालीन डॉक्टर को कॉल करें।'
      ]
    },
    'cpr': {
      title: 'कार्डियक अरेस्ट और सीपीआर',
      instructions: [
        'मरीज को पीठ के बाल सख्त, सपाट सतह (फर्श) पर लिटाएं।',
        'मरीज की छाती के बगल में घुटनों के बल बैठें। एक हाथ की हथेली को छाती के केंद्र (हड्डी के निचले हिस्से) पर रखें।',
        'दूसरे हाथ को पहले हाथ के ऊपर रखें और उंगलियों को आपस में जोड़ें। कोहनी सीधी रखें।',
        'तेजी से और जोर से दबाएं: छाती को 2 से 2.4 इंच गहरा दबाएं, प्रति मिनट 100 से 120 बार की गति से।',
        'दबावों के बीच छाती को पूरी तरह से ऊपर आने दें।',
        'यदि प्रशिक्षित हैं, तो प्रत्येक 30 दबावों के बाद 2 बार मुंह से सांस दें। अन्यथा, केवल हाथ से सीपीआर जारी रखें।',
        'यदि एईडी (AED) उपलब्ध है, तो उसे तुरंत चालू करें और उसके निर्देशों का पालन करें।'
      ],
      warnings: [
        'दबाव देना बंद न करें। डॉक्टरों के आने तक लगातार करते रहें।',
        '10 सेकंड से ज्यादा नाड़ी की जांच न करें। संदेह होने पर सीधे दबाव शुरू करें।'
      ]
    },
    'snake-bite': {
      title: 'सांप के काटने का प्राथमिक उपचार',
      instructions: [
        'मरीज को सांप से दूर सुरक्षित स्थान पर ले जाएं। सांप का रंग और आकार याद रखने की कोशिश करें।',
        'मरीज को शांत और स्थिर रखें। चलने-फिरने से जहर शरीर में तेजी से फैलता है।',
        'काटे गए अंग से तंग कपड़े, अंगूठियां, कड़े या जूते हटा दें (क्योंकि वहां सूजन आ जाएगी)।',
        'काटे गए हिस्से को दिल के स्तर के बराबर या उससे थोड़ा नीचे रखें।',
        'घाव को पानी से धीरे से साफ करें। रगड़ें नहीं। साफ सूखे कपड़े से ढकें।',
        'अंग को एक ढीली खपच्ची (splint) या पट्टी से स्थिर करें ताकि वह हिले-डुले नहीं।'
      ],
      warnings: [
        'घाव को काटें नहीं और न ही जहर को मुंह से चूसने की कोशिश करें।',
        'अंग पर बहुत तंग पट्टी (tourniquet) न बांधें। रक्तसंचार बंद होने से अंग खराब हो सकता है।',
        'घाव पर बर्फ न लगाएं और न ही मरीज को शराब या एस्पिरिन दें।'
      ]
    }
  },
  ta: {
    'heart-attack': {
      title: 'மாரடைப்பு அவசர சிகிச்சை',
      instructions: [
        'நோயாளியை உடனடியாக தரையில் வசதியான நிலையில் அமர வைக்கவும், சுவரில் சாய்க்கவும்.',
        'கழுத்து, மார்புப் பகுதியில் உள்ள இறுக்கமான ஆடைகளைத் தளர்த்தவும்.',
        'நெஞ்சு வலி மாத்திரை (நைட்ரோகிளிசரின்) உள்ளதா எனக் கேட்டு, உதவவும்.',
        'ஒவ்வாமை இல்லை எனில், ஒரு ஆஸ்பிரின் (325mg) மாத்திரையை மென்று விழுங்கச் சொல்லவும்.',
        'அறையை காற்றோட்டமாக வைத்து, நோயாளியை அமைதிப்படுத்தவும்.',
        'நோயாளி மயக்கமடைந்து சுவாசம் நின்றால் உடனடியாக சிபிஆர் (CPR) செய்யவும்.'
      ],
      warnings: [
        'நோயாளியை எந்தச் சூழ்நிலையிலும் நடக்கவோ அசைவதற்கோ அனுமதிக்கக் கூடாது.',
        'நோயாளிகளுக்கு கடுமையான உணவு அல்லது நீர் தரக் கூடாது.',
        'அறிகுறிகள் குறையும் வரை காத்திருக்க வேண்டாம். உடனடியாக 108 ஐ அழைக்கவும்.'
      ]
    },
    'cpr': {
      title: 'மாரடைப்பு & சிபிஆர் (CPR)',
      instructions: [
        'நோயாளியை கடினமான, தட்டையான தரைப்பகுதியில் நேராகப் படுக்க வைக்கவும்.',
        'மார்பின் மையப்பகுதியில் ஒரு கையின் அடிப்பகுதியை வைத்து, மற்றொரு கையை அதன் மேல் கோர்த்துக்கொள்ளவும்.',
        'முழங்கைகளை வளைக்காமல் நிமிடத்திற்கு 100-120 முறை என்ற வேகத்தில் மார்பை 2 அங்குல ஆழத்திற்கு அழுத்தவும்.',
        'மார்பு அழுத்தங்களுக்கு இடையில் முழுமையாக விரிவடைய அனுமதிக்கவும்.',
        'பயிற்சி பெற்றிருந்தால், 30 அழுத்தங்களுக்குப் பிறகு 2 முறை செயற்கை சுவாசம் அளிக்கவும். இல்லையெனில் அழுத்தங்களை மட்டும் தொடரவும்.',
        'இயக்கக்கூடிய AED சாதனம் இருந்தால், அதை உடனடியாக ஆன் செய்து வழிமுறைகளைப் பின்பற்றவும்.'
      ],
      warnings: [
        'மருத்துவ உதவி வரும் வரை அழுத்தங்களை நிறுத்தக் கூடாது.',
        '10 வினாடிகளுக்கு மேல் நாடித் துடிப்பைச் சரிபார்க்க நேரத்தை வீணடிக்க வேண்டாம்.'
      ]
    },
    'snake-bite': {
      title: 'பாம்பு கடி முதலுதவி',
      instructions: [
        'பாம்பிடமிருந்து நோயாளியைப் பாதுகாப்பான இடத்திற்கு நகர்த்தவும்.',
        'நோயாளியை அமைதியாகவும் அசையாமலும் இருக்கச் செய்யவும். அசைவு விஷம் வேகமாக பரவ வழிவகுக்கும்.',
        'கடிபட்ட பகுதியில் உள்ள இறுக்கமான ஆடைகள், மோதிரங்கள், காப்புகளை அகற்றவும்.',
        'கடிபட்ட பகுதியை இதய மட்டத்திற்கு கீழே இருக்குமாறு வைக்கவும்.',
        'கடிபட்ட இடத்தை நீரினால் மெதுவாகக் கழுவவும். தேய்க்கக் கூடாது. சுத்தமான துணியால் மூடவும்.',
        'கடிபட்ட கையை அல்லது காலை அசையாமல் வைக்க மரத்துண்டு அல்லது கட்டைப் பயன்படுத்தவும்.'
      ],
      warnings: [
        'கடிபட்ட இடத்தை கீறவோ அல்லது வாயால் விஷத்தை உறிஞ்சவோ முயற்சிக்கக் கூடாது.',
        'மிகவும் இறுக்கமான கட்டுகளைக் கட்டக் கூடாது (இரத்த ஓட்டம் தடைபடும்).',
        'பனிக்கட்டி வைக்கக் கூடாது; மது அருந்தக் கூடாது.'
      ]
    }
  },
  te: {
    'heart-attack': {
      title: 'గుండెపోటు నివారణ మార్గదర్శకాలు',
      instructions: [
        'రోగిని వెంటనే నేలపై ఒక సౌకర్యవంతమైన కూర్చునే స్థితిలో ఉంచండి, గోడకు ఆనించి కూర్చోబెట్టండి.',
        'మెడ, ఛాతీ చుట్టూ ఉన్న బిగుతుగా ఉన్న దుస్తులను సడలించండి.',
        'గుండె నొప్పికి వాడే నైట్రోగ్లిజరిన్ స్ప్రే/టాబ్లెట్లు రోగి వద్ద ఉన్నాయేమో అడిగి ఇవ్వండి.',
        'అలర్జీ లేకపోతే ఒక పూర్తి ఆస్పిరిన్ (325mg) మాత్రను నమిలి మింగమని చెప్పండి.',
        'గదిలో గాలి ప్రసరణ బాగా ఉండేలా చూసుకోండి, రోగిని ప్రశాంతంగా ఉంచండి.',
        'రోగి స్పృహ కోల్పోయి శ్వాస ఆగిపోతే వెంటనే సిపిఆర్ (CPR) ప్రారంభించండి.'
      ],
      warnings: [
        'ఎట్టి పరిస్థితుల్లోనూ రోగిని నడవనివ్వవద్దు లేదా శ్రమపడనివ్వవద్దు.',
        'రోగికి ఎలాంటి ఆహారం లేదా పానీయాలు ఇవ్వవద్దు.',
        'లక్షణాలు తగ్గుతాయేమో అని వేచి ఉండకండి. వెంటనే అత్యవసర చికిత్స కోసం పిలవండి.'
      ]
    },
    'cpr': {
      title: 'కార్డియాక్ అరెస్ట్ & సిపిఆర్ (CPR)',
      instructions: [
        'రోగిని గట్టి, ఫ్లాట్ ఉపరితలంపై (నేలపై) వెల్లకిలా పడుకోబెట్టండి.',
        'రోగి ఛాతీ పక్కన మోకాళ్లపై కూర్చోండి. మీ ఒక చేతిని ఛాతీ మధ్యలో ఉంచండి.',
        'రెండవ చేతిని మొదటి చేతిపై ఉంచి వేళ్లను లాక్ చేయండి. మోచేతులు తిన్నగా ఉంచండి.',
        'వేగంగా మరియు గట్టిగా నొక్కండి: ఛాతీని 2 నుండి 2.4 అంగుళాల లోతుకు, నిమిషానికి 100 నుండి 120 సార్లు నొక్కండి.',
        'నొక్కిన ప్రతిసారీ ఛాతీ మళ్లీ సాధారణ స్థితికి రావడానికి సమయం ఇవ్వండి.',
        'శిక్షణ పొందినట్లయితే, ప్రతి 30 ప్రెజర్ల తర్వాత 2 సార్లు నోటి ద్వారా శ్వాస ఇవ్వండి. లేదంటే చేతులతో మాత్రమే సిపిఆర్ కొనసాగించండి.',
        'ఆటోమేటిక్ డీఫిబ్రిలేటర్ (AED) అందుబాటులో ఉంటే, వెంటనే దాన్ని ఆన్ చేసి సూచనలను పాటించండి.'
      ],
      warnings: [
        'వైద్య సహాయం వచ్చే వరకు సిపిఆర్ ప్రెజర్స్ నిలిపివేయవద్దు.',
        'నాడి తనిఖీ కోసం 10 సెకన్ల కంటే ఎక్కువ సమయం వృథा చేయవద్దు.'
      ]
    }
  }
};

// Verification database for critical medical emergency situations
const EMERGENCY_DATABASE = {
  'heart-attack': {
    id: 'heart-attack',
    title: 'Heart Attack Response',
    category: 'Cardiac',
    severity: 'CRITICAL',
    riskScore: 9.6,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 124, oxygen: 92, bp: '95/60', temp: 98.4 },
    ambulanceRecommendation: 'ALS (Advanced Life Support) Cardiac Ambulance dispatched. Crew is equipped with oxygen, ECG, and defibrillator.',
    hospitalReferral: 'Referral: District General Hospital Cardiology Wing (A&E). ICU cardiac bed and doctor on-duty notified.',
    warnings: [
      'DO NOT let the patient walk or exert themselves under any circumstances.',
      'DO NOT give the patient heavy food or drink.',
      'DO NOT wait to see if symptoms pass. Time is muscle.'
    ],
    instructions: [
      'Sit the patient down immediately in a comfortable, seated position on the floor, leaning back against a wall or chair.',
      'Loosen any tight clothing around the neck, chest, and waist (collars, ties, belts).',
      'Ask the patient if they have prescribed chest pain medication (like Nitroglycerin spray/pills). If yes, help them administer it.',
      'If not allergic, have them chew and swallow one full adult Aspirin (325mg) or four low-dose baby Aspirins.',
      'Keep the room well-ventilated and keep patient warm and calm.',
      'Be prepared to perform CPR immediately if the patient loses consciousness and stops breathing.'
    ],
    youtubeId: 'gDwt7dD3awc',
    offlineCardText: 'Sit patient on floor leaning back. Loosen clothing. Assist with Nitroglycerin or 325mg Aspirin. Monitor breathing closely. Start CPR if unconscious.'
  },
  'cpr': {
    id: 'cpr',
    title: 'Cardiac Arrest & CPR',
    category: 'Cardiac',
    severity: 'CRITICAL',
    riskScore: 10.0,
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
    vitals: { heartRate: 0, oxygen: 0, bp: '0/0', temp: 97.6 },
    ambulanceRecommendation: 'ALS Emergency Resus Ambulance dispatched with high priority. ETA: 8 minutes.',
    hospitalReferral: 'Referral: Resuscitation Trauma Bay, Community General Hospital. ER specialist team alerted.',
    warnings: [
      'DO NOT delay CPR. Start compressions immediately.',
      'DO NOT stop compressions until medical professionals take over.'
    ],
    instructions: [
      'Place the patient flat on their back on a hard, flat surface (the floor).',
      'Kneel beside the patient\'s chest. Place the heel of one hand in the center of the chest (lower half of breastbone).',
      'Place your other hand on top, interlocking your fingers. Keep your elbows straight and shoulders directly over hands.',
      'Push hard and fast: Compress chest 2 to 2.4 inches deep, at a speed of 100 to 120 beats per minute (e.g., to the beat of "Stayin\' Alive").',
      'Allow the chest to recoil fully between compressions. Minimize interruptions.',
      'If trained and comfortable, deliver 2 rescue breaths after every 30 compressions. Otherwise, perform Hands-Only CPR (continuous compressions).',
      'If an AED (Defibrillator) is available, turn it on immediately and follow its verbal voice prompts.'
    ],
    youtubeId: 'O_49wM12qo4',
    offlineCardText: 'Lay flat on floor. Compress center of chest 2-2.4 inches deep at 100-120 compressions/min. 30 compressions to 2 rescue breaths. Use AED if available.'
  },
  'choking': {
    id: 'choking',
    title: 'Choking (Heimlich)',
    category: 'Respiratory',
    severity: 'CRITICAL',
    riskScore: 9.4,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 112, oxygen: 82, bp: '138/95', temp: 98.6 },
    ambulanceRecommendation: 'BLS Ambulance with suction apparatus and oxygen unit dispatched.',
    hospitalReferral: 'Referral: Emergency ENT ward, Civil Hospital. Airway specialist notified.',
    warnings: [
      'DO NOT perform abdominal thrusts on pregnant women or infants (under 1 year). Use chest thrusts/back blows instead.',
      'DO NOT try to perform a blind finger sweep. You might push the object deeper.'
    ],
    instructions: [
      'Stand behind the choking patient and wrap your arms around their waist.',
      'Make a fist with one hand and place the thumb-side slightly above the patient\'s belly button (navel).',
      'Grasp your fist with your other hand.',
      'Press into the patient\'s abdomen with a quick, upward, and inward thrust (Heimlich Maneuver).',
      'Repeat the abdominal thrusts until the food or foreign object is expelled, or the patient loses consciousness.',
      'If they lose consciousness, assist them to the floor, open the mouth to check for the object, and begin standard CPR immediately.'
    ],
    youtubeId: 'HGVVY9x43m0',
    offlineCardText: 'Stand behind patient. Fist above navel. Grasp fist with other hand. Thrust inward and upward. Repeat. If they pass out, start CPR.'
  },
  'snake-bite': {
    id: 'snake-bite',
    title: 'Snake Bite Care',
    category: 'Poison',
    severity: 'CRITICAL',
    riskScore: 9.1,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 104, oxygen: 96, bp: '110/70', temp: 99.2 },
    ambulanceRecommendation: 'Ambulance equipped with Polyvalent Anti-Snake Venom (ASV) vial kit dispatched.',
    hospitalReferral: 'Referral: Poison Control and Anti-Venom Center, District Government Hospital.',
    warnings: [
      'DO NOT cut the bite area or attempt to suck out the venom.',
      'DO NOT apply a tight tourniquet (you will cut off circulation and cause limb loss).',
      'DO NOT apply ice or submerge the bite in water.'
    ],
    instructions: [
      'Move the victim away from the snake to prevent further bites. Try to remember the snake\'s color/shape if safe.',
      'Keep the victim completely still and calm. Movement increases venom circulation through the lymphatic system.',
      'Remove any tight clothing, rings, bracelets, or shoes from the bitten limb (it will swell rapidly).',
      'Position the bitten limb so that it is level with or slightly below the patient\'s heart.',
      'Gently wash the bite area with water. Do not scrub it. Cover loosely with a clean, dry bandage.',
      'Immobilize the limb using a loose splint or pressure-immobilization bandage (wrap limb snug but not tight like a tourniquet).'
    ],
    youtubeId: 'xZeaC98-75k',
    offlineCardText: 'Keep victim calm and absolutely still. Remove rings/tight clothing. Keep limb at or below heart level. Wash gently, bandage loosely. Immobilize limb.'
  },
  'bleeding': {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    category: 'Injury',
    severity: 'CRITICAL',
    riskScore: 8.9,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    vitals: { heartRate: 118, oxygen: 95, bp: '90/58', temp: 98.2 },
    ambulanceRecommendation: 'Emergency Trauma Ambulance carrying pressure dressing and volume-expander IV fluids dispatched.',
    hospitalReferral: 'Referral: Emergency Surgery Triage Unit, District General Hospital.',
    warnings: [
      'DO NOT remove the bandage if blood leaks through. Put another clean bandage directly on top.',
      'DO NOT pull out deeply embedded objects. Bandage around the object to support it.'
    ],
    instructions: [
      'Put on protective gloves if available. Place a clean sterile gauze, cloth, or your hands directly over the wound.',
      'Apply firm, continuous pressure directly to the source of the bleeding for at least 5 minutes without checking.',
      'If the bleeding is on a limb, elevate the limb above the heart level while maintaining firm pressure.',
      'If blood flows through the dressing, wrap more gauze/cloth on top. Keep pressing. Do not pull off the bottom layer.',
      'Once bleeding stops, apply a pressure bandage snug enough to hold it but not cut off pulse.',
      'If bleeding is catastrophic and uncontrollable on a limb, apply a tourniquet 2-3 inches above the wound (never on joints) and note the time.'
    ],
    youtubeId: 'NxO5Lvgq804',
    offlineCardText: 'Apply firm direct pressure with clean cloth. Elevate limb above heart. Add more bandage layers if blood seeps through. Do not remove original bandage.'
  },
  'burns': {
    id: 'burns',
    title: 'Severe Burn Treatment',
    category: 'Injury',
    severity: 'HIGH',
    riskScore: 8.3,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    vitals: { heartRate: 98, oxygen: 98, bp: '115/75', temp: 100.2 },
    ambulanceRecommendation: 'Sterile dressing burn unit ambulance dispatched.',
    hospitalReferral: 'Referral: Specialized Burn Triage Center, Zonal Hospital.',
    warnings: [
      'DO NOT apply ice, ice-water, butter, oil, grease, or herbal paste to severe burns.',
      'DO NOT pop blisters. Popping blisters increases risk of severe bacterial infection.',
      'DO NOT remove clothing that is stuck to the burn site.'
    ],
    instructions: [
      'Immediately cool the burn under cool, gently running water for 10 to 20 minutes. Do not use freezing ice water.',
      'Gently remove rings, watches, or tight clothing from the burned area before swelling begins.',
      'Cover the burn loosely with a clean, sterile, non-stick gauze dressing or clean plastic food wrap.',
      'Keep the patient warm using a clean blanket (severe burns disrupt body temperature control).',
      'Keep the burned area elevated above the heart level if possible to reduce swelling.'
    ],
    youtubeId: 'EaJmzB8YgS0',
    offlineCardText: 'Cool under cool running water (10-20 mins). Remove rings/watches. Cover loosely with sterile non-stick bandage. Keep patient warm.'
  },
  'unconscious': {
    id: 'unconscious',
    title: 'Unconscious Patient (Recovery Position)',
    category: 'Cardiac',
    severity: 'CRITICAL',
    riskScore: 9.5,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 58, oxygen: 91, bp: '90/60', temp: 98.0 },
    ambulanceRecommendation: 'ALS Life Support Ambulance dispatched. Paramedics prepared for airway management.',
    hospitalReferral: 'Referral: Emergency ICU and Medical Ward, District Hospital.',
    warnings: [
      'DO NOT give food, water, or medication to an unconscious patient (they will choke).',
      'DO NOT place a pillow under the head of an unresponsive person (it can block the airway).'
    ],
    instructions: [
      'Tap the patient\'s shoulders and shout loudly, "Are you okay?" to check for responsiveness.',
      'Check for normal breathing: Look at the chest for movement, listen for breath sounds, feel for airflow on your cheek (5-10 seconds).',
      'If the patient is breathing normally but remains unconscious, roll them onto their side into the Recovery Position.',
      'To place in Recovery Position: Extend one arm up, bend the opposite knee, roll patient toward you onto their side, tilt chin up to keep airway open.',
      'If the patient is NOT breathing or breathing only gasps, start CPR compressions immediately.',
      'Stay with the patient, keep them warm, and monitor their breathing continuously.'
    ],
    youtubeId: 'eL_G0e4J8_o',
    offlineCardText: 'Check response and breathing. If breathing, place in Recovery Position on side, chin tilted up. If not breathing, start CPR.'
  },
  'seizures': {
    id: 'seizures',
    title: 'Seizure Response',
    category: 'Injury',
    severity: 'HIGH',
    riskScore: 8.1,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    vitals: { heartRate: 110, oxygen: 94, bp: '135/85', temp: 99.4 },
    ambulanceRecommendation: 'Basic Ambulance dispatched. Paramedics equipped with anticonvulsive guidelines.',
    hospitalReferral: 'Referral: Neurology Ward, Community Health Center.',
    warnings: [
      'DO NOT hold the person down or try to stop their movements.',
      'DO NOT put anything in the person\'s mouth (they will NOT swallow their tongue, but you may break their teeth or get bitten).'
    ],
    instructions: [
      'Ease the person gently down to the floor to prevent fall injuries.',
      'Turn the person gently onto one side. This helps clear saliva or vomit and keeps the airway clear.',
      'Clear the area around the person of anything hard, sharp, or hot that could cause injury.',
      'Put something soft and flat, like a folded jacket or towel, under their head.',
      'Remove eyeglasses and loosen ties, collars, or tight clothing around the neck.',
      'Time the seizure. If it lasts longer than 5 minutes or they have back-to-back seizures, notify emergency services immediately.'
    ],
    youtubeId: '7bws2J7k2r8', // General first aid reference
    offlineCardText: 'Lower to floor. Roll onto side. Protect head with cushion. Clear hard/sharp objects. Do not hold down or put objects in mouth. Time it.'
  },
  'stroke': {
    id: 'stroke',
    title: 'Stroke (F.A.S.T.) Recognition',
    category: 'Cardiac',
    severity: 'CRITICAL',
    riskScore: 9.3,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 85, oxygen: 95, bp: '165/102', temp: 98.6 },
    ambulanceRecommendation: 'Stroke-unit equipped ALS Ambulance dispatched. Paramedics equipped with thrombolytic checksheets.',
    hospitalReferral: 'Referral: Acute Stroke Unit, Regional Medical Hospital. Neurology emergency team activated.',
    warnings: [
      'DO NOT give the patient Aspirin, medicine, or any food/drink (stroke can cause severe swallowing difficulty).',
      'DO NOT let the patient sleep or ignore symptoms.'
    ],
    instructions: [
      'Conduct F.A.S.T. Assessment: FACE: Ask them to smile. Does one side of the face droop?',
      'ARM: Ask them to raise both arms. Does one arm drift downward?',
      'SPEECH: Ask them to repeat a simple sentence. Is their speech slurred, strange, or hard to understand?',
      'TIME: Note the exact time symptoms started. Stroke therapy (tPA) has a strict 3 to 4.5 hour window from symptom onset.',
      'Keep the patient calm, comfortable, and lying on their side (recovery position) if they feel dizzy or lose consciousness.',
      'Be prepared to give the arriving medical crew a timeline of the symptoms and a list of the patient\'s current medications.'
    ],
    youtubeId: 'wHn1w5R99pQ',
    offlineCardText: 'Check F.A.S.T. (Face drooping, Arm drift, Speech slurred, Time of onset). Do not give aspirin or food. Keep patient resting on side.'
  },
  'fracture': {
    id: 'fracture',
    title: 'Fracture & Splinting',
    category: 'Injury',
    severity: 'HIGH',
    riskScore: 7.8,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    vitals: { heartRate: 95, oxygen: 98, bp: '120/82', temp: 98.8 },
    ambulanceRecommendation: 'Ambulance equipped with orthopedic stabilization splints and pain management dispatched.',
    hospitalReferral: 'Referral: Orthopedic Triage Unit, Community Hospital.',
    warnings: [
      'DO NOT attempt to realign, push back, or force a broken bone or joint back into place.',
      'DO NOT test the bone by forcing the patient to walk or bend the limb.'
    ],
    instructions: [
      'Stop any bleeding first by applying direct pressure with a clean cloth around the wound (do not press on the bone).',
      'If it is an open fracture (bone protruding), cover the wound with a clean bandage. Do not touch or wash the bone.',
      'Immobilize the injured area. Use a splint (rolled newspapers, wooden boards, cardboard) placed above and below the fracture joint.',
      'Secure the splint with bandages, cloth, or tape. Tie it snug but not tight enough to cut off circulation.',
      'Apply a cold compress wrapped in a towel to reduce swelling and pain. Do not apply ice directly to skin.',
      'Keep the patient resting and elevate the injured limb if possible without causing further pain.'
    ],
    youtubeId: '7bws2J7k2r8', // General ortho care reference
    offlineCardText: 'Stop bleeding first. Cover open wounds. Immobilize using a splint above/below joint. Apply cold pack. Do not force bone back.'
  },
  'breathing-difficulties': {
    id: 'breathing-difficulties',
    title: 'Breathing Difficulty & Asthma',
    category: 'Respiratory',
    severity: 'CRITICAL',
    riskScore: 9.2,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    vitals: { heartRate: 115, oxygen: 88, bp: '130/85', temp: 98.6 },
    ambulanceRecommendation: 'ALS Ambulance equipped with nebulizer, oxygen cylinders, and CPAP mask dispatched.',
    hospitalReferral: 'Referral: Respiratory ICU Care unit, Civil Hospital.',
    warnings: [
      'DO NOT force the patient to lie down. Lying down makes breathing significantly harder.',
      'DO NOT leave the patient alone. Panic increases oxygen demand and worsens symptoms.'
    ],
    instructions: [
      'Sit the patient upright in a comfortable chair, or leaning forward slightly on a table. This opens the airway.',
      'Help the patient find and use their emergency rescue inhaler (usually blue, e.g., Salbutamol/Albuterol) with a spacer if available.',
      'Loosen any tight clothing around the neck and chest.',
      'Help the patient stay calm. Encourage slow, deep, pursed-lip breathing (breathe in through nose, blow out through mouth slowly).',
      'Ensure the room is free from smoke, dust, chemicals, or strong odors that might trigger asthma.',
      'Monitor oxygen saturation if a pulse oximeter is available. Administer supplemental oxygen if trained.'
    ],
    youtubeId: '9N4qO6Jv2p4',
    offlineCardText: 'Sit patient upright. Help them use their rescue inhaler (Albuterol). Loosen clothing. Keep calm. Encourage slow pursed-lip breathing.'
  }
};

// Search keywords mapped to emergency situations
const KEYWORD_MAP = [
  { keywords: ['heart', 'chest pain', 'cardiac', 'left arm', 'heavy chest', 'my father is having a heart attack'], target: 'heart-attack' },
  { keywords: ['not breathing', 'unconscious', 'faint', 'unresponsive', 'passed out', 'cpr', 'no pulse', 'heart stopped'], target: 'cpr' },
  { keywords: ['chok', 'throat', 'swallow object', 'airway block', 'gagging'], target: 'choking' },
  { keywords: ['snake', 'bite', 'cobra', 'viper', 'venom', 'poison bite'], target: 'snake-bite' },
  { keywords: ['bleed', 'cut', 'wound', 'blood loss', 'hemorrhage', 'artery'], target: 'bleeding' },
  { keywords: ['burn', 'fire', 'scald', 'boiling water', 'steam', 'hot oil'], target: 'burns' },
  { keywords: ['fainted', 'knocked out', 'unconscious but breathing', 'coma'], target: 'unconscious' },
  { keywords: ['seizure', 'fit', 'convulsion', 'shaking', 'epilepsy'], target: 'seizures' },
  { keywords: ['stroke', 'face droop', 'slurred speech', 'arm drift', 'fast', 'numbness'], target: 'stroke' },
  { keywords: ['fracture', 'broken', 'bone', 'splint', 'dislocated', 'joint snap'], target: 'fracture' },
  { keywords: ['breath', 'asthma', 'suffocating', 'wheezing', 'gasping', 'oxygen low'], target: 'breathing-difficulties' }
];

export const EmergencyDetection = () => {
  // Config & state
  const [searchQuery, setSearchQuery] = useState('');
  const [lowInternet, setLowInternet] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  
  // Voice Command States
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [showVoiceFallback, setShowVoiceFallback] = useState(false);
  
  // Emergency Mode states
  const [timerSeconds, setTimerSeconds] = useState(720); // 12 minutes default
  const [timerRunning, setTimerRunning] = useState(true);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isCallingDoctor, setIsCallingDoctor] = useState(false);
  const [doctorConnected, setDoctorConnected] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  // Library Category Filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // References
  const timerRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Normal vitals simulation selector (from the original Triage Simulator)
  const [selectedPreset, setSelectedPreset] = useState('critical');
  const presets = {
    safe: {
      riskLevel: "Green - Low Risk / Safe",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      heartRate: 72,
      oxygen: 98,
      bp: "120/80",
      temp: 98.6,
      recommendation: "Vitals within optimal range. Continue regular wellness checkups."
    },
    moderate: {
      riskLevel: "Yellow - Moderate Risk",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      heartRate: 104,
      oxygen: 94,
      bp: "138/90",
      temp: 101.2,
      recommendation: "Elevated body temperature and heart rate. Tele-consultation recommended within 2 hours."
    },
    critical: {
      riskLevel: "Red - Critical Emergency",
      color: "from-rose-500/20 to-red-600/20 border-rose-500/60 text-rose-400",
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse",
      heartRate: 128,
      oxygen: 88,
      bp: "85/55",
      temp: 103.5,
      recommendation: "CRITICAL: Immediate Hospital Referral & Emergency Ambulance Dispatch Recommended!"
    }
  };
  const currentPreset = presets[selectedPreset];

  // Countdown timer effect during active emergency
  useEffect(() => {
    if (activeEmergency && timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [activeEmergency, timerRunning, timerSeconds]);

  // Voice Command Web Speech API integration
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recObj = new SpeechRecognition();
      recObj.continuous = false;
      recObj.interimResults = false;
      recObj.lang = 'en-IN'; // Optimized for Indian English accents in rural villages

      recObj.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };

      recObj.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        processVoiceInput(text);
      };

      recObj.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setVoiceError(`Voice error: ${event.error}. Try presets or manual search.`);
        setIsListening(false);
      };

      recObj.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recObj;
    }
  }, []);

  const [currentLangCode, setCurrentLangCode] = useState('en');

  // Listen for language-changed custom events
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail && e.detail.lang) {
        setCurrentLangCode(e.detail.lang);
      }
    };
    window.addEventListener('language-changed', handleLangChange);
    
    // Initial fetch from localStorage
    const saved = localStorage.getItem('user_preferred_language');
    if (saved) {
      setCurrentLangCode(saved);
    }
    
    return () => window.removeEventListener('language-changed', handleLangChange);
  }, []);

  // Listen for custom trigger-emergency events (e.g. from the Floating SOS button)
  useEffect(() => {
    const handleTrigger = (e) => {
      if (e.detail && e.detail.id) {
        triggerEmergency(e.detail.id);
      }
    };
    window.addEventListener('trigger-emergency', handleTrigger);
    return () => window.removeEventListener('trigger-emergency', handleTrigger);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
    } else {
      if (speechRecognitionRef.current) {
        setVoiceError('');
        speechRecognitionRef.current.start();
      } else {
        // Fallback dialog for unsupported browsers (Safari on some platforms, embedded webviews)
        setShowVoiceFallback(true);
      }
    }
  };

  const processVoiceInput = (text) => {
    setSearchQuery(text);
    // Find best match in key word map
    let matchId = null;
    for (const item of KEYWORD_MAP) {
      if (item.keywords.some(kw => text.includes(kw))) {
        matchId = item.target;
        break;
      }
    }

    if (matchId && EMERGENCY_DATABASE[matchId]) {
      triggerEmergency(matchId);
    } else {
      setVoiceError(`Voice search complete. No direct critical trigger for "${text}". Try checking our search results.`);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const triggerEmergency = (emergencyId) => {
    const emergency = EMERGENCY_DATABASE[emergencyId];
    if (emergency) {
      setActiveEmergency(emergency);
      setTimerSeconds(600 + Math.floor(Math.random() * 300)); // 10-15 minutes ambulance timer
      setTimerRunning(true);
      setCompletedSteps({});
      setIsCallingDoctor(false);
      setDoctorConnected(false);
      
      // Auto scroll to emergency widget
      setTimeout(() => {
        document.getElementById('emergency')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Low-internet caching notification log
      if (typeof window !== 'undefined') {
        const cachedKey = `offline_emergency_${emergencyId}`;
        localStorage.setItem(cachedKey, JSON.stringify(emergency));
      }
    }
  };

  const closeEmergency = () => {
    setActiveEmergency(null);
    setSearchQuery('');
  };

  // Handle Search Queries
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    let bestMatch = null;
    
    // Exact or keyword match
    for (const item of KEYWORD_MAP) {
      if (item.keywords.some(kw => query.includes(kw)) || query.includes(item.target)) {
        bestMatch = item.target;
        break;
      }
    }

    if (bestMatch && EMERGENCY_DATABASE[bestMatch]) {
      triggerEmergency(bestMatch);
    } else {
      // General match
      const matchedKeys = Object.keys(EMERGENCY_DATABASE).filter(key => 
        EMERGENCY_DATABASE[key].title.toLowerCase().includes(query) ||
        EMERGENCY_DATABASE[key].offlineCardText.toLowerCase().includes(query)
      );

      if (matchedKeys.length > 0) {
        triggerEmergency(matchedKeys[0]);
      } else {
        alert("No critical matches found. Try entering keywords like 'cpr', 'heart attack', 'snake bite', 'bleeding', 'choking'.");
      }
    }
  };

  // Checklist handler
  const handleStepCheck = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Tele-Doctor Connection Simulator
  const startDoctorCall = () => {
    setIsCallingDoctor(true);
    setDoctorConnected(false);
    setTimeout(() => {
      setDoctorConnected(true);
    }, 2500); // Connects after 2.5s
  };

  const endDoctorCall = () => {
    setIsCallingDoctor(false);
    setDoctorConnected(false);
  };

  // Download Offline Card handler
  const handleDownloadCard = (emergency) => {
    setDownloadSuccess(true);
    
    // Save to local storage simulated cache
    localStorage.setItem(`offline_cached_${emergency.id}`, JSON.stringify(emergency));
    
    // Generate text printout/download
    const element = document.createElement("a");
    const file = new Blob([
      `🏥 GramSwasthya AI Offline Emergency Guide: ${emergency.title.toUpperCase()}\n`,
      `Risk Level: ${emergency.severity} (${emergency.riskScore}/10)\n`,
      `--------------------------------------------------\n\n`,
      `⚠️ WARNINGS:\n${emergency.warnings.map(w => `- ${w}`).join('\n')}\n\n`,
      `📋 EMERGENCY STEPS TO TAKE:\n${emergency.instructions.map((ins, i) => `${i+1}. ${ins}`).join('\n')}\n\n`,
      `--------------------------------------------------\n`,
      `DISCLAIMER: AI guidance is for emergency first-aid support only. Call 108 ambulance immediately.`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `FirstAid_${emergency.id}_OfflineCard.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Filter video library
  const filteredLibrary = Object.values(EMERGENCY_DATABASE).filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  // Resolve localized texts for active emergency guides
  const localizedData = activeEmergency ? (LOCALIZED_EMERGENCY_DATA[currentLangCode]?.[activeEmergency.id]) : null;
  const activeTitle = localizedData?.title || (activeEmergency?.title);
  const activeInstructions = localizedData?.instructions || (activeEmergency?.instructions || []);
  const activeWarnings = localizedData?.warnings || (activeEmergency?.warnings || []);

  return (
    <section id="emergency" className="py-24 relative overflow-hidden bg-slate-950/80 transition-all duration-300">
      
      {/* Glow Blobs */}
      <div className={`absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
        activeEmergency ? 'bg-red-500/10' : 'bg-rose-500/5'
      }`} />
      <div className={`absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
        activeEmergency ? 'bg-red-600/10' : 'bg-cyan-500/5'
      }`} />

      {/* Floating Action SOS Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-400 mb-4 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>AI Emergency Response Portal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Emergency Life-Saving Assistant
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Instant first-aid search, voice activated support, emergency dashboard, offline guidelines, and verified video streaming.
          </p>
        </div>

        {/* TOP STATUS BAR (Low-Internet Toggle + Offline Sync Status) */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800/80 backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Offline Triage Sync Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-500">First-aid cards cached locally on device for no-internet fallback.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Low Internet Mode Selector */}
            <button
              onClick={() => setLowInternet(!lowInternet)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-300 ${
                lowInternet 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lowInternet ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>Low-Internet Mode: {lowInternet ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            CASE A: ACTIVE EMERGENCY MODE ACTIVE PANEL
            ======================================================== */}
        {activeEmergency ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            
            {/* Red Alert Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-red-500/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white border border-red-500 animate-ping absolute pointer-events-none opacity-40" />
                  <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white border border-red-500 relative z-10 shadow-lg">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500 text-white animate-pulse">
                        {activeEmergency.severity}
                      </span>
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-mono">
                        Risk Score: {activeEmergency.riskScore}/10
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-1 tracking-tight">
                      Active Guide: {activeTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Ambulance Arrival Countdown Timer */}
                  <div className="px-5 py-3 rounded-2xl bg-slate-900/90 border border-red-500/30 text-center font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Ambulance ETA</span>
                    <span className="text-2xl font-extrabold text-red-500 flex items-center justify-center gap-1.5">
                      <PhoneCall className="w-4 h-4 animate-bounce text-red-500" />
                      {formatTime(timerSeconds)}
                    </span>
                  </div>
                  <button 
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title={timerRunning ? "Pause Timer" : "Resume Timer"}
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={closeEmergency}
                    className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Exit Guide</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Layout: Action Steps & Live Vitals, Doctor Calls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (8/12): First Aid Steps Checklist & Hazards */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Warnings / Hazards Box */}
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-red-400 uppercase tracking-wider">Critical Safety Warnings</h4>
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {activeWarnings.map((w, idx) => (
                          <li key={idx} className="leading-relaxed"><strong className="text-red-300">AVOID:</strong> {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Checklist steps */}
                <div className="p-6 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-base font-extrabold text-white">Emergency Response Checklist</h4>
                      <p className="text-xs text-slate-400">Mark items off as you perform them on the patient.</p>
                    </div>
                    {/* Progress indicator */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-400">
                        {Object.values(completedSteps).filter(Boolean).length} / {activeInstructions.length} Done
                      </span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: `${(Object.values(completedSteps).filter(Boolean).length / activeInstructions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeInstructions.map((ins, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleStepCheck(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                          completedSteps[idx] 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-300' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          completedSteps[idx] 
                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                            : 'border-slate-600'
                        }`}>
                          {completedSteps[idx] && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed">
                          <strong className="text-cyan-400 mr-1.5 font-mono">Step {idx + 1}:</strong>
                          {ins}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print / Download Card */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownloadCard(activeEmergency)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloadSuccess ? "Guide Downloaded!" : "Download Offline Guide Card"}</span>
                    </button>
                  </div>
                </div>

                {/* Ambulance Recommendation and Referral Hospital */}
                <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-4">
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Ambulance & Hospital Routing Status</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <span className="font-extrabold text-rose-400 block mb-1">Ambulance Services (Govt. 108 Dispatch)</span>
                      <p className="text-slate-400 leading-relaxed">{activeEmergency.ambulanceRecommendation}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <span className="font-extrabold text-cyan-400 block mb-1">Hospital Emergency Notification</span>
                      <p className="text-slate-400 leading-relaxed">{activeEmergency.hospitalReferral}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (5/12): Live Vitals Monitor, Video Stream or Offline Text Card */}
              <div className="lg:col-span-5 space-y-6">

                {/* Simulated Live Vitals Box */}
                <div className="p-6 rounded-2xl glass-card border border-rose-500/20 bg-slate-950/90 relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
                    Live Vitals Stream
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Patient Simulated Vitals Monitor</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Heart Rate</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-2xl font-black ${activeEmergency.vitals.heartRate === 0 ? 'text-red-500' : 'text-rose-500 animate-pulse'}`}>
                          {activeEmergency.vitals.heartRate}
                        </span>
                        <span className="text-[9px] text-slate-400">BPM</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">SpO2 (Oxygen)</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-2xl font-black ${activeEmergency.vitals.oxygen < 90 ? 'text-red-500' : 'text-cyan-400'}`}>
                          {activeEmergency.vitals.oxygen}%
                        </span>
                        <span className="text-[9px] text-slate-400">Oxygen</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Blood Pressure</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-purple-400">{activeEmergency.vitals.bp}</span>
                        <span className="text-[9px] text-slate-400">mmHg</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Body Temp</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-amber-400">{activeEmergency.vitals.temp}°F</span>
                        <span className="text-[9px] text-slate-400">Temp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Guidance Section / YouTube Embed or Low-Internet Static Panel */}
                <div className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Emergency Video Guidance</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-bold border border-cyan-500/20">
                      Verified Health Resource
                    </span>
                  </h4>

                  {lowInternet ? (
                    /* Low Internet Mode Placeholder */
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                        <WifiOff className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block">Low-Internet Mode Enabled</span>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          We have loaded compressed text instructions to save bandwidth. YouTube video stream is disabled.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-950 text-left border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quick Instruction Card</span>
                        <p className="text-xs font-medium text-slate-200 leading-relaxed font-mono">
                          {activeEmergency.offlineCardText}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Normal Video Player (YouTube Iframe) */
                    <div className="space-y-4">
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group">
                        <iframe 
                          src={`https://www.youtube.com/embed/${activeEmergency.youtubeId}?autoplay=1&mute=1`}
                          title="First Aid Emergency Tutorial Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-[11px] text-slate-400 leading-relaxed">
                          Ensure sound is turned up. Watch the loops while coordinating with local authorities.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instant Emergency Tele-Doctor Consult Button */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950 to-slate-950 border border-cyan-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Stethoscope className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-cyan-300 block uppercase">24/7 AI-Linked Emergency Doctor</h4>
                      <p className="text-[10px] text-slate-400">Click to establish emergency link with trauma team.</p>
                    </div>
                  </div>

                  {!isCallingDoctor ? (
                    <button
                      onClick={startDoctorCall}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Initiate Emergency Specialist Call</span>
                    </button>
                  ) : (
                    /* Active Call Overlay Simulation */
                    <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 text-center space-y-3">
                      {doctorConnected ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 animate-pulse">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                            <span>CONNECTED - Dr. Ramesh Kumar (MD, Emergency Med)</span>
                          </div>
                          
                          {/* Mock Doctor Video Stream */}
                          <div className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] bg-red-600 font-bold text-white font-mono uppercase">
                              Doctor Live Feed
                            </div>
                            <span className="text-slate-500 text-xs flex flex-col items-center gap-1.5">
                              <Stethoscope className="w-8 h-8 text-cyan-400 animate-bounce" />
                              <span>AI-Linked Doctor on standby...</span>
                            </span>
                          </div>

                          <button
                            onClick={endDoctorCall}
                            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl transition-all"
                          >
                            Disconnect Call
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-400 animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Locating Emergency On-Call Specialist...</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Transferring diagnostic risk summary & vitals profile...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ========================================================
             CASE B: NORMAL SEARCH / LIBRARY VIEW
             ======================================================== */
          <div className="space-y-12 animate-in fade-in duration-500">

            {/* Smart Emergency Input (Voice & Search) */}
            <div className="max-w-4xl mx-auto p-6 rounded-3xl glass-card border border-slate-800/80 bg-slate-900/20 backdrop-blur-lg relative">
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-md animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-extrabold text-rose-400 uppercase tracking-widest block">AI EMERGENCY DECISION ENGINE</label>
                <h3 className="text-lg font-bold text-white">Describe the emergency situation below:</h3>
                
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Describe symptoms (e.g. 'chest pain and feeling weak' or 'my cousin was bitten by a snake')..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-sm sm:text-base"
                    />
                  </div>
                  
                  {/* Voice Activation Action */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-4 rounded-2xl border transition-all ${
                      isListening 
                        ? 'bg-red-600 border-red-500 text-white animate-pulse'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Voice Activation"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                  >
                    <span>Assess</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Voice Status Messages */}
                {isListening && (
                  <p className="text-xs text-rose-400 font-medium animate-pulse flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span>Listening... Say something like "Patient is not breathing" or "Heart attack emergency"</span>
                  </p>
                )}
                {voiceError && (
                  <p className="text-xs text-amber-400 font-semibold">{voiceError}</p>
                )}

                {/* Preset Fast Actions */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">Or Click to Test Immediate Emergency Situations:</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => triggerEmergency('heart-attack')}
                      className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all"
                    >
                      ❤️ Chest Pain / Heart Attack
                    </button>
                    <button 
                      onClick={() => triggerEmergency('cpr')}
                      className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all animate-pulse"
                    >
                      ⚡ CPR Needed / Unconscious
                    </button>
                    <button 
                      onClick={() => triggerEmergency('choking')}
                      className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all"
                    >
                      💨 Choking Emergency
                    </button>
                    <button 
                      onClick={() => triggerEmergency('snake-bite')}
                      className="px-3.5 py-2 rounded-xl bg-orange-950/40 hover:bg-orange-950/70 border border-orange-500/30 text-orange-400 hover:text-orange-300 text-xs font-bold transition-all"
                    >
                      🐍 Snake Bite First Aid
                    </button>
                    <button 
                      onClick={() => triggerEmergency('bleeding')}
                      className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all"
                    >
                      🩹 Severe Bleeding
                    </button>
                    <button 
                      onClick={() => triggerEmergency('burns')}
                      className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all"
                    >
                      🔥 Scald / Burns
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* FALLBACK SPEECH VOICE SIMULATION DIALOG */}
            {showVoiceFallback && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Mic className="w-5 h-5 text-rose-500" />
                      <span>Voice Command Simulation</span>
                    </h3>
                    <button onClick={() => setShowVoiceFallback(false)} className="p-1 text-slate-500 hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Voice command API is unavailable in this environment. Choose a verbal command from the list below to simulate what the AI detects:
                  </p>
                  
                  <div className="space-y-2.5">
                    <button 
                      onClick={() => { setShowVoiceFallback(false); processVoiceInput("Help, someone is unconscious"); }}
                      className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                    >
                      <span>💬 "Help, someone is unconscious"</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                    <button 
                      onClick={() => { setShowVoiceFallback(false); processVoiceInput("Patient is not breathing"); }}
                      className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                    >
                      <span>💬 "Patient is not breathing"</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                    <button 
                      onClick={() => { setShowVoiceFallback(false); processVoiceInput("Heart attack emergency"); }}
                      className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                    >
                      <span>💬 "Heart attack emergency"</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                    <button 
                      onClick={() => { setShowVoiceFallback(false); processVoiceInput("My son got bitten by a snake"); }}
                      className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                    >
                      <span>💬 "My son got bitten by a snake"</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFIED MEDICAL VIDEO LIBRARY SECTION */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Verified First-Aid Medical Video Library</h3>
                  <p className="text-xs text-slate-400 mt-1">Select a category to browse verified emergency response tutorials.</p>
                </div>
                
                {/* Category Tab Selector */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Cardiac', 'Injury', 'Poison', 'Respiratory'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of video tutorials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibrary.map((item) => (
                  <div 
                    key={item.id} 
                    className="rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700/80 overflow-hidden flex flex-col group"
                  >
                    {/* Video Cover / Placeholder Thumbnail */}
                    <div className="aspect-video bg-slate-900 border-b border-slate-800 relative flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://img.youtube.com/vi/${item.youtubeId}/0.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                        onError={(e) => {
                          e.target.style.display = 'none'; // Fallback if YouTube block/no internet
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-rose-600/90 border border-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-slate-300">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase text-rose-400">{item.severity}</span>
                          <span className="text-[10px] font-bold text-slate-500">Risk: {item.riskScore}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-rose-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.offlineCardText}
                        </p>
                      </div>

                      <button
                        onClick={() => triggerEmergency(item.id)}
                        className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Open First-Aid Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTEGRATED VITALS TRIAGE SIMULATOR (From original component to retain compatibility) */}
            <div className="pt-8 border-t border-slate-900">
              <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-900 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                  <div>
                    <h4 className="text-base font-extrabold text-white">Interactive Triage Vitals Simulator</h4>
                    <p className="text-xs text-slate-400 mt-1">Test how the AI Decision Engine responds to simulated physiological vital metrics.</p>
                  </div>
                  
                  {/* Vitals Preset Selector */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPreset('safe')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedPreset === 'safe' 
                          ? 'bg-emerald-500 text-white shadow-md' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      Safe Preset
                    </button>
                    <button
                      onClick={() => setSelectedPreset('moderate')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedPreset === 'moderate' 
                          ? 'bg-amber-500 text-white shadow-md' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      Moderate Preset
                    </button>
                    <button
                      onClick={() => setSelectedPreset('critical')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedPreset === 'critical' 
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      Critical Preset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Heart Rate */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Heart Rate</span>
                    <span className="text-xl font-bold text-white block mt-1">{currentPreset.heartRate} BPM</span>
                  </div>
                  
                  {/* Blood Oxygen */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Blood Oxygen</span>
                    <span className="text-xl font-bold text-white block mt-1">{currentPreset.oxygen}% SpO2</span>
                  </div>

                  {/* BP */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Blood Pressure</span>
                    <span className="text-xl font-bold text-white block mt-1">{currentPreset.bp} mmHg</span>
                  </div>

                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Body Temperature</span>
                    <span className="text-xl font-bold text-white block mt-1">{currentPreset.temp}°F</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentPreset.color} border text-xs font-bold flex flex-wrap items-center justify-between gap-4`}>
                  <span>Status: {currentPreset.riskLevel} - {currentPreset.recommendation}</span>
                  {selectedPreset === 'critical' && (
                    <button 
                      onClick={() => triggerEmergency('cpr')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase transition-all shadow shadow-red-500/20"
                    >
                      Launch CPR Assistant Guide
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* IMPORTANT MEDICAL DISCLAIMER (Required Requirement) */}
        <div className="mt-16 p-5 rounded-2xl border border-red-500/20 bg-slate-950 text-center max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2 text-rose-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Important Medical Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI guidance and videos are for emergency support and first aid only. They do not replace professional medical diagnosis, advice, or treatment. Contact emergency services or a qualified healthcare professional immediately in serious situations. Always dispatch standard 108/102 rural ambulances during emergency crises.
          </p>
        </div>

      </div>
    </section>
  );
};
