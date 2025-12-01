
import React, { useState, useEffect } from 'react';
import { 
  Activity, BrainCircuit, BookOpen, Building,
  Sparkles, Palette, User, Landmark, BarChart3, Clock,
  AlertTriangle, CheckCircle, XCircle, MinusCircle, Target, ShieldAlert,
  Swords, Shield, TrendingUp, Zap, ListChecks, ArrowLeft, Cpu,
  Users, MessageSquare, Send, Filter, Globe,
  Check, X, Mail, Languages
} from 'lucide-react';
import MetricsChart, { SwotRadar } from './components/MetricsChart';
import { TimelinePoint, SimulationMode, BusinessProfile, GovernmentProfile, PersonalProfile, AnalysisResult, UserFeedback, Language } from './types';
import { getGeminiResponse } from './services/geminiService';

// --- TRANSLATIONS DICTIONARY ---
const translations = {
  AR: {
    appTitle: "نظام تحليل مستقبلك",
    appSubtitle: "أول نظام عربي مدعوم بالذكاء الإصطناعي",
    devCredit: "تطوير النسخة الأولى بواسطة المهندس",
    devName: "ابوهريره طه",
    visitorLabel: "إجمالي الزوار",
    modes: {
      PERSONAL: "الأفراد",
      STUDENT: "الطلاب",
      BUSINESS: "الشركات",
      GOVERNMENT: "الحكومات والهيئات"
    },
    free: "مجاني",
    inputs: {
      header: {
        PERSONAL: "بيانات وقرار الفرد",
        STUDENT: "السجل الأكاديمي",
        BUSINESS: "إعدادات الجهة",
        GOVERNMENT: "البيانات الحكومية"
      },
      decision: {
        label: "القرار المصيري / الخطة",
        placeholder: "أكتب هنا قرارك بوضوح..\nمثال: أنا موظف راتبي 5000، أفكر في الاستقالة وفتح متجر إلكتروني..."
      },
      bizDecision: {
        label: "القرار الاستراتيجي / الفكرة / التحدي",
        placeholder: "أكتب هنا الفكرة أو القرار بوضوح..\nمثال: نريد التوسع لفتح فرع جديد، أو إطلاق منتج..."
      },
      name: "الاسم",
      age: "العمر",
      job: "الوظيفة الحالية",
      income: "الدخل الشهري",
      savings: "رأس المال / المدخرات",
      social: "الحالة الاجتماعية",
      socialOpts: { SINGLE: "أعزب", MARRIED: "متزوج", FAMILY: "أعول أسرة" },
      student: {
        level: "المرحلة الدراسية",
        levels: { PRIMARY: "الابتدائي", MIDDLE: "المتوسط", SECONDARY: "الثانوي" },
        stream: "المسار الأكاديمي",
        streams: { SCIENTIFIC: "علمي", LITERARY: "أدبي" },
        grades: "درجات المواد",
        elective: "المادة السابعة (الاختيارية)",
        hobbies: "الهوايات والاهتمامات"
      },
      biz: {
        name: "بيانات الجهة",
        sector: "القطاع",
        capital: "رأس المال",
        market: "نطاق السوق"
      },
      gov: {
        name: "اسم الهيئة / الوزارة",
        sector: "القطاع الحكومي",
        pop: "تعداد السكان المستهدف",
        chal: "أبرز التحديات الحالية...",
        goals: "الأهداف الاستراتيجية..."
      }
    },
    analyzeBtn: "تحليل القرار والمستقبل",
    analyzing: "جاري التحليل...",
    results: {
      header: "محاكاة المستقبل (5 سنوات)",
      risk: "تأثير المخاطرة",
      riskLabels: { DANGER: "سلبي (تدهور)", POSITIVE: "إيجابي (نمو)", WARNING: "حذر", NEUTRAL: "مستقر" },
      riskCircle: { DANGER: "خطر / احذر", WARNING: "حذر / انتبه", POSITIVE: "إيجابي / آمن", NEUTRAL: "محايد / مستقر" },
      projected: "مؤشرات النجاح (بعد 5 سنوات)",
      balance: "التوازن الاستراتيجي",
      swot: {
        S: "نقاط القوة (Strengths)",
        W: "نقاط الضعف (Weaknesses)",
        O: "الفرص (Opportunities)",
        T: "التهديدات (Threats)"
      },
      prediction: "التنبؤ المستقبلي",
      strategy: "التوجيه الاستراتيجي",
      actionPlan: "خطة العمل التنفيذية"
    },
    contact: {
      title: "اتصل بالإدارة مباشرة",
      desc: "نسعد باستقبال اقتراحاتكم واستفساراتكم.",
      send: "إرسال",
      name: "الاسم",
      email: "البريد الإلكتروني",
      msg: "أكتب تفاصيل رسالتك هنا...",
      types: { GENERAL: "استفسار عام", INQUIRY: "طلب خدمة", SUGGESTION: "اقتراح تطوير", ISSUE: "الإبلاغ عن مشكلة" }
    },
    footer: "جميع الحقوق محفوظة للعام 2025"
  },
  EN: {
    appTitle: "Future Analysis System",
    appSubtitle: "First AI-Powered System",
    devCredit: "Developed by Eng.",
    devName: "ABU HURAIRA TAHA",
    visitorLabel: "Total Visitors",
    modes: {
      PERSONAL: "Personal",
      STUDENT: "Student",
      BUSINESS: "Business",
      GOVERNMENT: "Government"
    },
    free: "Free",
    inputs: {
      header: {
        PERSONAL: "Personal Profile & Decision",
        STUDENT: "Academic Record",
        BUSINESS: "Business Settings",
        GOVERNMENT: "Government Data"
      },
      decision: {
        label: "Critical Decision / Plan",
        placeholder: "Clearly state your decision here..\nEx: I earn 5000, thinking of quitting to start an e-store..."
      },
      bizDecision: {
        label: "Strategic Decision / Idea / Challenge",
        placeholder: "State the idea or decision..\nEx: We want to expand to a new branch, or launch a product..."
      },
      name: "Name",
      age: "Age",
      job: "Current Job",
      income: "Monthly Income",
      savings: "Capital / Savings",
      social: "Marital Status",
      socialOpts: { SINGLE: "Single", MARRIED: "Married", FAMILY: "Family Support" },
      student: {
        level: "Education Level",
        levels: { PRIMARY: "Primary", MIDDLE: "Middle", SECONDARY: "Secondary" },
        stream: "Academic Stream",
        streams: { SCIENTIFIC: "Scientific", LITERARY: "Literary" },
        grades: "Subject Grades",
        elective: "7th Elective Subject",
        hobbies: "Hobbies & Interests"
      },
      biz: {
        name: "Entity Name",
        sector: "Sector",
        capital: "Capital",
        market: "Market Scope"
      },
      gov: {
        name: "Entity / Ministry Name",
        sector: "Gov Sector",
        pop: "Target Population",
        chal: "Current Challenges...",
        goals: "Strategic Goals..."
      }
    },
    analyzeBtn: "Analyze Future & Decision",
    analyzing: "Analyzing...",
    results: {
      header: "Future Simulation (5 Years)",
      risk: "Risk Impact",
      riskLabels: { DANGER: "Negative (Decline)", POSITIVE: "Positive (Growth)", WARNING: "Caution", NEUTRAL: "Stable" },
      riskCircle: { DANGER: "DANGER", WARNING: "WARNING", POSITIVE: "POSITIVE / SAFE", NEUTRAL: "NEUTRAL" },
      projected: "Success Metrics (Year 5)",
      balance: "Strategic Balance",
      swot: {
        S: "Strengths",
        W: "Weaknesses",
        O: "Opportunities",
        T: "Threats"
      },
      prediction: "Future Prediction",
      strategy: "Strategic Guidance",
      actionPlan: "Action Plan"
    },
    contact: {
      title: "Contact Admin",
      desc: "We welcome your suggestions and inquiries.",
      send: "Send",
      name: "Name",
      email: "Email",
      msg: "Write your message details here...",
      types: { GENERAL: "General Inquiry", INQUIRY: "Service Request", SUGGESTION: "Suggestion", ISSUE: "Report Issue" }
    },
    footer: "All Rights Reserved 2025"
  },
  SD: {
    appTitle: "نظام تحليل المستقبل",
    appSubtitle: "أول نظام بذكاء اصطناعي سوداني",
    devCredit: "النظام دا طورو ولدكم المهندس",
    devName: "ابوهريره طه",
    visitorLabel: "الزوار",
    modes: {
      PERSONAL: "حقك براك",
      STUDENT: "القراية",
      BUSINESS: "البزنس",
      GOVERNMENT: "الحكومة"
    },
    free: "مجاني",
    inputs: {
      header: {
        PERSONAL: "بياناتك وقرارك",
        STUDENT: "سجل القراية",
        BUSINESS: "إعدادات الشركة",
        GOVERNMENT: "ناس الحكومة"
      },
      decision: {
        label: "الموضوع / القرار الداير تاخده",
        placeholder: "أكتب هنا قرارك..\nمثال: أنا شغال وراتبي شوية، داير أفتح لي دكان..."
      },
      bizDecision: {
        label: "الفكرة / الموضوع الاستراتيجي",
        placeholder: "أكتب فكرتك..\nمثال: دايرين نفتح فرع جديد، ولا ننزل منتج جديد..."
      },
      name: "الاسم",
      age: "العمر",
      job: "شغال شنو",
      income: "الراتب / الدخل",
      savings: "التحويشة / رأس المال",
      social: "الوضع الاجتماعي",
      socialOpts: { SINGLE: "عزابي", MARRIED: "متزوج", FAMILY: "عندي أسرة" },
      student: {
        level: "المرحلة",
        levels: { PRIMARY: "ابتدائي", MIDDLE: "متوسطة", SECONDARY: "ثانوي" },
        stream: "المسار",
        streams: { SCIENTIFIC: "علمي", LITERARY: "أدبي" },
        grades: "الدرجات",
        elective: "المادة الاختيارية",
        hobbies: "بتحب شنو؟"
      },
      biz: {
        name: "اسم المحل / الشركة",
        sector: "المجال",
        capital: "رأس المال",
        market: "السوق وين"
      },
      gov: {
        name: "الوزارة / الهيئة",
        sector: "القطاع",
        pop: "عدد الناس",
        chal: "المشاكل الحالية...",
        goals: "الأهداف لقدام..."
      }
    },
    analyzeBtn: "نشوف الحاصل شنو",
    analyzing: "جاري الفرز...",
    results: {
      header: "توقعات المستقبل (5 سنين)",
      risk: "تأثير الخطورة",
      riskLabels: { DANGER: "كعب شديد (نزول)", POSITIVE: "تمام التمام (زيادة)", WARNING: "فتح عينك", NEUTRAL: "في محلو" },
      riskCircle: { DANGER: "خطر / أبعد", WARNING: "أنتبه / ركز", POSITIVE: "أمورك باسطة", NEUTRAL: "ماشي حالك" },
      projected: "النتيجة بعد 5 سنين",
      balance: "الميزان الاستراتيجي",
      swot: {
        S: "نقاط القوة (السمح)",
        W: "نقاط الضعف (الكعب)",
        O: "الفرص (اللقطات)",
        T: "التهديدات (الكوجات)"
      },
      prediction: "الح يحصل شنو",
      strategy: "النصيحة",
      actionPlan: "تعمل شنو بالضبط"
    },
    contact: {
      title: "راسل الإدارة طوالي",
      desc: "رسل لينا أي حاجة في بالك.",
      send: "إرسال",
      name: "الاسم",
      email: "الإيميل",
      msg: "أكتب كلامك هنا...",
      types: { GENERAL: "سؤال عام", INQUIRY: "خدمة", SUGGESTION: "اقتراح", ISSUE: "مشكلة" }
    },
    footer: "الحقوق محفوظة 2025"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('SD');
  const t = translations[lang];

  const [mode, setMode] = useState<SimulationMode>('PERSONAL');
  const [data, setData] = useState<TimelinePoint[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Analysis States
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Visitor Counter State (Persistent Cumulative)
  const [visitorCount, setVisitorCount] = useState(() => {
    // Check localStorage for existing count, otherwise start from base
    const savedCount = localStorage.getItem('bioos_total_visitors');
    return savedCount ? parseInt(savedCount, 10) : 14520;
  });

  // Feedback State
  const [newFeedback, setNewFeedback] = useState({ name: '', email: '', type: 'GENERAL', message: '' });
  const [feedbackStatus, setFeedbackStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'ERROR'>('IDLE');

  // --- FORM STATES ---
  // Personal
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>({
    fullName: '', age: '', jobTitle: '', monthlyIncome: '', savings: '',
    healthStatus: 'GOOD', socialStatus: 'SINGLE', lifestyle: 'ACTIVE',
    decision: ''
  });

  // Student
  const [studentLevel, setStudentLevel] = useState<'PRIMARY' | 'MIDDLE' | 'SECONDARY'>('SECONDARY');
  const [studentStream, setStudentStream] = useState<'SCIENTIFIC' | 'LITERARY'>('SCIENTIFIC');
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [electiveSubject, setElectiveSubject] = useState<string>('');
  const [hobbies, setHobbies] = useState('');

  // Business
  const [bizProfile, setBizProfile] = useState<BusinessProfile>({
    companyName: '', industry: 'تكنولوجيا', capital: '', targetMarket: '', decision: ''
  });

  // Government
  const [govProfile, setGovProfile] = useState<GovernmentProfile>({
    entityName: '', sector: '', population: '', challenges: '', goals: '', planningPeriod: 'MEDIUM'
  });

  // Initialize data on mode change
  useEffect(() => {
    resetData();
  }, [mode]);

  // Handle Visitor Counting Logic
  useEffect(() => {
    setVisitorCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('bioos_total_visitors', newCount.toString());
        return newCount;
    });

    const interval = setInterval(() => {
        setVisitorCount(prev => {
            const increment = Math.random() > 0.5 ? 1 : 0; 
            if (increment > 0) {
                const newCount = prev + increment;
                localStorage.setItem('bioos_total_visitors', newCount.toString());
                return newCount;
            }
            return prev;
        });
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setElectiveSubject('');
    setSubjects({});
  }, [studentStream, studentLevel]);

  const resetData = () => {
    setData([]);
    setAnalysisResult(null);
  };

  const handleFeedbackSubmit = () => {
    if (!newFeedback.message.trim()) return;
    setFeedbackStatus('SENDING');
    
    // Simulate mailto
    setTimeout(() => {
        window.location.href = `mailto:tahaabutaha9988@gmail.com?subject=BioOS Feedback (${lang})&body=${encodeURIComponent(newFeedback.message + "\n\nFrom: " + newFeedback.name + " (" + newFeedback.email + ")")}`;
        setFeedbackStatus('IDLE');
        setNewFeedback({ name: '', email: '', type: 'GENERAL', message: '' });
    }, 1000);
  };

  // --- CORE PROJECTION LOGIC ---
  const generateProjectionData = (currentMode: SimulationMode, riskLevel: string | null = null): TimelinePoint[] => {
    const points: TimelinePoint[] = [];
    const years = 5;
    const startYear = new Date().getFullYear();

    let growthFactor = 1.0;
    let decayFactor = 0;

    if (riskLevel === 'DANGER') {
        growthFactor = 0.8; 
        decayFactor = 5;    
    } else if (riskLevel === 'WARNING') {
        growthFactor = 0.95;
        decayFactor = 2;
    } else if (riskLevel === 'POSITIVE') {
        growthFactor = 1.1;
        decayFactor = -2;
    }

    const clamp = (val: number) => Math.max(0, Math.min(100, val));

    for (let i = 0; i <= years; i++) {
      const yearLabel = `${startYear + i}`;
      let point: TimelinePoint = { period: yearLabel };

      if (currentMode === 'PERSONAL') {
        const incomeScore = Math.min(100, (parseInt(personalProfile.monthlyIncome) || 0) / 5000 * 50); 
        const savingsScore = Math.min(100, (parseInt(personalProfile.savings) || 0) / 10000 * 30);
        
        let healthBase = personalProfile.healthStatus === 'EXCELLENT' ? 95 : personalProfile.healthStatus === 'GOOD' ? 80 : 60;
        if (personalProfile.lifestyle === 'STRESSED') healthBase -= 10;

        let wealthBase = (incomeScore + savingsScore) / 2;
        
        const yearEffect = i * (riskLevel ? decayFactor : 0);
        const wealthEffect = i * (riskLevel === 'DANGER' ? -10 : riskLevel === 'POSITIVE' ? 10 : 5);

        point.health = clamp((healthBase - (i * 2)) - yearEffect);
        point.wealth = clamp((wealthBase + wealthEffect) * (riskLevel === 'DANGER' ? 0.9 : 1));
        point.relationships = clamp(70 - yearEffect);
        point.happiness = clamp(((point.health || 0) + (point.wealth || 0) + (point.relationships || 0)) / 3);
      } 
      else if (currentMode === 'BUSINESS') {
        const baseGrowth = 50; 
        const riskEffect = riskLevel === 'DANGER' ? -10 : riskLevel === 'POSITIVE' ? 10 : 0;
        point.revenue = clamp(baseGrowth + (i * 10) + (i * riskEffect));
        point.marketShare = clamp(10 + (i * 5));
        point.innovation = clamp(80 - (i * 2)); 
      }
      else if (currentMode === 'GOVERNMENT') {
        point.economicGrowth = clamp(30 + (i * 4));
        point.publicSatisfaction = clamp(50 + (Math.sin(i) * 10));
        point.socialStability = clamp(60 + (i * 2));
      }
      else if (currentMode === 'STUDENT') {
        point.academicFit = clamp(70 + (i * 2));
        point.marketDemand = clamp(60 + (i * 5));
        point.skillDevelopment = clamp(20 + (i * 15));
        point.financialProspects = clamp((point.marketDemand || 0) * 0.8 + (point.skillDevelopment || 0) * 0.2);
      }

      points.push(point);
    }
    return points;
  };

  // --- AI ANALYSIS HANDLERS ---
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setData(generateProjectionData(mode, null));

    let promptData = '';
    
    if (mode === 'PERSONAL') {
       promptData = JSON.stringify(personalProfile);
    } else if (mode === 'STUDENT') {
      promptData = JSON.stringify({ 
        level: studentLevel, 
        stream: studentStream, 
        subjects: { ...subjects, [electiveSubject]: subjects[electiveSubject] || '0' },
        hobbies 
      });
    } else if (mode === 'BUSINESS') {
      promptData = JSON.stringify(bizProfile);
    } else if (mode === 'GOVERNMENT') {
      promptData = JSON.stringify(govProfile);
    }

    if (promptData) {
      // Pass the selected language to the service
      const result = await getGeminiResponse(promptData, mode, lang);
      setAnalysisResult(result);
      
      if (result) {
          const adjustedData = generateProjectionData(mode, result.riskLevel);
          setData(adjustedData);
      }
    }
    
    setIsAnalyzing(false);
  };

  // --- RENDER HELPERS ---
  const renderMetricScore = (label: string, value: number, colorClass: string, icon: React.ReactNode) => (
    <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                {icon} {label}
            </span>
            <span className="text-[10px] font-bold text-slate-800">{Math.round(value)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
  );

  const renderProjectedScores = () => {
     if (data.length === 0) return null;
     const final = data[data.length - 1]; 

     return (
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-center">
            <h4 className="text-slate-700 font-bold text-xs mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
               <Target size={14} className="text-bio-primary" /> {t.results.projected}
            </h4>
            
            {mode === 'PERSONAL' && (
                <>
                  {renderMetricScore('Health', final.health || 0, 'bg-rose-500', <Activity size={10} className="text-rose-500" />)}
                  {renderMetricScore('Wealth', final.wealth || 0, 'bg-yellow-500', <Landmark size={10} className="text-yellow-500" />)}
                  {renderMetricScore('Relations', final.relationships || 0, 'bg-sky-500', <Users size={10} className="text-sky-500" />)}
                  {renderMetricScore('Happiness', final.happiness || 0, 'bg-purple-500', <Sparkles size={10} className="text-purple-500" />)}
                </>
            )}

            {mode === 'BUSINESS' && (
                <>
                  {renderMetricScore('Revenue', final.revenue || 0, 'bg-cyan-600', <BarChart3 size={10} className="text-cyan-600" />)}
                  {renderMetricScore('Market', final.marketShare || 0, 'bg-indigo-600', <Globe size={10} className="text-indigo-600" />)}
                  {renderMetricScore('Innovation', final.innovation || 0, 'bg-fuchsia-600', <Zap size={10} className="text-fuchsia-600" />)}
                </>
            )}

            {mode === 'STUDENT' && (
                <>
                  {renderMetricScore('Grades', final.academicFit || 0, 'bg-rose-600', <BookOpen size={10} className="text-rose-600" />)}
                  {renderMetricScore('Market', final.marketDemand || 0, 'bg-emerald-600', <TrendingUp size={10} className="text-emerald-600" />)}
                  {renderMetricScore('Skills', final.skillDevelopment || 0, 'bg-blue-600', <BrainCircuit size={10} className="text-blue-600" />)}
                </>
            )}

            {mode === 'GOVERNMENT' && (
                <>
                  {renderMetricScore('Satisfaction', final.publicSatisfaction || 0, 'bg-emerald-600', <Users size={10} className="text-emerald-600" />)}
                  {renderMetricScore('Economy', final.economicGrowth || 0, 'bg-blue-600', <BarChart3 size={10} className="text-blue-600" />)}
                  {renderMetricScore('Stability', final.socialStability || 0, 'bg-amber-600', <Shield size={10} className="text-amber-600" />)}
                </>
            )}
        </div>
     );
  };

  const renderPersonalInputs = () => (
    <div className="space-y-4 animate-in fade-in">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={100} className="text-red-600" />
            </div>
            <label className="text-red-700 text-sm font-bold mb-2 block flex items-center gap-2 relative z-10">
                <Target size={18} />
                {t.inputs.decision.label}
            </label>
            <textarea 
                className="w-full p-4 border border-red-200 rounded-lg text-sm bg-white text-slate-800 focus:border-red-400 outline-none h-28 placeholder-gray-400 relative z-10 resize-none neon-input transition-all" 
                placeholder={t.inputs.decision.placeholder}
                onChange={e => setPersonalProfile({...personalProfile, decision: e.target.value})} 
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
              <label className="text-slate-700 text-xs font-bold mb-1 block">{t.inputs.name}</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder={t.inputs.name} onChange={e => setPersonalProfile({...personalProfile, fullName: e.target.value})} />
           </div>
           <div>
              <label className="text-slate-700 text-xs font-bold mb-1 block">{t.inputs.age}</label>
              <input type="number" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="30" onChange={e => setPersonalProfile({...personalProfile, age: e.target.value})} />
           </div>
        </div>

        <div>
           <label className="text-slate-500 text-xs mb-1 block">{t.inputs.job}</label>
           <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="" onChange={e => setPersonalProfile({...personalProfile, jobTitle: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
              <label className="text-slate-500 text-xs mb-1 block">{t.inputs.income}</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="5000" onChange={e => setPersonalProfile({...personalProfile, monthlyIncome: e.target.value})} />
           </div>
           <div>
              <label className="text-slate-500 text-xs mb-1 block">{t.inputs.savings}</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="10000" onChange={e => setPersonalProfile({...personalProfile, savings: e.target.value})} />
           </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
            <div>
               <label className="text-slate-500 text-xs mb-1 block">{t.inputs.social}</label>
               <select className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" onChange={e => setPersonalProfile({...personalProfile, socialStatus: e.target.value as any})}>
                  <option value="SINGLE">{t.inputs.socialOpts.SINGLE}</option>
                  <option value="MARRIED">{t.inputs.socialOpts.MARRIED}</option>
                  <option value="FAMILY">{t.inputs.socialOpts.FAMILY}</option>
               </select>
            </div>
        </div>
    </div>
  );

  const renderStudentInputs = () => {
    const primarySubjects = [
      'اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الإسلامية',
      'التربية التقنية', 'التربية الفنية', 'التربية الوطنية'
    ];

    const middleSubjects = [
      'اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الإسلامية',
      'التربية التقنية', 'التربية الفنية', 'التربية الوطنية',
      'الجغرافيا', 'التاريخ', 'العلوم', 'تكنولوجيا المعلومات والاتصالات'
    ];

    const scientificCore = [
      'اللغة العربية', 'التربية الإسلامية', 'اللغة الإنجليزية',
      'الرياضيات المتخصصة', 'الفيزياء', 'الكيمياء'
    ];
    const scientificElectives = ['الأحياء', 'العلوم الهندسية', 'الحاسوب'];

    const literaryCore = [
      'اللغة العربية', 'التربية الإسلامية', 'اللغة الإنجليزية',
      'الرياضيات الأساسية', 'الجغرافيا', 'التاريخ'
    ];
    const literaryElectives = ['الدراسات الإسلامية', 'العلوم العسكرية', 'الأدب الإنجليزي', 'اللغة العربية المتقدمة'];


    const activeCoreSubjects = studentLevel === 'PRIMARY' ? primarySubjects :
                               studentLevel === 'MIDDLE' ? middleSubjects :
                               studentStream === 'SCIENTIFIC' ? scientificCore : literaryCore;

    const activeElectives = studentLevel === 'SECONDARY' 
                            ? (studentStream === 'SCIENTIFIC' ? scientificElectives : literaryElectives) 
                            : [];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <label className="text-bio-primary text-xs font-bold mb-2 block">{t.inputs.student.level}</label>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-gray-200 mb-4">
                <button onClick={() => setStudentLevel('PRIMARY')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'PRIMARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>{t.inputs.student.levels.PRIMARY}</button>
                <button onClick={() => setStudentLevel('MIDDLE')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'MIDDLE' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>{t.inputs.student.levels.MIDDLE}</button>
                <button onClick={() => setStudentLevel('SECONDARY')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'SECONDARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>{t.inputs.student.levels.SECONDARY}</button>
            </div>

            {studentLevel === 'SECONDARY' && (
              <>
              <label className="text-bio-primary text-xs font-bold mb-2 block">{t.inputs.student.stream}</label>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-gray-200">
                  <button onClick={() => setStudentStream('SCIENTIFIC')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${studentStream === 'SCIENTIFIC' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:bg-gray-50'}`}>{t.inputs.student.streams.SCIENTIFIC}</button>
                  <button onClick={() => setStudentStream('LITERARY')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${studentStream === 'LITERARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:bg-gray-50'}`}>{t.inputs.student.streams.LITERARY}</button>
              </div>
              </>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><BookOpen size={16} className="text-bio-primary" /> {t.inputs.student.grades}</h4>
                <div className="grid grid-cols-2 gap-3">
                   {activeCoreSubjects.map(sub => (
                       <div key={sub} className="relative">
                           <input type="number" placeholder="0" className="w-full p-2 pl-8 border border-gray-200 rounded text-sm bg-gray-50 text-slate-800 focus:border-bio-primary focus:outline-none placeholder-gray-400 neon-input" onChange={(e) => setSubjects(prev => ({...prev, [sub]: e.target.value}))} />
                           <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">{sub}</span>
                       </div>
                   ))}
                </div>

                {studentLevel === 'SECONDARY' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                     <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> {t.inputs.student.elective}</h4>
                     <div className="grid grid-cols-2 gap-3">
                        <select 
                          className="w-full p-2 border border-gray-200 rounded text-sm bg-white text-slate-800 focus:border-bio-primary outline-none"
                          value={electiveSubject}
                          onChange={(e) => setElectiveSubject(e.target.value)}
                        >
                          <option value="">...</option>
                          {activeElectives.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                        {electiveSubject && (
                          <div className="relative animate-in fade-in">
                             <input type="number" placeholder="0" className="w-full p-2 pl-8 border border-gray-200 rounded text-sm bg-gray-50 text-slate-800 focus:border-bio-primary focus:outline-none placeholder-gray-400 neon-input" onChange={(e) => setSubjects(prev => ({...prev, [electiveSubject]: e.target.value}))} />
                          </div>
                        )}
                     </div>
                  </div>
                )}
            </div>

            {(studentLevel === 'PRIMARY' || studentLevel === 'MIDDLE') && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Palette size={16} className="text-bio-primary" /> {t.inputs.student.hobbies}</h4>
                 <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-slate-800 focus:border-bio-primary outline-none placeholder-gray-400 neon-input" rows={3} placeholder="" onChange={e => setHobbies(e.target.value)} />
              </div>
            )}
        </div>
    );
  };

  const renderBusinessInputs = () => (
    <div className="space-y-4 animate-in fade-in">
       <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={100} className="text-blue-600" />
            </div>
            <label className="text-blue-700 text-sm font-bold mb-2 block flex items-center gap-2 relative z-10">
                <Target size={18} />
                {t.inputs.bizDecision.label}
            </label>
            <textarea 
                className="w-full p-4 border border-blue-200 rounded-lg text-sm bg-white text-slate-800 focus:border-blue-400 outline-none h-28 placeholder-gray-400 relative z-10 resize-none neon-input transition-all" 
                placeholder={t.inputs.bizDecision.placeholder} 
                onChange={e => setBizProfile({...bizProfile, decision: e.target.value})} 
            />
        </div>

       <div>
         <label className="text-slate-700 text-xs font-bold mb-1 block">{t.inputs.biz.name}</label>
         <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="" onChange={e => setBizProfile({...bizProfile, companyName: e.target.value})} />
       </div>
       <div>
         <label className="text-slate-500 text-xs mb-1 block">{t.inputs.biz.sector}</label>
         <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="" onChange={e => setBizProfile({...bizProfile, industry: e.target.value})} />
       </div>
       <div className="grid grid-cols-2 gap-3">
         <div>
           <label className="text-slate-500 text-xs mb-1 block">{t.inputs.biz.capital}</label>
           <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="" onChange={e => setBizProfile({...bizProfile, capital: e.target.value})} />
         </div>
         <div>
            <label className="text-slate-500 text-xs mb-1 block">{t.inputs.biz.market}</label>
            <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="" onChange={e => setBizProfile({...bizProfile, targetMarket: e.target.value})} />
         </div>
       </div>
    </div>
  );

  const renderGovernmentInputs = () => (
    <div className="space-y-3 animate-in fade-in">
       <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder={t.inputs.gov.name} onChange={e => setGovProfile({...govProfile, entityName: e.target.value})} />
       <div className="grid grid-cols-2 gap-3">
          <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder={t.inputs.gov.sector} onChange={e => setGovProfile({...govProfile, sector: e.target.value})} />
          <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder={t.inputs.gov.pop} onChange={e => setGovProfile({...govProfile, population: e.target.value})} />
       </div>
       <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" rows={2} placeholder={t.inputs.gov.chal} onChange={e => setGovProfile({...govProfile, challenges: e.target.value})} />
       <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" rows={2} placeholder={t.inputs.gov.goals} onChange={e => setGovProfile({...govProfile, goals: e.target.value})} />
    </div>
  );

  // --- ANALYSIS RESULT RENDER ---
  const renderRiskCircle = (level: string) => {
     let color = 'bg-gray-200';
     let textColor = 'text-gray-600';
     let iconColor = 'text-gray-500';
     let text = t.results.riskCircle.NEUTRAL;
     let Icon = MinusCircle;
     let ring = 'ring-gray-300';
     let shadow = 'shadow-gray-200';

     if (level === 'DANGER') {
        color = 'bg-red-50'; textColor = 'text-red-600'; iconColor = 'text-red-500'; text = t.results.riskCircle.DANGER; Icon = XCircle; ring = 'ring-red-100'; shadow = 'shadow-red-200';
     } else if (level === 'WARNING') {
        color = 'bg-orange-50'; textColor = 'text-orange-600'; iconColor = 'text-orange-500'; text = t.results.riskCircle.WARNING; Icon = AlertTriangle; ring = 'ring-orange-100'; shadow = 'shadow-orange-200';
     } else if (level === 'POSITIVE') {
        color = 'bg-emerald-50'; textColor = 'text-emerald-600'; iconColor = 'text-emerald-500'; text = t.results.riskCircle.POSITIVE; Icon = CheckCircle; ring = 'ring-emerald-100'; shadow = 'shadow-emerald-200';
     } else if (level === 'NEUTRAL') {
        color = 'bg-blue-50'; textColor = 'text-blue-600'; iconColor = 'text-blue-500'; text = t.results.riskCircle.NEUTRAL; Icon = MinusCircle; ring = 'ring-blue-100'; shadow = 'shadow-blue-200';
     }

     return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 h-full relative overflow-hidden shadow-sm">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${color} opacity-50 blur-[40px] rounded-full`}></div>
            <div className={`w-32 h-32 rounded-full bg-white shadow-lg ${shadow} flex items-center justify-center mb-6 ring-8 ${ring} relative z-10 transition-all duration-500 transform hover:scale-105`}>
               <Icon size={48} className={`${iconColor} drop-shadow-sm`} />
            </div>
            <h4 className={`text-2xl font-black ${textColor} mb-1 relative z-10 tracking-tight neon-text text-center`}>{text}</h4>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase relative z-10">Risk Analysis Core</span>
        </div>
     );
  };

  const renderFeedbackSection = () => (
    <div className="w-full max-w-4xl mt-12 mb-8 bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl neon-border relative overflow-hidden">
       {feedbackStatus === 'SENT' && (
         <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in">
            <CheckCircle size={64} className="text-green-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Done</h3>
         </div>
       )}

       <div className="flex flex-col justify-center items-center mb-8 border-b border-gray-100 pb-4 text-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2 mb-2">
                   <MessageSquare className="text-bio-primary" size={24} />
               {t.contact.title}
            </h3>
            <p className="text-sm text-slate-500 max-w-md">
                {t.contact.desc}
            </p>
       </div>

       <div className="max-w-2xl mx-auto space-y-4">
             <div className="grid grid-cols-2 gap-4">
                 <input 
                   className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-bio-primary outline-none shadow-sm"
                   placeholder={t.contact.name}
                   value={newFeedback.name}
                   onChange={e => setNewFeedback({...newFeedback, name: e.target.value})}
                 />
                 <input 
                   className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-bio-primary outline-none shadow-sm"
                   placeholder={t.contact.email}
                   value={newFeedback.email}
                   onChange={e => setNewFeedback({...newFeedback, email: e.target.value})}
                 />
             </div>
             
             <select 
               className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-bio-primary outline-none shadow-sm"
               value={newFeedback.type}
               onChange={e => setNewFeedback({...newFeedback, type: e.target.value})}
             >
                <option value="GENERAL">{t.contact.types.GENERAL}</option>
                <option value="INQUIRY">{t.contact.types.INQUIRY}</option>
                <option value="SUGGESTION">{t.contact.types.SUGGESTION}</option>
                <option value="ISSUE">{t.contact.types.ISSUE}</option>
             </select>

             <textarea 
               className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-bio-primary outline-none h-32 resize-none shadow-sm"
               placeholder={t.contact.msg}
               value={newFeedback.message}
               onChange={e => setNewFeedback({...newFeedback, message: e.target.value})}
             />

             <button 
               onClick={handleFeedbackSubmit}
               disabled={feedbackStatus === 'SENDING' || !newFeedback.message}
               className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {feedbackStatus === 'SENDING' ? (
                    <span className="animate-pulse">...</span>
                ) : (
                    <>
                    <Mail size={16} /> {t.contact.send}
                    </>
                )}
             </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans p-6 overflow-hidden flex flex-col items-center relative z-10" dir={lang === 'EN' ? 'ltr' : 'rtl'}>
      
      {/* LANGUAGE SWITCHER */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
         {([['SD', 'اللهجة السودانية'], ['AR', 'العربية'], ['EN', 'English']] as const).map(([code, label]) => (
            <button
               key={code}
               onClick={() => setLang(code as Language)}
               className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${lang === code ? 'bg-bio-primary text-white scale-105 ring-2 ring-sky-200' : 'bg-white text-slate-600 hover:bg-sky-50'}`}
            >
               {label}
            </button>
         ))}
      </div>

      {/* HEADER SECTION */}
      <div className="w-full max-w-4xl mx-auto mb-10 z-10 pt-8 relative flex flex-col items-center justify-center px-4">
         <div className="text-center flex flex-col items-center">
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight leading-tight drop-shadow-sm" style={{fontFamily: lang === 'EN' ? 'sans-serif' : 'IBM Plex Sans Arabic'}}>
               {t.appTitle}
             </h1>
             <h2 className="text-2xl md:text-4xl font-black title-3d-blue leading-relaxed mb-2">
                {t.appSubtitle}
             </h2>
             <h3 className="text-lg md:text-xl font-bold text-slate-500 flex items-center gap-2 mt-2">
                {t.devCredit}
                <span className="text-bio-primary border-b-2 border-bio-primary px-1">{t.devName}</span>
             </h3>
             
             <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50 mt-6 hover:shadow-md transition-all cursor-default">
                 <div className="relative">
                     <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                     <Users size={18} className="text-bio-primary" />
                 </div>
                 <div className={`flex items-center gap-2 leading-none ${lang === 'EN' ? 'border-l pl-2' : 'border-r pr-2'} border-gray-300`}>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.visitorLabel}</span>
                     <span className="text-sm font-black text-slate-800 font-mono">{visitorCount.toLocaleString()}</span>
                 </div>
             </div>
         </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-gray-200 mb-8 backdrop-blur-md shadow-lg w-full md:w-auto">
         {[
           {id: 'PERSONAL', icon: User, label: t.modes.PERSONAL},
           {id: 'STUDENT', icon: BookOpen, label: t.modes.STUDENT, badge: t.free},
           {id: 'BUSINESS', icon: Building, label: t.modes.BUSINESS},
           {id: 'GOVERNMENT', icon: Landmark, label: t.modes.GOVERNMENT},
         ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setMode(item.id as SimulationMode)}
              className={`flex items-center gap-1.5 px-3 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-300 whitespace-nowrap text-xs md:text-sm ${mode === item.id ? 'bg-bio-primary text-white font-bold shadow-md shadow-sky-200' : 'text-slate-500 hover:text-bio-primary hover:bg-slate-50'}`}
            >
                <item.icon size={14} className="md:w-5 md:h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${mode === item.id ? 'bg-emerald-400 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                    {item.badge}
                  </span>
                )}
            </button>
         ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* INPUT PANEL */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl relative overflow-hidden neon-border">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bio-primary to-transparent"></div>
             
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Cpu className="text-bio-primary animate-pulse" size={20} />
                   {t.inputs.header[mode]}
                </h3>
             </div>

             {mode === 'STUDENT' && renderStudentInputs()}
             {mode === 'BUSINESS' && renderBusinessInputs()}
             {mode === 'GOVERNMENT' && renderGovernmentInputs()}
             {mode === 'PERSONAL' && renderPersonalInputs()}

             <div className="mt-8 pt-4">
                <button 
                   onClick={runAnalysis}
                   disabled={isAnalyzing}
                   className="w-full bg-gradient-to-r from-bio-primary to-sky-600 text-white py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-200 disabled:opacity-50 hover:scale-[1.02]"
                >
                   {isAnalyzing ? <span className="animate-spin">⏳</span> : <BrainCircuit size={20} />}
                   <span>{isAnalyzing ? t.analyzing : t.analyzeBtn}</span>
                </button>
             </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="md:col-span-8 space-y-6">
           
           {/* Chart Section */}
           <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl h-[300px] relative flex flex-col neon-border">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-slate-600 font-mono text-xs uppercase tracking-widest flex gap-2 items-center">
                     <BarChart3 size={16} className="text-bio-primary" /> {t.results.header}
                  </h3>
                  {analysisResult?.riskLevel && (
                      <span className={`text-[10px] px-2 py-1 rounded border shadow-sm ${analysisResult.riskLevel === 'DANGER' ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-600'}`}>
                         {t.results.risk}: {t.results.riskLabels[analysisResult.riskLevel]}
                      </span>
                  )}
               </div>
               <div className="w-full h-[220px] min-h-[220px] bg-slate-50/50 rounded-xl border border-gray-100 p-2 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                   
                   {data.length > 0 ? <MetricsChart data={data} mode={mode} /> : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                          <Activity size={32} className="opacity-50 animate-pulse text-bio-primary" />
                          <span className="text-xs">...</span>
                      </div>
                   )}
               </div>
           </div>
           
           {/* AI Analysis Result */}
           {analysisResult && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
                  
                  {/* Top Row: Risk, Projected Scores, Radar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
                      <div className="md:col-span-1 h-[250px] md:h-auto">
                        {renderRiskCircle(analysisResult.riskLevel)}
                      </div>
                      
                      <div className="md:col-span-1 h-[250px] md:h-auto">
                          {renderProjectedScores()}
                      </div>
                      
                      <div className="md:col-span-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl p-4 flex flex-col shadow-sm h-[250px] md:h-auto">
                          <h4 className="text-slate-700 font-bold text-xs mb-2 flex items-center gap-2">
                             <Target size={14} className="text-bio-primary" /> {t.results.balance}
                          </h4>
                          <div className="w-full h-full min-h-[180px]">
                              <SwotRadar swot={analysisResult.swot} />
                          </div>
                      </div>
                  </div>

                  {/* SWOT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-emerald-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <Swords size={18} /> {t.results.swot.S}
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                                   <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check size={10} className="text-emerald-600" />
                                   </div>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>
                      
                      <div className="bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-red-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <ShieldAlert size={18} /> {t.results.swot.W}
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.weaknesses.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-red-800">
                                   <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <X size={10} className="text-red-600" />
                                   </div>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-blue-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <TrendingUp size={18} /> {t.results.swot.O}
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.opportunities.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
                                   <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <TrendingUp size={10} className="text-blue-600" />
                                   </div>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>

                      <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-orange-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <Shield size={18} /> {t.results.swot.T}
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.threats.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-orange-800">
                                   <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <AlertTriangle size={10} className="text-orange-600" />
                                   </div>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  {/* Prediction & Strategy */}
                  <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-md space-y-6">
                      <div className="mb-6 border-b border-gray-100 pb-6">
                          <h4 className="text-sky-700 font-bold mb-3 flex items-center gap-2 text-lg">
                             <Sparkles size={20} className="text-yellow-500" /> {t.results.prediction}
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed border-r-4 border-bio-primary pr-4 bg-sky-50 p-4 rounded-l-lg whitespace-pre-wrap">
                              {analysisResult.prediction}
                          </p>
                      </div>

                      <div className="mb-6">
                          <h4 className="text-yellow-600 font-bold mb-3 flex items-center gap-2 text-lg">
                             <Zap size={20} /> {t.results.strategy}
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed border-r-4 border-yellow-400 pr-4 bg-yellow-50 p-4 rounded-l-lg whitespace-pre-wrap">
                              {analysisResult.strategy}
                          </p>
                      </div>

                      {/* Execution Steps */}
                      {analysisResult.executionSteps && analysisResult.executionSteps.length > 0 && (
                        <div>
                           <h4 className="text-blue-600 font-bold mb-4 flex items-center gap-2 text-lg">
                             <ListChecks size={20} /> {t.results.actionPlan}
                          </h4>
                          <div className="grid gap-3">
                             {analysisResult.executionSteps.map((step, index) => (
                               <div key={index} className="flex items-start gap-3 bg-white border border-gray-200 p-4 rounded-xl hover:border-blue-300 transition-all hover:bg-blue-50 hover:translate-x-1 shadow-sm">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs shrink-0 mt-0.5 border border-blue-200">
                                     {index + 1}
                                  </div>
                                  <p className="text-sm text-slate-700">{step}</p>
                               </div>
                             ))}
                          </div>
                        </div>
                      )}

                  </div>

              </div>
           )}

        </div>

      </div>
      
      {renderFeedbackSection()}
      
      <footer className="mt-auto py-8 text-center text-slate-400 text-xs font-mono">
         {t.footer}
      </footer>

    </div>
  );
};

export default App;
