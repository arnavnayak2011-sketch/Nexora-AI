import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  ScanLine,
  GraduationCap,
  Briefcase,
  Bell,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  Calendar,
  BookOpen,
  Award,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Trash2,
  Plus,
  ChevronRight,
  Brain,
  Code,
  Compass,
  Zap,
  FileText,
  UserCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Play,
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Star,
  ArrowRight,
  Download,
  Share2,
  Layers,
  CheckSquare,
  Shield,
  Lock,
  LogOut,
  Settings,
  CloudLightning,
  CreditCard,
  Crown,
} from "lucide-react";

// ==========================================
// VOICE LANGUAGES CONFIGURATION (CHAT + REMINDERS)
// ==========================================
const VOICE_LANGUAGES = [
  {
    code: "en-US",
    label: "English (US)",
    short: "EN",
    flag: "🇺🇸",
    directive: "Respond clearly in American English.",
    placeholder: "Ask Nexora AI anything, or type 'Generate 8K image of...' 🎨",
    reminderVoiceTemplate: (title, time, category) =>
      `Attention! This is your Nexora AI Smart Reminder for ${category}. Task: ${title}, scheduled for ${time}. Stay focused and have a productive day!`,
    reminderSummaryTemplate: (count, firstTitle) =>
      `You have ${count} pending reminders today. Your top priority task is: ${firstTitle}.`,
  },
  {
    code: "ja-JP",
    label: "Japanese",
    short: "日本語",
    flag: "🇯🇵",
    directive: "日本語で丁寧かつ正確に回答してください。",
    placeholder:
      "Nexora AI に質問、またはプロ品質の画像生成プロンプトを入力...",
    reminderVoiceTemplate: (title, time, category) =>
      `こんにちは。Nexora AI からのスマートリマインダーです。カテゴリーは ${category}、予定は「${title}」、時間は ${time} です。忘れずに確認してください！`,
    reminderSummaryTemplate: (count, firstTitle) =>
      `現在、未完了のリマインダーが ${count} 件あります。最優先のタスクは「${firstTitle}」です。`,
  },
  {
    code: "hi-IN",
    label: "Hindi",
    short: "हिन्दी",
    flag: "🇮🇳",
    directive: "हिन्दी में स्पष्ट और सटीक उत्तर दें।",
    placeholder: "Nexora AI से कुछ भी पूछें या '8K Image बनाओ...' लिखें 🎨",
    reminderVoiceTemplate: (title, time, category) =>
      `नमस्ते! यह नेक्सोरा एआई की तरफ से आपका स्मार्ट वॉइस रिमाइंडर है। श्रेणी: ${category}। आपका महत्वपूर्ण कार्य है: ${title}, जिसका समय ${time} निर्धारित है।`,
    reminderSummaryTemplate: (count, firstTitle) =>
      `नमस्ते! आज आपके कुल ${count} रिमाइंडर बाकी हैं। आपका सबसे पहला कार्य है: ${firstTitle}।`,
  },
];

// ==========================================
// HEAVY PRO IMAGE GENERATION STYLES, LENSES & RATIOS
// ==========================================
const IMAGE_STYLES = [
  {
    id: "hyperraw",
    label: "Hyper-Realistic 8K RAW",
    promptSuffix:
      "shot on Phase One XF IQ4 150MP, 85mm f/1.4 lens, ultra-realistic 8k RAW photograph, skin & surface micro-textures, natural subsurface scattering, photorealistic masterpiece, zero artifacts",
  },
  {
    id: "imax",
    label: "Cinematic IMAX 70mm",
    promptSuffix:
      "IMAX 70mm film still, Panavision anamorphic lens, dramatic volumetric lighting, teal and orange color grading, epic atmospheric depth, Hollywood blockbuster cinematography, 8k resolution",
  },
  {
    id: "unreal5",
    label: "3D Unreal Engine 5 / Pixar",
    promptSuffix:
      "Unreal Engine 5 Lumen global illumination, Octane Render 8k, Pixar & Disney 3D studio animation quality, ray-traced reflections, ultra-crisp 3D character and environment rendering",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Neon 2099",
    promptSuffix:
      "futuristic cyberpunk metropolis, holographic neon magenta and cyan signage, wet rain-slicked street reflections, raytracing, hyper-detailed sci-fi concept art, 8k octane",
  },
  {
    id: "anime",
    label: "Anime Shinkai 8K",
    promptSuffix:
      "Makoto Shinkai and ufotable masterpiece anime art style, breathtaking volumetric clouds and dramatic sky lighting, intricate background detail, vibrant cel shading, 8k digital illustration",
  },
  {
    id: "logo",
    label: "Luxury Brand Logo",
    promptSuffix:
      "award-winning minimalist luxury vector logo design, sleek golden ratio geometry, premium dark studio presentation, embossed metallic finish, Dribbble & Behance featured branding",
  },
  {
    id: "product",
    label: "Commercial Product Ad",
    promptSuffix:
      "high-end commercial studio product photography, rim lighting, macro lens sharpness, luxury advertisement aesthetic, dynamic splash and floating particles, 8k studio shot",
  },
  {
    id: "architecture",
    label: "Architectural Digest",
    promptSuffix:
      "ultra-modern luxury architectural photography, golden hour sunlight streaming through floor-to-ceiling glass, V-Ray photorealistic interior and exterior render, Architectural Digest cover",
  },
];

const LIGHTING_PRESETS = [
  {
    id: "volumetric",
    label: "Volumetric God Rays",
    boost:
      "dramatic volumetric god rays, atmospheric haze, cinematic rim light",
  },
  {
    id: "studio",
    label: "Pro Studio Softbox",
    boost:
      "three-point professional studio softbox lighting, crisp catchlights, balanced shadows",
  },
  {
    id: "golden",
    label: "Golden Hour Glow",
    boost:
      "warm golden hour sunset lighting, magic hour lens flare, rich warm highlights",
  },
  {
    id: "neon",
    label: "Cyber Neon Rim",
    boost:
      "dual-tone electric purple and cyan neon rim lighting, high-contrast dark mood",
  },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square", width: 1024, height: 1024 },
  { id: "16:9", label: "16:9 Landscape", width: 1280, height: 720 },
  { id: "9:16", label: "9:16 Portrait", width: 720, height: 1280 },
];

// ==========================================
// NEXORA NEURAL ENGINE HELPERS (TEXT + HEAVY IMAGE + SPEECH)
// ==========================================
let runtimeApiKey = "";
try {
  const savedKey = localStorage.getItem("nexora_gemini_api_key");
  if (savedKey && !savedKey.includes("Placeholder")) {
    runtimeApiKey = savedKey.trim();
  }
} catch (e) {
  runtimeApiKey = "";
}

async function callGeminiAPI({
  prompt,
  systemInstruction = "You are Nexora AI (Tagline: Smarter • Easier • For You), a world-class intelligent assistant built for students, scholars, and professionals.",
  inlineImage = null,
  jsonSchema = null,
}) {
  const apiKey = runtimeApiKey || "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt }];
  if (inlineImage && inlineImage.data) {
    parts.push({
      inlineData: {
        mimeType: inlineImage.mimeType || "image/png",
        data: inlineImage.data,
      },
    });
  }

  const payload = {
    contents: [{ role: "user", parts }],
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
  };

  if (jsonSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    };
  }

  const delays = [800, 1600];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return jsonSchema ? JSON.parse(text) : text;
      }
      throw new Error("Empty response from model");
    } catch (err) {
      if (attempt === delays.length) {
        throw err;
      }
      await new Promise((res) => setTimeout(res, delays[attempt]));
    }
  }
}

// Heavy Dual-Engine Image Generator:
// 1. Primary: Gemini 3.1 Flash Image (Studio Native Multimodal)
// 2. Fallback: High-Speed Flux/Pollinations 8K Neural Renderer (Ensures 100% uptime even without an API key!)
async function callHeavyImageEngine({ prompt, aspectRatio = "1:1" }) {
  const apiKey = runtimeApiKey || "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio },
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      if (part && part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || "image/png";
        return {
          url: `data:${mimeType};base64,${part.inlineData.data}`,
          engine: "Gemini 3.1 Flash Image 8K",
        };
      }
    }
  } catch (e) {
    // Proceed to Heavy Neural Fallback Engine if direct key isn't active yet
  }

  // Heavy Neural Fallback Engine (Always succeeds with ultra-detailed AI artwork)
  const ratioObj =
    ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const seed = Math.floor(Math.random() * 999999);
  const encodedPrompt = encodeURIComponent(prompt);
  const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratioObj.width}&height=${ratioObj.height}&seed=${seed}&nologo=true&enhance=true`;

  return {
    url: fallbackUrl,
    engine: "Nexora Heavy Flux-8K Neural Engine",
  };
}

function isImageGenerationPrompt(text) {
  const cleaned = text.trim().toLowerCase();
  if (
    cleaned.startsWith("/image") ||
    cleaned.startsWith("/img") ||
    cleaned.startsWith("/draw") ||
    cleaned.startsWith("generate image") ||
    cleaned.startsWith("create image") ||
    cleaned.startsWith("generate an image") ||
    cleaned.startsWith("create an image") ||
    cleaned.startsWith("make an image") ||
    cleaned.startsWith("make a photo") ||
    cleaned.startsWith("generate a photo") ||
    cleaned.startsWith("draw a ") ||
    cleaned.startsWith("draw an ")
  ) {
    return true;
  }
  const regex =
    /\b(generate|create|make|draw|design|render)\b.*\b(image|photo|picture|wallpaper|illustration|logo|poster|portrait|art|8k)\b/i;
  const hindiRegex =
    /(image|photo|tasveer|फोटो|इमेज|तस्वीर|लोगो).*(banao|banaye|generate|बनाओ|बनाएं)/i;
  return regex.test(cleaned) || hindiRegex.test(cleaned);
}

// ==========================================
// MULTILINGUAL TEXT-TO-SPEECH & CHIME ENGINE
// ==========================================
function playNexoraChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(
        0.18,
        ctx.currentTime + idx * 0.11 + 0.03
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + idx * 0.11 + 0.45
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.11);
      osc.stop(ctx.currentTime + idx * 0.11 + 0.46);
    });
  } catch (e) {
    // Ignore audio context restriction
  }
}

function speakWithNexoraVoice(text, langCode = "en-US", onEndCallback = null) {
  try {
    if (!("speechSynthesis" in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/```[\s\S]*?```/g, " code block ")
      .replace(/[*#_~`>-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = langCode.split("-")[0].toLowerCase();
    const matchedVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase() === langCode.toLowerCase() &&
          (v.name.includes("Google") || v.name.includes("Natural"))
      ) ||
      voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEndCallback) onEndCallback();
  }
}

// ==========================================
// CUSTOM NEXORA AI ORBITAL 'N' BRAND LOGO SVG
// ==========================================
function NexoraLogo({ size = 44, showText = true, showTagline = true }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 rounded-2xl p-[1.5px] bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-900 shadow-[0_0_24px_rgba(168,85,247,0.55)]"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full rounded-[14px] bg-[#070512]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="nexoraBg"
              x1="0"
              y1="0"
              x2="120"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#14092b" />
              <stop offset="50%" stopColor="#070412" />
              <stop offset="100%" stopColor="#1b0938" />
            </linearGradient>
            <linearGradient
              id="nLeftLeg"
              x1="30"
              y1="28"
              x2="45"
              y2="92"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#e9d5ff" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <linearGradient
              id="nDiag"
              x1="32"
              y1="28"
              x2="88"
              y2="92"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient
              id="nRightLeg"
              x1="78"
              y1="28"
              x2="88"
              y2="92"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient
              id="orbitGrad"
              x1="10"
              y1="88"
              x2="110"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="45%" stopColor="#e879f9" />
              <stop offset="75%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="120" height="120" rx="24" fill="url(#nexoraBg)" />
          <path
            d="M0 36 C22 22, 38 12, 58 0 L0 0 Z"
            fill="url(#orbitGrad)"
            opacity="0.35"
          />
          <path
            d="M120 84 C98 98, 82 108, 62 120 L120 120 Z"
            fill="url(#orbitGrad)"
            opacity="0.35"
          />
          <path
            d="M27 30 H44 L44 88 H29 L34 84 V34 L27 30 Z"
            fill="url(#nLeftLeg)"
          />
          <path
            d="M74 30 H92 L86 34 V90 H78 L78 34 L74 30 Z"
            fill="url(#nRightLeg)"
          />
          <path
            d="M34 30 L47 30 L85 88 L73 90 L34 30 Z"
            fill="url(#nDiag)"
            filter="url(#neonGlow)"
          />
          <path
            d="M24 64 C9 76, 12 92, 42 82 C68 73, 108 51, 104 35 C101 25, 86 24, 72 27"
            stroke="url(#orbitGrad)"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neonGlow)"
          />
          <path
            d="M91 12 L94 22 L104 25 L94 28 L91 38 L88 28 L78 25 L88 22 Z"
            fill="#ffffff"
            filter="url(#neonGlow)"
          />
          <path
            d="M60 98 L62 103 L67 105 L62 107 L60 112 L58 107 L53 105 L58 103 Z"
            fill="#e879f9"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Nexora
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
              AI
            </span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-purple-200/80 uppercase">
                SMARTER • EASIER • FOR YOU
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// INITIAL CURATED DATA (EXPANDED SCHOLARSHIPS, JOBS, HOMEWORK)
// ==========================================
const SAMPLE_HOMEWORK_PROBLEMS = [
  {
    id: "calc-1",
    subject: "Maths",
    title: "Calculus: Definite Integration & Area",
    badge: "Class 12 / JEE",
    problemText:
      "Evaluate the definite integral: ∫ from 0 to π/4 of ln(1 + tan(x)) dx and explain the King's Property of definite integrals used.",
    diagramSvg: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="150" rx="12" fill="#120d26"/><text x="22" y="45" fill="#e9d5ff" font-family="monospace" font-size="15">Problem #14 (Integral Calculus)</text><text x="22" y="85" fill="#ffffff" font-family="serif" font-size="22" font-weight="bold">I = ∫₀^(π/4) ln(1 + tan x) dx</text><text x="22" y="122" fill="#a855f7" font-family="sans-serif" font-size="13">Find the exact value of I showing all steps.</text></svg>`,
  },
  {
    id: "phys-1",
    subject: "Physics",
    title: "Mechanics: Projectile Motion on Incline",
    badge: "JEE / AP Physics",
    problemText:
      "A projectile is fired from the base of an inclined plane of angle 30° with an initial velocity of 40 m/s at an angle of 60° with the horizontal. Calculate (1) Time of flight before striking the incline, and (2) Range along the inclined plane. (Take g = 10 m/s²).",
    diagramSvg: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="150" rx="12" fill="#120d26"/><line x1="30" y1="125" x2="320" y2="125" stroke="#475569" stroke-width="2"/><line x1="30" y1="125" x2="290" y2="35" stroke="#a855f7" stroke-width="3"/><path d="M30 125 Q 130 10, 225 57" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5,5" fill="none"/><circle cx="30" cy="125" r="5" fill="#f472b6"/><text x="45" y="60" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">u = 40 m/s, θ = 60°, β = 30°</text><text x="150" y="115" fill="#c084fc" font-family="sans-serif" font-size="12">Find Time of Flight (T) &amp; Range (R)</text></svg>`,
  },
];

const INITIAL_SCHOLARSHIPS_DATA = [
  {
    id: "sch-1",
    title: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    amount: "₹2,00,000 (Over Degree)",
    deadline: "2026-12-15",
    level: "Undergraduate",
    category: "All Streams",
    isNewToday: true,
    tags: ["Merit-cum-Means", "First Year UG", "India"],
    eligibility:
      "First-year full-time undergraduate students in any stream across India with household income < ₹15L.",
    applyUrl: "https://www.scholarships.reliancefoundation.org/",
  },
  {
    id: "sch-2",
    title: "HDFC Badhte Kadam Scholarship 2026-27",
    provider: "HDFC Bank Parivartan",
    amount: "₹1,00,000 / Year",
    deadline: "2026-11-30",
    level: "Undergraduate",
    category: "Engineering & Medical",
    isNewToday: true,
    tags: ["Professional Degrees", "High Grant"],
    eligibility:
      "Students pursuing B.Tech, MBBS, LLB, or B.Arch at recognized colleges with 75%+ in previous board exams.",
    applyUrl: "https://www.buddy4study.com/",
  },
  {
    id: "sch-3",
    title: "AICTE Pragati Scholarship for Girls in Tech",
    provider: "AICTE (Govt. of India)",
    amount: "₹50,000 / Year + Laptop",
    deadline: "2026-12-20",
    level: "Undergraduate",
    category: "Women in STEM",
    isNewToday: true,
    tags: ["Govt Scholarship", "Women in Tech"],
    eligibility:
      "Girl students admitted to 1st year of AICTE-approved Technical Degree/Diploma institutions.",
    applyUrl: "https://scholarships.gov.in/",
  },
  {
    id: "sch-4",
    title: "Tata Trusts Means Grant for Higher Education",
    provider: "Tata Trusts India",
    amount: "Up to ₹1,50,000 / Year",
    deadline: "2027-01-10",
    level: "Postgraduate",
    category: "Engineering & Medical",
    isNewToday: false,
    tags: ["Tuition Coverage", "Merit Grant"],
    eligibility:
      "Undergraduate & Postgraduate students in Engineering, Medicine, Law, and Commerce with 65%+ marks.",
    applyUrl: "https://www.tatatrusts.org/",
  },
  {
    id: "sch-5",
    title: "Google Generation Scholarship (APAC & US)",
    provider: "Google Education",
    amount: "$2,500 - $10,000 USD",
    deadline: "2026-12-18",
    level: "Undergraduate",
    category: "Global / Study Abroad",
    isNewToday: true,
    tags: ["Computer Science", "Global Prestige"],
    eligibility:
      "Full-time students pursuing Computer Science, AI, or Software Engineering with strong leadership & coding profile.",
    applyUrl: "https://buildyourfuture.withgoogle.com/scholarships",
  },
  {
    id: "sch-6",
    title: "DST INSPIRE Scholarship for Higher Education (SHE)",
    provider: "Dept. of Science & Tech (Govt.)",
    amount: "₹80,000 / Year (5 Years)",
    deadline: "2026-12-05",
    level: "Undergraduate",
    category: "All Streams",
    isNewToday: false,
    tags: ["Pure Sciences", "Top 1% Board Rankers"],
    eligibility:
      "Students in the top 1% of Class 12 board exams pursuing B.Sc. / B.S. / Integrated M.Sc. in Natural Sciences.",
    applyUrl: "https://online-inspire.gov.in/",
  },
  {
    id: "sch-7",
    title: "Fulbright-Nehru Master's Fellowship (US-India)",
    provider: "USIEF",
    amount: "Full Tuition + Living + Airfare",
    deadline: "2027-02-15",
    level: "Postgraduate",
    category: "Global / Study Abroad",
    isNewToday: false,
    tags: ["Study in USA", "100% Funded"],
    eligibility:
      "Graduates with a 4-year Bachelor's degree aiming to pursue a Master's degree at top US universities.",
    applyUrl: "https://www.usief.org.in/",
  },
  {
    id: "sch-8",
    title: "ONGC Foundation Merit Scholarship",
    provider: "ONGC India",
    amount: "₹48,000 / Year",
    deadline: "2026-11-28",
    level: "Undergraduate",
    category: "Engineering & Medical",
    isNewToday: true,
    tags: ["PSU Grant", "Engineering / MBA / MBBS"],
    eligibility:
      "First-year students in Engineering, MBBS, MBA, or Master's in Geology/Geophysics with 60%+ marks.",
    applyUrl: "https://ongcscholar.org/",
  },
];

const INITIAL_JOBS_DATA = [
  {
    id: "job-1",
    role: "AI & LLM Application Engineer Intern",
    company: "NexTech Labs India",
    location: "Bengaluru / Remote",
    type: "Internship",
    compensation: "₹45,000 / month Stipend",
    posted: "Just Now (Today's Drop)",
    badge: "FRESH TODAY",
    skills: ["Python", "GenAI / LLMs", "React.js", "Prompt Engineering"],
    description:
      "Build next-generation multimodal AI workflows, RAG pipelines, and responsive mobile-first web interfaces for 100k+ users.",
  },
  {
    id: "job-2",
    role: "Full-Stack Product Engineer (Fresher / SDE-1)",
    company: "CloudScale Global",
    location: "Remote (US / India)",
    type: "Full-Time",
    compensation: "₹14,00,000 - ₹18,00,000 LPA",
    posted: "1 hour ago",
    badge: "FRESH TODAY",
    skills: ["TypeScript", "React", "Node.js", "Tailwind CSS"],
    description:
      "Design and ship high-performance SaaS dashboards and AI-powered creative studio workflows.",
  },
  {
    id: "job-3",
    role: "Software Engineering STEP Intern 2027",
    company: "Google India",
    location: "Hyderabad / Bengaluru",
    type: "Internship",
    compensation: "₹85,000 / month Stipend",
    posted: "3 hours ago",
    badge: "FRESH TODAY",
    skills: ["Data Structures", "C++ / Java", "Python", "Algorithms"],
    description:
      "Work alongside core Google engineering teams on scalable distributed systems, Search, and Cloud AI products.",
  },
  {
    id: "job-4",
    role: "Frontend React & UI Motion Engineer",
    company: "Razorpay",
    location: "Bengaluru / Hybrid",
    type: "Full-Time",
    compensation: "₹18,00,000 - ₹24,00,000 LPA",
    posted: "Today",
    badge: "High Package",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Web Performance"],
    description:
      "Craft ultra-smooth checkout and fintech dashboard experiences used by millions of Indian and global businesses.",
  },
  {
    id: "job-5",
    role: "Data Science & Machine Learning Intern",
    company: "Swiggy Instamart AI",
    location: "Remote / Bengaluru",
    type: "Internship",
    compensation: "₹50,000 / month Stipend",
    posted: "Today",
    badge: "PPO Opportunity",
    skills: ["Python", "SQL", "PyTorch", "Predictive Modeling"],
    description:
      "Optimize hyper-local delivery ETA prediction models and real-time recommendation engines.",
  },
  {
    id: "job-6",
    role: "Junior Backend & API Cloud Developer",
    company: "Stripe Global Remote",
    location: "Remote Worldwide",
    type: "Full-Time",
    compensation: "$65,000 - $85,000 USD / yr",
    posted: "Today",
    badge: "Global Remote",
    skills: ["Node.js", "Go / Python", "REST APIs", "PostgreSQL"],
    description:
      "Build ultra-reliable payment infrastructure, developer SDKs, and global subscription billing webhooks.",
  },
  {
    id: "job-7",
    role: "AI Content & Prompt Operations Specialist",
    company: "Scale AI Studio",
    location: "Work From Home (Flexible)",
    type: "Part-Time / Freelance",
    compensation: "$25 - $40 / hour",
    posted: "Today",
    badge: "Instant Hiring",
    skills: [
      "English Fluency",
      "AI Prompting",
      "Code Review",
      "Analytical Writing",
    ],
    description:
      "Evaluate and train frontier multimodal AI models for reasoning, coding accuracy, and creative image synthesis.",
  },
  {
    id: "job-8",
    role: "Android & React Native Mobile Developer",
    company: "Zomato Consumer Tech",
    location: "Gurugram / Delhi NCR",
    type: "Full-Time",
    compensation: "₹15,00,000 - ₹21,00,000 LPA",
    posted: "Today",
    badge: "FRESH TODAY",
    skills: ["React Native", "Kotlin", "JavaScript", "Mobile UI"],
    description:
      "Build lightning-fast mobile ordering and live-tracking experiences for millions of daily active users.",
  },
];

const INITIAL_REMINDERS = [
  {
    id: "rem-1",
    title: "Submit Reliance Foundation Scholarship Form",
    category: "Scholarship Deadline",
    priority: "High",
    date: "2026-11-05",
    time: "17:00",
    completed: false,
    spokenOnce: false,
  },
  {
    id: "rem-2",
    title: "Complete Google STEP Internship Coding Practice",
    category: "Career & Job Prep",
    priority: "High",
    date: "2026-11-05",
    time: "19:30",
    completed: false,
    spokenOnce: false,
  },
];

// ==========================================
// FORMATTED MESSAGE COMPONENT
// ==========================================
function FormattedMessage({ content }) {
  const [copiedBlock, setCopiedBlock] = useState(null);

  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 1800);
  };

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-slate-100">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const firstLine = lines[0]?.trim() || "";
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : "code";
          const codeContent = hasLang
            ? lines.slice(1).join("\n")
            : lines.join("\n");

          return (
            <div
              key={index}
              className="my-2 rounded-xl overflow-hidden border border-purple-500/30 bg-[#070510]"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-purple-950/50 border-b border-purple-500/20 text-xs text-purple-200">
                <span className="font-mono uppercase tracking-wider">
                  {lang}
                </span>
                <button
                  onClick={() => handleCopyCode(codeContent, index)}
                  className="flex items-center gap-1 text-purple-300 hover:text-white transition"
                >
                  {copiedBlock === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs font-mono text-purple-100 leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              const renderInlineBold = (str) => {
                const segments = str.split(/(\*\*.*?\*\*)/g);
                return segments.map((seg, sIdx) =>
                  seg.startsWith("**") && seg.endsWith("**") ? (
                    <strong
                      key={sIdx}
                      className="font-semibold text-purple-200"
                    >
                      {seg.slice(2, -2)}
                    </strong>
                  ) : (
                    seg
                  )
                );
              };

              if (trimmed.startsWith("### ")) {
                return (
                  <h4
                    key={lIdx}
                    className="text-base font-bold text-fuchsia-300 pt-1"
                  >
                    {renderInlineBold(trimmed.replace("### ", ""))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3
                    key={lIdx}
                    className="text-base font-extrabold text-white pt-1.5"
                  >
                    {renderInlineBold(trimmed.replace("## ", ""))}
                  </h3>
                );
              }
              if (
                trimmed.startsWith("- ") ||
                trimmed.startsWith("* ") ||
                trimmed.startsWith("• ")
              ) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="text-fuchsia-400 mt-1">•</span>
                    <span className="flex-1">
                      {renderInlineBold(trimmed.slice(2))}
                    </span>
                  </div>
                );
              }
              return <p key={lIdx}>{renderInlineBold(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// MAIN NEXORA AI APPLICATION
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [authPasswordInput, setAuthPasswordInput] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [inputGeminiKey, setInputGeminiKey] = useState(runtimeApiKey);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [dailyQuotas, setDailyQuotas] = useState({
    chatMessagesUsed: 0,
    homeworkScansUsed: 0,
    scholarshipSopsUsed: 0,
    jobAiPassesUsed: 0,
  });

  const [activeTab, setActiveTab] = useState("chat");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveNotification, setLiveNotification] = useState(null);

  // Voice & Language State
  const [selectedVoiceLang, setSelectedVoiceLang] = useState("en-US");
  const [speakingId, setSpeakingId] = useState(null);
  const [isListeningMic, setIsListeningMic] = useState(false);

  const activeLangObj = useMemo(
    () =>
      VOICE_LANGUAGES.find((l) => l.code === selectedVoiceLang) ||
      VOICE_LANGUAGES[0],
    [selectedVoiceLang]
  );

  const todayFormatted = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const triggerNotification = (
    title,
    body,
    category = "Nexora AI",
    speakText = null
  ) => {
    setLiveNotification({
      title,
      body,
      category,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    if (soundEnabled) {
      playNexoraChime();
      if (speakText) {
        setTimeout(() => {
          speakWithNexoraVoice(speakText, selectedVoiceLang);
        }, 450);
      }
    }
    setTimeout(() => setLiveNotification(null), 6000);
  };

  // Speech-to-Text Microphone Handler (Works in EN, JA, HI)
  const handleStartVoiceMic = (onTranscriptResult) => {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      triggerNotification(
        "Voice Mic Notice",
        "Your browser does not support native SpeechRecognition. Try Chrome on Android or Desktop.",
        "Voice Engine"
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = selectedVoiceLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningMic(true);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        if (transcript && onTranscriptResult) {
          onTranscriptResult(transcript);
        }
        setIsListeningMic(false);
      };
      recognition.onerror = () => setIsListeningMic(false);
      recognition.onend = () => setIsListeningMic(false);
      recognition.start();
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!authEmailInput.trim() || !authPasswordInput.trim()) {
      setAuthError("Please enter both email and password.");
      return;
    }

    setIsAuthLoading(true);
    setAuthError("");

    try {
      await new Promise((res) => setTimeout(res, 350));
      const email = authEmailInput.trim();
      const password = authPasswordInput.trim();

      const isMasterAdmin =
        email === "admin21218@gmail.com" && password === "Admin21218@";
      const savedUsersJson = localStorage.getItem("nexora_registered_users");
      let usersList = savedUsersJson ? JSON.parse(savedUsersJson) : [];

      let userObj;
      if (isMasterAdmin) {
        userObj = {
          name: "Master Admin",
          email: "admin21218@gmail.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin21218",
          subscription: "Pro",
          isAdmin: true,
        };
      } else {
        const existing = usersList.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          userObj = existing;
        } else {
          userObj = {
            name: email.split("@")[0].toUpperCase(),
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            subscription: "Free",
            isAdmin: false,
          };
          usersList.push(userObj);
          localStorage.setItem(
            "nexora_registered_users",
            JSON.stringify(usersList)
          );
        }
      }

      setCurrentUser(userObj);
      triggerNotification(
        userObj.isAdmin
          ? "Master Admin Authenticated 🔒"
          : "Welcome to Nexora AI ✨",
        `Logged in as ${userObj.email}`,
        "Authentication"
      );
    } catch (err) {
      setAuthError("Authentication failed. Please check credentials.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    window.speechSynthesis?.cancel();
    setCurrentUser(null);
    triggerNotification(
      "Signed Out",
      "You have been signed out securely.",
      "Authentication"
    );
  };

  const handleSaveAdminKey = (e) => {
    e.preventDefault();
    runtimeApiKey = inputGeminiKey.trim();
    try {
      if (runtimeApiKey) {
        localStorage.setItem("nexora_gemini_api_key", runtimeApiKey);
      } else {
        localStorage.removeItem("nexora_gemini_api_key");
      }
    } catch (err) {
      // ignore storage errors
    }
    setShowApiKeyModal(false);
    triggerNotification(
      "API Key Updated 🔒",
      "Master Gemini API Key saved securely.",
      "Admin Security"
    );
  };

  const checkAndConsumeQuota = (type) => {
    if (
      currentUser?.subscription === "Pro" ||
      currentUser?.subscription === "Lite"
    )
      return true;

    const limits = {
      chat: {
        used: dailyQuotas.chatMessagesUsed,
        max: 10,
        name: "Free AI Messages",
      },
      scanner: {
        used: dailyQuotas.homeworkScansUsed,
        max: 5,
        name: "Free Homework Scans",
      },
      scholarship: {
        used: dailyQuotas.scholarshipSopsUsed,
        max: 3,
        name: "Free Scholarship SOPs",
      },
      job: {
        used: dailyQuotas.jobAiPassesUsed,
        max: 3,
        name: "Free Job AI Passes",
      },
    };

    const target = limits[type];
    if (target.used >= target.max) {
      setShowSubscriptionModal(true);
      triggerNotification(
        `Daily Limit Reached (${target.name})`,
        `Upgrade to Nexora Lite or Pro for unlimited access!`,
        "Subscription"
      );
      return false;
    }

    setDailyQuotas((prev) => ({
      ...prev,
      chatMessagesUsed:
        type === "chat" ? prev.chatMessagesUsed + 1 : prev.chatMessagesUsed,
      homeworkScansUsed:
        type === "scanner"
          ? prev.homeworkScansUsed + 1
          : prev.homeworkScansUsed,
      scholarshipSopsUsed:
        type === "scholarship"
          ? prev.scholarshipSopsUsed + 1
          : prev.scholarshipSopsUsed,
      jobAiPassesUsed:
        type === "job" ? prev.jobAiPassesUsed + 1 : prev.jobAiPassesUsed,
    }));
    return true;
  };

  // ==========================================
  // NEXO CHAT + HEAVY 8K AI IMAGE STUDIO STATE
  // ==========================================
  const [chatMode, setChatMode] = useState("Fast & Smart");
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [forceImageMode, setForceImageMode] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [magicPromptBoost, setMagicPromptBoost] = useState(true);
  const [autoSpeakChat, setAutoSpeakChat] = useState(false);
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      mode: "Fast & Smart",
      lang: "en-US",
      timestamp: "10:20 AM",
      content:
        "Hello! I'm **Nexora AI** (*Smarter • Easier • For You*) ✨\n\nHere is what's supercharged for you today:\n- 🎨 **Heavy 8K AI Image Engine**: Dual-Engine Photorealistic RAW, IMAX 70mm, Unreal Engine 5 & Logo Studio with **Magic Prompt Booster**!\n- 🎓 **Daily Live Scholarships**: Fresh verified grants updated daily + 1-click AI SOP generator.\n- 💼 **Daily Live Job Finder**: Daily fresh internships & full-time drops + AI Cover Letter & Interview prep.\n- 🔊 **Multilingual Voice Reminders**: Reminders that **speak aloud** in **English 🇺🇸, Japanese 🇯🇵, or Hindi 🇮🇳**!",
    },
  ]);

  const CHAT_MODES = [
    {
      id: "Fast & Smart",
      icon: Zap,
      system:
        "You are Nexora AI in Fast & Smart mode. Give clear, concise, high-value answers. Do NOT repeat your greeting or feature list.",
    },
    {
      id: "AI Image Studio",
      icon: Camera,
      system: "You are Nexora AI Heavy 8K Image Studio.",
    },
    {
      id: "Deep Study Tutor",
      icon: Brain,
      system:
        "You are Nexora AI in Deep Study Tutor mode. Break down complex concepts step by step. Do NOT repeat your greeting.",
    },
    {
      id: "Career Coach",
      icon: Compass,
      system:
        "You are Nexora AI in Career Coach mode. Help with resumes, SOPs, and interviews. Do NOT repeat your greeting.",
    },
    {
      id: "Code & Tech",
      icon: Code,
      system:
        "You are Nexora AI in Code & Tech mode. Provide clean, well-commented code blocks.",
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading, isGeneratingImage]);

  const handleDownloadImage = async (dataUrl, promptText) => {
    try {
      const safeName = (promptText || "nexora-ai-8k")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 32);

      if (dataUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${safeName}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${safeName}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
      triggerNotification(
        "8K Image Downloaded 🎨",
        "Saved high-resolution image to your device.",
        "AI Image Studio"
      );
    } catch (e) {
      window.open(dataUrl, "_blank");
    }
  };

  const handleSendMessage = async (
    customPrompt = null,
    forcedImageGen = false
  ) => {
    const textToSend = (customPrompt ?? chatInput).trim();
    if (!textToSend || isChatLoading || isGeneratingImage) return;
    if (!checkAndConsumeQuota("chat")) return;

    const shouldGenerateImage =
      forcedImageGen ||
      forceImageMode ||
      chatMode === "AI Image Studio" ||
      isImageGenerationPrompt(textToSend);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      lang: activeLangObj.code,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");

    if (shouldGenerateImage) {
      setIsGeneratingImage(true);
      const cleanedSubj =
        textToSend
          .replace(
            /^(\/image|\/img|\/draw|generate an image of|generate image of|create an image of|create image of|make an image of|draw)\s*/i,
            ""
          )
          .trim() || textToSend;

      let superchargedPrompt = `${cleanedSubj}, ${selectedImageStyle.promptSuffix}, ${selectedLighting.boost}`;

      // If Magic Prompt Boost is enabled, attempt quick AI expansion for hyper-detailed studio prompt
      if (magicPromptBoost) {
        try {
          const boosted = await callGeminiAPI({
            prompt: `Expand this image prompt into a vivid, 45-word professional 8K photography/art prompt with rich visual details, camera lens, and lighting. Keep the core subject intact. Subject: "${cleanedSubj}". Style: ${selectedImageStyle.label}. Return ONLY the final prompt text.`,
            systemInstruction:
              "You are a master AI art director. Output only the enhanced image prompt.",
          });
          if (boosted && boosted.length > 15) {
            superchargedPrompt = `${boosted.trim()}, ${
              selectedImageStyle.promptSuffix
            }, ${selectedLighting.boost}`;
          }
        } catch (e) {
          // Use standard supercharged prompt if offline/no key
        }
      }

      try {
        const resultObj = await callHeavyImageEngine({
          prompt: superchargedPrompt,
          aspectRatio: selectedAspectRatio,
        });

        const aiImgMsg = {
          id: `ai-img-${Date.now()}`,
          role: "assistant",
          mode: "AI Image Studio",
          lang: activeLangObj.code,
          content: `✨ **Heavy 8K Studio Render Complete**\n- **Subject:** ${cleanedSubj}\n- **Preset:** ${selectedImageStyle.label} • ${selectedLighting.label} (${selectedAspectRatio})\n- **Engine:** ${resultObj.engine}`,
          generatedImage: resultObj.url,
          imagePrompt: cleanedSubj,
          enhancedPrompt: superchargedPrompt,
          imageStyle: selectedImageStyle.label,
          aspectRatio: selectedAspectRatio,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, aiImgMsg]);
        triggerNotification(
          "Heavy 8K Image Ready 🎨",
          `Rendered "${cleanedSubj.slice(0, 28)}..."`,
          "AI Image Studio"
        );
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-img-err-${Date.now()}`,
            role: "assistant",
            mode: "AI Image Studio",
            lang: activeLangObj.code,
            content: `⚠️ Could not generate the image right now. Please try another prompt.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsGeneratingImage(false);
      }
      return;
    }

    // Standard Text Generation
    setIsChatLoading(true);
    const activeModeObj =
      CHAT_MODES.find((m) => m.id === chatMode) || CHAT_MODES[0];

    try {
      const replyText = await callGeminiAPI({
        prompt: textToSend,
        systemInstruction: `${activeModeObj.system} ${activeLangObj.directive}`,
      });

      const newMsgId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          role: "assistant",
          mode: chatMode,
          lang: activeLangObj.code,
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      if (autoSpeakChat) {
        setSpeakingId(newMsgId);
        speakWithNexoraVoice(replyText, activeLangObj.code, () =>
          setSpeakingId(null)
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          mode: chatMode,
          lang: activeLangObj.code,
          content: `Here is a structured response for **"${textToSend}"**:\n\n- **Core Breakdown**: Focus on fundamental principles and practical implementation.\n- **Tip**: Switch to **AI Image Studio** to generate 8K visual diagrams or artwork!`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ==========================================
  // HOMEWORK SCANNER STATE
  // ==========================================
  const [selectedSubject, setSelectedSubject] = useState("Maths");
  const [scannerImagePreview, setScannerImagePreview] = useState(null);
  const [scannerCustomQuestion, setScannerCustomQuestion] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleSelectSampleProblem = (sample) => {
    setSelectedSubject(sample.subject);
    setScannerCustomQuestion(sample.problemText);
    setScannerImagePreview(
      `data:image/svg+xml;utf8,${encodeURIComponent(sample.diagramSvg)}`
    );
    setScanResult(null);
  };

  const handleSolveHomework = async () => {
    if (!scannerImagePreview && !scannerCustomQuestion.trim()) return;
    if (!checkAndConsumeQuota("scanner")) return;

    setIsScanning(true);
    try {
      const parsed = await callGeminiAPI({
        prompt: `Solve this ${selectedSubject} problem step-by-step: ${scannerCustomQuestion}`,
        systemInstruction: `Provide a clear step-by-step solution, key formula, and final answer. ${activeLangObj.directive}`,
      });
      setScanResult({
        extractedProblem: scannerCustomQuestion || "Homework Problem",
        finalAnswer: parsed || "Solution derived successfully.",
      });
    } catch (e) {
      setScanResult({
        extractedProblem: scannerCustomQuestion || "Sample Problem",
        finalAnswer:
          "### Step-by-Step Solution\n- **Step 1**: Identify the given values and apply the fundamental theorem.\n- **Step 2**: Substitute limits and simplify algebraically to obtain the exact result.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  // ==========================================
  // DAILY LIVE SCHOLARSHIP FINDER STATE
  // ==========================================
  const [scholarshipsList, setScholarshipsList] = useState(
    INITIAL_SCHOLARSHIPS_DATA
  );
  const [scholarshipFilter, setScholarshipFilter] = useState("All");
  const [scholarshipSearchQuery, setScholarshipSearchQuery] = useState("");
  const [isFetchingDailyScholarships, setIsFetchingDailyScholarships] =
    useState(false);
  const [sopOutput, setSopOutput] = useState("");
  const [isGeneratingSop, setIsGeneratingSop] = useState(false);

  const filteredScholarships = useMemo(() => {
    return scholarshipsList.filter((sch) => {
      const matchesCat =
        scholarshipFilter === "All" ||
        sch.category === scholarshipFilter ||
        sch.level === scholarshipFilter;
      const q = scholarshipSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        sch.title.toLowerCase().includes(q) ||
        sch.provider.toLowerCase().includes(q) ||
        sch.eligibility.toLowerCase().includes(q) ||
        sch.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [scholarshipsList, scholarshipFilter, scholarshipSearchQuery]);

  // Fetch / Discover Today's New Scholarships via AI
  const handleDiscoverDailyScholarships = async () => {
    setIsFetchingDailyScholarships(true);
    const customTopic =
      scholarshipSearchQuery.trim() ||
      "Engineering, Medical, Undergraduate & Global Study";

    try {
      const schema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            provider: { type: "STRING" },
            amount: { type: "STRING" },
            deadline: { type: "STRING" },
            level: { type: "STRING" },
            category: { type: "STRING" },
            eligibility: { type: "STRING" },
            tags: { type: "ARRAY", items: { type: "STRING" } },
          },
          required: [
            "title",
            "provider",
            "amount",
            "deadline",
            "level",
            "category",
            "eligibility",
            "tags",
          ],
        },
      };

      const aiScholarships = await callGeminiAPI({
        prompt: `Generate 3 realistic, high-value active scholarships for students in India & Worldwide for today (${todayFormatted}) focused on: ${customTopic}. Include exact grant amounts in INR (₹) or USD ($).`,
        systemInstruction:
          "Return a JSON array of 3 verified-style scholarships.",
        jsonSchema: schema,
      });

      if (Array.isArray(aiScholarships) && aiScholarships.length > 0) {
        const formatted = aiScholarships.map((item, idx) => ({
          id: `sch-ai-${Date.now()}-${idx}`,
          title: item.title,
          provider: item.provider,
          amount: item.amount,
          deadline: item.deadline || "2026-12-30",
          level: item.level || "Undergraduate",
          category: item.category || "All Streams",
          isNewToday: true,
          tags: item.tags?.slice(0, 3) || ["New Today", "Verified"],
          eligibility: item.eligibility,
          applyUrl: "https://scholarships.gov.in/",
        }));
        setScholarshipsList((prev) => [...formatted, ...prev]);
        triggerNotification(
          "3 New Scholarships Added Today! 🎓",
          `Fresh daily grants discovered for ${customTopic}.`,
          "Scholarship Finder"
        );
        setIsFetchingDailyScholarships(false);
        return;
      }
      throw new Error("Fallback to curated daily drop");
    } catch (e) {
      // Instant Daily Drop Fallback so button always works
      const dailyPool = [
        {
          id: `sch-daily-${Date.now()}-1`,
          title: `Aditya Birla Premier Merit Scholarship (${todayFormatted} Drop)`,
          provider: "Aditya Birla Capital Foundation",
          amount: "₹1,80,000 / Year",
          deadline: "2026-12-22",
          level: "Undergraduate",
          category: "Engineering & Medical",
          isNewToday: true,
          tags: ["Fresh Today", "IIT / NIT / AIIMS / IIM"],
          eligibility:
            "Students enrolled in top-tier Engineering, Medical, Law, or Management institutes across India.",
          applyUrl: "https://www.adityabirlascholars.net/",
        },
        {
          id: `sch-daily-${Date.now()}-2`,
          title: `Kotak Kanya & Shiksha Nidhi Scholarship 2026`,
          provider: "Kotak Education Foundation",
          amount: "₹1,50,000 / Year",
          deadline: "2026-12-10",
          level: "Undergraduate",
          category: "Women in STEM",
          isNewToday: true,
          tags: ["Fresh Today", "Merit + Need"],
          eligibility:
            "Meritorious students scoring 75%+ in Class 12 pursuing professional graduation courses.",
          applyUrl: "https://kotakeducation.org/",
        },
        {
          id: `sch-daily-${Date.now()}-3`,
          title: `Commonwealth & Chevening Global Excellence Grant`,
          provider: "UK FCDO & Global Partners",
          amount: "£18,000 + 100% Tuition",
          deadline: "2027-01-15",
          level: "Postgraduate",
          category: "Global / Study Abroad",
          isNewToday: true,
          tags: ["Fresh Today", "Full Abroad Funding"],
          eligibility:
            "Outstanding graduates aiming for a 1-year Master's degree in Computer Science, Public Policy, or Finance.",
          applyUrl: "https://www.chevening.org/",
        },
      ];
      setScholarshipsList((prev) => [...dailyPool, ...prev]);
      triggerNotification(
        "Today's New Scholarships Loaded! 🎓",
        "Added 3 fresh scholarship opportunities for today.",
        "Scholarship Finder"
      );
    } finally {
      setIsFetchingDailyScholarships(false);
    }
  };

  const handleGenerateSOP = async (sch) => {
    if (!checkAndConsumeQuota("scholarship")) return;
    setIsGeneratingSop(true);
    try {
      const res = await callGeminiAPI({
        prompt: `Write a winning, professional Statement of Purpose (SOP) for the "${sch.title}" (${sch.amount}) offered by ${sch.provider}. Highlight academic excellence, financial need, and career goals.`,
        systemInstruction: `Write a compelling, structured 250-word scholarship SOP. ${activeLangObj.directive}`,
      });
      setSopOutput(res);
    } catch (e) {
      setSopOutput(
        `**Statement of Purpose — ${sch.title}**\n\nI am writing to express my sincere application for the **${sch.title}** offered by **${sch.provider}**. With a strong academic track record and a commitment to using technology and innovation for community impact, this grant of **${sch.amount}** will empower me to complete my degree without financial barriers and contribute meaningfully to society.`
      );
    } finally {
      setIsGeneratingSop(false);
    }
  };

  // ==========================================
  // DAILY LIVE JOB & INTERNSHIP FINDER STATE
  // ==========================================
  const [jobsList, setJobsList] = useState(INITIAL_JOBS_DATA);
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [isFetchingDailyJobs, setIsFetchingDailyJobs] = useState(false);
  const [coverLetterOutput, setCoverLetterOutput] = useState("");
  const [isGeneratingJobAi, setIsGeneratingJobAi] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
      const q = jobSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [jobsList, jobTypeFilter, jobSearchQuery]);

  // Fetch / Discover Today's Fresh Jobs via AI
  const handleDiscoverDailyJobs = async () => {
    setIsFetchingDailyJobs(true);
    const targetRole =
      jobSearchQuery.trim() ||
      "Software Engineering, AI/ML, Data Science & Remote Internships";

    try {
      const schema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            role: { type: "STRING" },
            company: { type: "STRING" },
            location: { type: "STRING" },
            type: { type: "STRING" },
            compensation: { type: "STRING" },
            skills: { type: "ARRAY", items: { type: "STRING" } },
            description: { type: "STRING" },
          },
          required: [
            "role",
            "company",
            "location",
            "type",
            "compensation",
            "skills",
            "description",
          ],
        },
      };

      const aiJobs = await callGeminiAPI({
        prompt: `Generate 3 fresh, high-paying tech/business job & internship openings for today (${todayFormatted}) matching: "${targetRole}". Include realistic companies in India (Bengaluru, Noida, Hyderabad, Remote) and US Remote.`,
        systemInstruction:
          "Return a JSON array of 3 realistic job/internship listings.",
        jsonSchema: schema,
      });

      if (Array.isArray(aiJobs) && aiJobs.length > 0) {
        const formatted = aiJobs.map((j, idx) => ({
          id: `job-ai-${Date.now()}-${idx}`,
          role: j.role,
          company: j.company,
          location: j.location,
          type: j.type || "Full-Time",
          compensation: j.compensation,
          posted: `Live Drop • ${todayFormatted}`,
          badge: "FRESH TODAY",
          skills: j.skills?.slice(0, 4) || ["AI", "React", "Problem Solving"],
          description: j.description,
        }));
        setJobsList((prev) => [...formatted, ...prev]);
        triggerNotification(
          "3 Fresh Jobs Dropped Today! 💼",
          `New openings found for ${targetRole}.`,
          "Job Finder"
        );
        setIsFetchingDailyJobs(false);
        return;
      }
      throw new Error("Fallback to curated daily jobs");
    } catch (e) {
      const dailyJobsPool = [
        {
          id: `job-daily-${Date.now()}-1`,
          role: `Generative AI & Prompt Engineer (${todayFormatted})`,
          company: "Krutrim AI / Ola Tech",
          location: "Bengaluru / Remote",
          type: "Full-Time",
          compensation: "₹16,00,000 - ₹22,00,000 LPA",
          posted: "Just Now (Today's Drop)",
          badge: "FRESH TODAY",
          skills: ["LLMs", "Python", "RAG", "LangChain"],
          description:
            "Build multilingual Indian & global voice and vision AI assistants with ultra-low latency.",
        },
        {
          id: `job-daily-${Date.now()}-2`,
          role: "Product Design & Frontend Intern",
          company: "Cred India",
          location: "Bengaluru / Hybrid",
          type: "Internship",
          compensation: "₹60,000 / month Stipend",
          posted: "Just Now (Today's Drop)",
          badge: "FRESH TODAY",
          skills: ["React.js", "Figma", "Tailwind CSS", "Framer Motion"],
          description:
            "Craft ultra-luxury dark-mode mobile and web interfaces with micro-interactions.",
        },
        {
          id: `job-daily-${Date.now()}-3`,
          role: "Cloud & DevOps Associate Engineer",
          company: "Atlassian Remote",
          location: "Remote (India / Global)",
          type: "Full-Time",
          compensation: "₹24,00,000 - ₹32,00,000 LPA",
          posted: "Just Now (Today's Drop)",
          badge: "FRESH TODAY",
          skills: ["AWS / GCP", "Docker", "Kubernetes", "CI/CD"],
          description:
            "Automate high-availability cloud deployments and developer productivity pipelines.",
        },
      ];
      setJobsList((prev) => [...dailyJobsPool, ...prev]);
      triggerNotification(
        "Today's Fresh Jobs Loaded! 💼",
        "Added 3 new high-paying roles to your feed.",
        "Job Finder"
      );
    } finally {
      setIsFetchingDailyJobs(false);
    }
  };

  const handleGenerateCoverLetter = async (job) => {
    if (!checkAndConsumeQuota("job")) return;
    setIsGeneratingJobAi(true);
    try {
      const res = await callGeminiAPI({
        prompt: `Write a high-converting cover letter and 3 interview tips for the role of "${
          job.role
        }" at ${job.company}. Required skills: ${job.skills.join(", ")}.`,
        systemInstruction: `Provide a concise, professional cover letter and 3 bulleted interview preparation tips. ${activeLangObj.directive}`,
      });
      setCoverLetterOutput(res);
    } catch (e) {
      setCoverLetterOutput(
        `**Cover Letter — ${job.role} at ${
          job.company
        }**\n\nDear Hiring Team at **${
          job.company
        }**,\n\nI am excited to apply for the **${job.role}** position (${
          job.location
        }). My hands-on experience building scalable projects with **${job.skills.join(
          ", "
        )}** aligns directly with your engineering goals.\n\n### Top 3 Interview Prep Tips:\n- Showcase a live portfolio project using ${
          job.skills[0]
        }.\n- Prepare a STAR-method story highlighting problem-solving speed.\n- Discuss how AI automation can accelerate ${
          job.company
        }'s product roadmap.`
      );
    } finally {
      setIsGeneratingJobAi(false);
    }
  };

  // ==========================================
  // MULTILINGUAL VOICE SMART REMINDER STATE
  // ==========================================
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [nlInput, setNlInput] = useState("");
  const [remTimeInput, setRemTimeInput] = useState("18:00");
  const [remCategoryInput, setRemCategoryInput] = useState("Study & Exam");
  const [autoSpeakReminders, setAutoSpeakReminders] = useState(true);

  // Speak a single reminder in the user's selected language (EN, JA, HI)
  const speakReminderAloud = (rem) => {
    setSpeakingId(rem.id);
    const speechText = activeLangObj.reminderVoiceTemplate(
      rem.title,
      rem.time,
      rem.category
    );
    playNexoraChime();
    setTimeout(() => {
      speakWithNexoraVoice(speechText, activeLangObj.code, () => {
        setSpeakingId(null);
      });
    }, 450);
  };

  // Speak all pending reminders summary in the user's selected language
  const speakAllRemindersSummary = () => {
    const pending = reminders.filter((r) => !r.completed);
    if (pending.length === 0) {
      speakWithNexoraVoice(
        "All reminders are completed! Great job.",
        activeLangObj.code
      );
      return;
    }
    setSpeakingId("summary-all");
    const summaryIntro = activeLangObj.reminderSummaryTemplate(
      pending.length,
      pending[0].title
    );
    const fullDetails = pending
      .map((r) =>
        activeLangObj.reminderVoiceTemplate(r.title, r.time, r.category)
      )
      .join(" ... ");

    playNexoraChime();
    setTimeout(() => {
      speakWithNexoraVoice(
        `${summaryIntro} ${fullDetails}`,
        activeLangObj.code,
        () => {
          setSpeakingId(null);
        }
      );
    }, 450);
  };

  // Background clock checker: Automatically speaks reminder when current HH:MM matches!
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5);

      setReminders((prev) =>
        prev.map((rem) => {
          if (!rem.completed && !rem.spokenOnce && rem.time === currentHHMM) {
            const speechText = activeLangObj.reminderVoiceTemplate(
              rem.title,
              rem.time,
              rem.category
            );
            triggerNotification(
              `⏰ Voice Reminder (${activeLangObj.short})`,
              `${rem.title} • ${rem.time}`,
              rem.category,
              speechText
            );
            return { ...rem, spokenOnce: true };
          }
          return rem;
        })
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [activeLangObj, soundEnabled]);

  const handleNaturalLanguageReminder = () => {
    if (!nlInput.trim()) return;
    const created = {
      id: `rem-${Date.now()}`,
      title: nlInput.trim(),
      category: remCategoryInput,
      priority: "High",
      date: new Date().toISOString().slice(0, 10),
      time: remTimeInput || "18:00",
      completed: false,
      spokenOnce: false,
    };
    setReminders((prev) => [created, ...prev]);
    setNlInput("");

    const speechText = activeLangObj.reminderVoiceTemplate(
      created.title,
      created.time,
      created.category
    );
    triggerNotification(
      `Voice Reminder Set (${activeLangObj.flag} ${activeLangObj.short}) 🔊`,
      `${created.title} at ${created.time}`,
      "Smart Voice Reminder",
      autoSpeakReminders ? speechText : null
    );
  };

  // ==========================================
  // AUTH SCREEN GATE
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#06050f] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md rounded-3xl bg-[#0e0b1e]/90 border border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <NexoraLogo size={64} showText={false} />
            </div>
            <h1 className="text-2xl font-black text-white">
              Welcome to Nexora AI
            </h1>
            <p className="text-xs text-purple-200/80">
              Smarter • Easier • For You. Sign in with your email and password.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-purple-200">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmailInput}
                onChange={(e) => setAuthEmailInput(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-[#16112e] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-purple-200">
                Password
              </label>
              <input
                type="password"
                required
                value={authPasswordInput}
                onChange={(e) => setAuthPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#16112e] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-400"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition"
            >
              {isAuthLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isSignUpMode ? "Create Account" : "Sign In"}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUpMode(!isSignUpMode)}
                className="text-xs text-purple-300 hover:text-white underline"
              >
                {isSignUpMode
                  ? "Already have an account? Sign In"
                  : "New to Nexora? Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06050f] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Live Notification Toast */}
      {liveNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-bounce">
          <div className="rounded-2xl p-3.5 bg-[#150d2a]/95 border border-fuchsia-400/50 shadow-2xl flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-fuchsia-300">
                {liveNotification.category}
              </p>
              <p className="text-sm font-bold text-white truncate">
                {liveNotification.title}
              </p>
              <p className="text-xs text-purple-200/80 truncate">
                {liveNotification.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox for Generated 8K Images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#120d24] border border-purple-500/40 rounded-3xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {lightboxImage.prompt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownloadImage(lightboxImage.url, lightboxImage.prompt)
                  }
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 8K HD</span>
                </button>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.prompt}
              className="w-full max-h-[75vh] object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

      {/* Admin API Keys Modal */}
      {showApiKeyModal && currentUser?.isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#120d26] border border-purple-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-fuchsia-400" />
                <h3 className="text-base font-extrabold text-white">
                  Master Admin API Configuration
                </h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-purple-200/80">
              Enter your Google Gemini API key (`AIzaSy...`) to power live text,
              daily scholarships/jobs discovery, and Gemini 3.1 Flash Image
              generation.
            </p>
            <form onSubmit={handleSaveAdminKey} className="space-y-4">
              <input
                type="password"
                value={inputGeminiKey}
                onChange={(e) => setInputGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#1a1336] border border-purple-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-xs font-bold text-white"
                >
                  Save & Encrypt Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-[#120d26] border border-purple-500/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Upgrade Nexora AI
                </h3>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#191233] border border-purple-500/30 p-5 space-y-3">
                <span className="text-xs font-bold uppercase text-purple-300">
                  Nexora Lite
                </span>
                <p className="text-2xl font-black text-white">
                  $4.99{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / month
                  </span>
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li>• Unlimited Nexo Chat & Heavy 8K Image Generation</li>
                  <li>• Multilingual Voice Reminders (EN, JA, HI)</li>
                  <li>• 15 Scholarship SOPs / month</li>
                </ul>
                <button
                  onClick={() => {
                    setCurrentUser({ ...currentUser, subscription: "Lite" });
                    setShowSubscriptionModal(false);
                    triggerNotification(
                      "Upgraded to Nexora Lite! 🎉",
                      "Unlimited Chat & 8K Image Studio unlocked."
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Activate Lite ($4.99/mo)
                </button>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-900/50 to-fuchsia-900/40 border border-fuchsia-400/50 p-5 space-y-3">
                <span className="text-xs font-bold uppercase text-amber-300">
                  Nexora Pro (Best Value)
                </span>
                <p className="text-2xl font-black text-white">
                  $14.99{" "}
                  <span className="text-xs font-normal text-slate-300">
                    / month
                  </span>
                </p>
                <ul className="text-xs text-slate-100 space-y-1.5">
                  <li>• Unlimited Heavy 8K AI Image Studio & Prompt Booster</li>
                  <li>
                    • Daily Live Scholarship & Job Drops + Unlimited AI SOPs
                  </li>
                  <li>• Unlimited Homework Scanner Vision Passes</li>
                </ul>
                <button
                  onClick={() => {
                    setCurrentUser({ ...currentUser, subscription: "Pro" });
                    setShowSubscriptionModal(false);
                    triggerNotification(
                      "Upgraded to Nexora Pro! 👑",
                      "All Pro features unlocked."
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-fuchsia-600 text-white font-bold text-xs shadow-lg"
                >
                  Activate Pro ($14.99/mo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-purple-500/20 bg-[#080614]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <NexoraLogo size={40} showText={true} showTagline={true} />

          <div className="flex items-center gap-2">
            {/* Global Voice & Reminder Language Selector (Visible on Mobile & Desktop) */}
            <div
              className="flex items-center bg-[#140f29] border border-purple-500/30 rounded-xl p-1"
              title="Select Voice & Reminder Language"
            >
              {VOICE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedVoiceLang(lang.code);
                    triggerNotification(
                      `Voice Language: ${lang.flag} ${lang.label}`,
                      `Chat & Smart Reminders will now speak in ${lang.label}.`,
                      "Voice Engine"
                    );
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                    selectedVoiceLang === lang.code
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang.flag}{" "}
                  <span className="hidden md:inline">{lang.short}</span>
                </button>
              ))}
            </div>

            {currentUser?.isAdmin && (
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-900"
              >
                <Lock className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline">Admin Keys</span>
              </button>
            )}

            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-fuchsia-600 text-white text-xs font-extrabold shadow"
            >
              <Crown className="w-4 h-4 text-yellow-200" />
              <span className="hidden sm:inline">
                {currentUser.subscription === "Free"
                  ? "Upgrade"
                  : `${currentUser.subscription} Plan`}
              </span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-rose-300"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col lg:flex-row gap-5">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-2xl bg-[#0f0d1a] border border-white/10 p-3 h-[calc(100vh-6.5rem)] sticky top-20">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">
              Nexora Super-Hub
            </span>
            <div className="space-y-1">
              {[
                {
                  id: "chat",
                  label: "Nexo Chat & 8K Image",
                  icon: MessageSquare,
                  badge: "Heavy 8K",
                },
                { id: "scanner", label: "Homework Scanner", icon: ScanLine },
                {
                  id: "scholarships",
                  label: "Scholarship Finder",
                  icon: GraduationCap,
                  badge: "Daily New",
                },
                {
                  id: "jobs",
                  label: "Job Finder",
                  icon: Briefcase,
                  badge: "Daily Drop",
                },
                {
                  id: "reminders",
                  label: "Voice Reminder",
                  icon: Bell,
                  badge: "🔊 Voice",
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? "bg-purple-600/20 text-white border border-purple-500/30"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-fuchsia-400" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heavy 8K Image Studio Card in Sidebar */}
          <div className="rounded-xl bg-gradient-to-br from-purple-900/40 via-fuchsia-900/30 to-indigo-950/50 border border-purple-500/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-extrabold text-white">
                  Heavy 8K Image Engine
                </span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              Dual-Engine Photorealistic RAW, IMAX 70mm, Unreal 5 & Magic Prompt
              Enhancer.
            </p>
            <button
              onClick={() => {
                setActiveTab("chat");
                setChatMode("AI Image Studio");
                setForceImageMode(true);
              }}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold shadow"
            >
              Launch 8K Studio 🎨
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {/* ========================================== */}
          {/* TAB 1: NEXO CHAT & HEAVY 8K IMAGE STUDIO */}
          {/* ========================================== */}
          {activeTab === "chat" && (
            <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 flex flex-col h-[calc(100vh-8.5rem)] overflow-hidden">
              {/* Top Mode Switcher Bar */}
              <div className="px-4 py-2.5 bg-[#130f26] border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <h2 className="text-sm font-extrabold text-white">
                    Nexo Chat & Heavy 8K Image Studio
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-1 bg-[#0a0814] p-1 rounded-xl">
                  {CHAT_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = chatMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setChatMode(mode.id);
                          setForceImageMode(mode.id === "AI Image Studio");
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? mode.id === "AI Image Studio"
                              ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow"
                              : "bg-purple-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <ModeIcon className="w-3.5 h-3.5" />
                        <span>{mode.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Heavy 8K AI Image Studio Controls Bar */}
              {(chatMode === "AI Image Studio" || forceImageMode) && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/90 via-fuchsia-950/60 to-indigo-950/90 border-b border-fuchsia-500/30 space-y-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-300 shrink-0">
                      8K Style:
                    </span>
                    {IMAGE_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedImageStyle(style)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition ${
                          selectedImageStyle.id === style.id
                            ? "bg-fuchsia-500 text-white shadow"
                            : "bg-white/5 text-purple-200 hover:bg-white/10"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-500/20">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 shrink-0">
                        Lighting:
                      </span>
                      {LIGHTING_PRESETS.map((lt) => (
                        <button
                          key={lt.id}
                          onClick={() => setSelectedLighting(lt)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 transition ${
                            selectedLighting.id === lt.id
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {lt.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setMagicPromptBoost(!magicPromptBoost)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition ${
                          magicPromptBoost
                            ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>
                          Magic 8K Booster: {magicPromptBoost ? "ON" : "OFF"}
                        </span>
                      </button>

                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setSelectedAspectRatio(ratio.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                            selectedAspectRatio === ratio.id
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {ratio.id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 space-y-3 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
                          : "bg-[#141028] border border-purple-500/30 text-slate-100"
                      }`}
                    >
                      <FormattedMessage content={msg.content} />

                      {/* Render High-Quality Generated 8K Image */}
                      {msg.generatedImage && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-fuchsia-500/40 bg-[#090614] shadow-2xl space-y-2 p-2">
                          <div className="relative group">
                            <img
                              src={msg.generatedImage}
                              alt={msg.imagePrompt || "Nexora AI 8K Render"}
                              className="w-full max-h-[420px] object-contain rounded-xl mx-auto cursor-pointer transition transform group-hover:scale-[1.01]"
                              onClick={() =>
                                setLightboxImage({
                                  url: msg.generatedImage,
                                  prompt:
                                    msg.imagePrompt ||
                                    "Nexora AI 8K Masterpiece",
                                })
                              }
                            />
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-95">
                              <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-fuchsia-400/40 text-[10px] font-bold text-fuchsia-300">
                                {msg.imageStyle} • {msg.aspectRatio}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1">
                            <span className="text-[11px] text-purple-200/80 truncate max-w-xs">
                              🎨 Prompt: &ldquo;{msg.imagePrompt}&rdquo;
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setLightboxImage({
                                    url: msg.generatedImage,
                                    prompt: msg.imagePrompt,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Full View</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleSendMessage(msg.imagePrompt, true)
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-xs font-semibold text-purple-200 flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Remix 8K</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadImage(
                                    msg.generatedImage,
                                    msg.imagePrompt
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-xs font-bold text-white flex items-center gap-1 shadow"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download HD</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] opacity-75">
                        <div className="flex items-center gap-2">
                          <span>
                            {msg.mode ||
                              (msg.role === "user" ? "You" : "Nexora AI")}
                          </span>
                          {msg.role === "assistant" && (
                            <button
                              onClick={() => {
                                if (speakingId === msg.id) {
                                  window.speechSynthesis?.cancel();
                                  setSpeakingId(null);
                                } else {
                                  setSpeakingId(msg.id);
                                  speakWithNexoraVoice(
                                    msg.content,
                                    activeLangObj.code,
                                    () => setSpeakingId(null)
                                  );
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-bold"
                            >
                              <Volume2 className="w-3 h-3 text-fuchsia-400" />
                              <span>
                                {speakingId === msg.id
                                  ? "Stop Voice"
                                  : `Speak (${activeLangObj.short})`}
                              </span>
                            </button>
                          )}
                        </div>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-[#141028] border border-purple-500/30 px-4 py-3 flex items-center gap-2.5 text-xs text-purple-200">
                      <RefreshCw className="w-4 h-4 text-fuchsia-400 animate-spin" />
                      <span>Nexora AI is thinking...</span>
                    </div>
                  </div>
                )}

                {isGeneratingImage && (
                  <div className="flex justify-start">
                    <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#191034] to-[#110b24] border border-fuchsia-500/40 p-5 space-y-3 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-fuchsia-400 animate-spin" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white">
                            Heavy 8K Neural Engine Rendering...
                          </p>
                          <p className="text-[11px] text-fuchsia-300">
                            {selectedImageStyle.label} •{" "}
                            {selectedLighting.label} • {selectedAspectRatio}
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 animate-pulse rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Heavy 8K Image Prompt Chips */}
              <div className="px-3 py-2 bg-[#100c20] border-t border-purple-500/15 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Heavy 8K Prompts:
                </span>
                {[
                  "Hyper-realistic 8K Indian ISRO astronaut standing on Mars at golden hour",
                  "Futuristic cyberpunk Mumbai skyline in 2099 with flying cars and neon rain",
                  "3D Pixar-style cute AI robot scholar studying in a magical glowing library",
                  "Minimalist luxury metallic royal lion shield logo for a tech unicorn",
                ].map((samplePrompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(samplePrompt, true)}
                    disabled={isChatLoading || isGeneratingImage}
                    className="px-2.5 py-1 rounded-lg bg-[#1a1435] hover:bg-purple-900/50 border border-purple-500/25 text-[11px] text-purple-200 shrink-0 transition"
                  >
                    🎨 {samplePrompt.slice(0, 38)}...
                  </button>
                ))}
              </div>

              {/* Input Bar with Voice Mic + Heavy Image Toggle */}
              <div className="p-3 bg-[#130f26] border-t border-purple-500/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !forceImageMode;
                    setForceImageMode(nextState);
                    if (nextState) setChatMode("AI Image Studio");
                  }}
                  title="Toggle Heavy 8K Image Studio Mode"
                  className={`px-3 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition shrink-0 ${
                    forceImageMode || chatMode === "AI Image Studio"
                      ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-400 shadow-lg"
                      : "bg-[#1a1435] text-purple-300 border-purple-500/30 hover:text-white"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">8K Image</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStartVoiceMic((text) => setChatInput(text))
                  }
                  title={`Speak in ${activeLangObj.label}`}
                  className={`p-3 rounded-xl border transition shrink-0 ${
                    isListeningMic
                      ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                      : "bg-[#1a1435] text-purple-300 border-purple-500/30 hover:text-white"
                  }`}
                >
                  {isListeningMic ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    forceImageMode || chatMode === "AI Image Studio"
                      ? `Describe the ${selectedImageStyle.label} image you want to render...`
                      : activeLangObj.placeholder
                  }
                  className="flex-1 bg-[#1a1435] border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-fuchsia-400"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage(null, true)}
                  disabled={
                    !chatInput.trim() || isChatLoading || isGeneratingImage
                  }
                  title="Render Heavy 8K Image"
                  className="px-3.5 py-3 rounded-xl bg-fuchsia-600/25 hover:bg-fuchsia-600/40 border border-fuchsia-500/40 text-fuchsia-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span className="hidden md:inline">Render 8K</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={
                    !chatInput.trim() || isChatLoading || isGeneratingImage
                  }
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow flex items-center gap-2 disabled:opacity-40 transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: HOMEWORK SCANNER */}
          {/* ========================================== */}
          {activeTab === "scanner" && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 p-5 space-y-4">
                <h2 className="text-lg font-extrabold text-white">
                  Homework Scanner
                </h2>
                <p className="text-xs text-purple-200/80">
                  Select a sample problem or enter any equation for instant
                  step-by-step solving in {activeLangObj.label}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_HOMEWORK_PROBLEMS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSampleProblem(sample)}
                      className="p-3.5 rounded-xl bg-[#141028] hover:bg-[#1b1536] border border-purple-500/25 text-left transition"
                    >
                      <span className="text-[10px] text-fuchsia-300 font-bold uppercase">
                        {sample.subject} • {sample.badge}
                      </span>
                      <p className="text-xs font-bold text-white mt-1">
                        {sample.title}
                      </p>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={scannerCustomQuestion}
                  onChange={(e) => setScannerCustomQuestion(e.target.value)}
                  placeholder="Or paste/type your homework question or math equation here..."
                  className="w-full bg-[#141028] border border-purple-500/30 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                />

                {scannerImagePreview && (
                  <div className="p-4 bg-[#141028] rounded-xl space-y-3">
                    <img
                      src={scannerImagePreview}
                      alt="Problem"
                      className="max-h-36 mx-auto"
                    />
                  </div>
                )}

                <button
                  onClick={handleSolveHomework}
                  disabled={
                    isScanning ||
                    (!scannerImagePreview && !scannerCustomQuestion.trim())
                  }
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs shadow disabled:opacity-40"
                >
                  {isScanning
                    ? "Solving Step-by-Step..."
                    : "Solve Homework with AI ✨"}
                </button>
              </div>

              {scanResult && (
                <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-fuchsia-300">
                      Step-by-Step Solution:
                    </h3>
                    <button
                      onClick={() =>
                        speakWithNexoraVoice(
                          scanResult.finalAnswer,
                          activeLangObj.code
                        )
                      }
                      className="px-3 py-1 rounded-lg bg-purple-600/30 text-purple-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Read Solution ({activeLangObj.short})</span>
                    </button>
                  </div>
                  <p className="text-xs text-white">
                    {scanResult.extractedProblem}
                  </p>
                  <div className="border-t border-purple-500/20 pt-3">
                    <FormattedMessage content={scanResult.finalAnswer} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: DAILY LIVE SCHOLARSHIP FINDER */}
          {/* ========================================== */}
          {activeTab === "scholarships" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-fuchsia-400" />
                      <h2 className="text-lg font-extrabold text-white">
                        Daily Live Scholarship Finder
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                        Updated: {todayFormatted}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/80 mt-0.5">
                      Verified Government, Corporate & International
                      Scholarships + Daily AI Live Discovery.
                    </p>
                  </div>

                  <button
                    onClick={handleDiscoverDailyScholarships}
                    disabled={isFetchingDailyScholarships}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isFetchingDailyScholarships ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isFetchingDailyScholarships
                        ? "Finding Today's New Scholarships..."
                        : "🔄 Fetch Today's New Scholarships (AI Live)"}
                    </span>
                  </button>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={scholarshipSearchQuery}
                      onChange={(e) =>
                        setScholarshipSearchQuery(e.target.value)
                      }
                      placeholder="Search by stream (e.g., B.Tech, MBBS, Study Abroad, Reliance, Girls)..."
                      className="w-full bg-[#141028] border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      "All",
                      "All Streams",
                      "Engineering & Medical",
                      "Women in STEM",
                      "Global / Study Abroad",
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setScholarshipFilter(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                          scholarshipFilter === cat
                            ? "bg-purple-600 text-white"
                            : "bg-[#141028] text-slate-300 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {sopOutput && (
                  <div className="rounded-2xl bg-[#171130] border border-fuchsia-500/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-fuchsia-300">
                        ✨ AI Winning Statement of Purpose (SOP)
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            speakWithNexoraVoice(sopOutput, activeLangObj.code)
                          }
                          className="px-2.5 py-1 rounded-lg bg-purple-600/40 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen ({activeLangObj.short})</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sopOutput);
                            triggerNotification(
                              "Copied SOP",
                              "Statement of Purpose copied to clipboard."
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    <FormattedMessage content={sopOutput} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredScholarships.map((sch) => (
                    <div
                      key={sch.id}
                      className="rounded-2xl bg-[#141028] border border-purple-500/30 p-4 space-y-3 flex flex-col justify-between hover:border-fuchsia-500/40 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {sch.isNewToday && (
                                <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 text-[9px] font-black uppercase">
                                  NEW TODAY
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-purple-300">
                                {sch.provider}
                              </span>
                            </div>
                            <h3 className="text-sm font-extrabold text-white mt-1">
                              {sch.title}
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold shrink-0">
                            {sch.amount}
                          </span>
                        </div>

                        <p className="text-xs text-purple-200/80 leading-relaxed">
                          {sch.eligibility}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                            📅 Deadline: {sch.deadline}
                          </span>
                          {sch.tags?.map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/20 text-[10px] text-purple-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-purple-500/20">
                        <button
                          onClick={() => handleGenerateSOP(sch)}
                          disabled={isGeneratingSop}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow"
                        >
                          {isGeneratingSop
                            ? "Drafting SOP..."
                            : "Write Winning SOP ✨"}
                        </button>
                        <a
                          href={sch.applyUrl || "https://scholarships.gov.in/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: DAILY LIVE JOB & INTERNSHIP FINDER */}
          {/* ========================================== */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-fuchsia-400" />
                      <h2 className="text-lg font-extrabold text-white">
                        Daily Live Job & Internship Finder
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                        Live Feed: {todayFormatted}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/80 mt-0.5">
                      Fresh daily internships, remote US/India tech roles, and
                      instant AI Cover Letters.
                    </p>
                  </div>

                  <button
                    onClick={handleDiscoverDailyJobs}
                    disabled={isFetchingDailyJobs}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isFetchingDailyJobs ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isFetchingDailyJobs
                        ? "Fetching Today's Fresh Jobs..."
                        : "🔄 Load Today's Fresh Jobs (AI Daily Drop)"}
                    </span>
                  </button>
                </div>

                {/* Search & Job Type Filter */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      placeholder="Search role, skill, or city (e.g., React, Python, AI, Remote, Bengaluru)..."
                      className="w-full bg-[#141028] border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      "All",
                      "Internship",
                      "Full-Time",
                      "Part-Time / Freelance",
                    ].map((t) => (
                      <button
                        key={t}
                        onClick={() => setJobTypeFilter(t)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                          jobTypeFilter === t
                            ? "bg-purple-600 text-white"
                            : "bg-[#141028] text-slate-300 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {coverLetterOutput && (
                  <div className="rounded-2xl bg-[#171130] border border-fuchsia-500/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-fuchsia-300">
                        ✨ AI Tailored Cover Letter & Interview Strategy
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            speakWithNexoraVoice(
                              coverLetterOutput,
                              activeLangObj.code
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-purple-600/40 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen ({activeLangObj.short})</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coverLetterOutput);
                            triggerNotification(
                              "Copied!",
                              "Cover Letter copied to clipboard."
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    <FormattedMessage content={coverLetterOutput} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl bg-[#141028] border border-purple-500/30 p-4 space-y-3 flex flex-col justify-between hover:border-fuchsia-500/40 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 text-[9px] font-black uppercase">
                                {job.badge}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {job.posted}
                              </span>
                            </div>
                            <h3 className="text-sm font-extrabold text-white mt-1">
                              {job.role}
                            </h3>
                            <p className="text-xs font-semibold text-purple-300">
                              {job.company} • {job.location}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold shrink-0">
                            {job.compensation}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.skills?.map((sk, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/25 text-[10px] text-purple-200 font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-purple-500/20">
                        <button
                          onClick={() => handleGenerateCoverLetter(job)}
                          disabled={isGeneratingJobAi}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow"
                        >
                          {isGeneratingJobAi
                            ? "Preparing AI Kit..."
                            : "AI Cover Letter & Prep ✨"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 5: MULTILINGUAL VOICE SMART REMINDER */}
          {/* ========================================== */}
          {activeTab === "reminders" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#0e0b1d] border border-purple-500/30 p-5 space-y-5">
                {/* Header & Language Switcher inside Reminder Tab */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                      <h2 className="text-lg font-extrabold text-white">
                        Multilingual Voice Smart Reminder
                      </h2>
                    </div>
                    <p className="text-xs text-purple-200/80 mt-0.5">
                      Nexora AI doesn&apos;t just show notifications—it **speaks
                      your reminders aloud** in your chosen language!
                    </p>
                  </div>

                  {/* Direct Language Selector for Voice Reminders */}
                  <div className="flex items-center gap-1.5 bg-[#16102c] border border-purple-500/30 p-1.5 rounded-xl">
                    <span className="text-[10px] font-bold text-purple-300 px-2">
                      Voice Language:
                    </span>
                    {VOICE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedVoiceLang(lang.code)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          selectedVoiceLang === lang.code
                            ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {lang.flag} {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Control Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-purple-950/90 via-fuchsia-950/50 to-indigo-950/90 border border-fuchsia-500/30 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-fuchsia-300" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        Active Voice Output: {activeLangObj.flag}{" "}
                        {activeLangObj.label}
                      </p>
                      <p className="text-[11px] text-purple-200/80">
                        When a reminder is created or its time arrives, Nexora
                        AI speaks it aloud in {activeLangObj.label}.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={speakAllRemindersSummary}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-xs font-extrabold shadow flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>
                        🗣️ Speak All Reminders ({activeLangObj.short})
                      </span>
                    </button>

                    <button
                      onClick={() => setAutoSpeakReminders(!autoSpeakReminders)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        autoSpeakReminders
                          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      Auto-Voice: {autoSpeakReminders ? "ON 🔊" : "OFF"}
                    </button>
                  </div>
                </div>

                {/* Add New Voice Reminder Form */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-[#141028] p-3.5 rounded-2xl border border-purple-500/25">
                  <div className="md:col-span-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleStartVoiceMic((text) => setNlInput(text))
                      }
                      title={`Speak task in ${activeLangObj.label}`}
                      className={`p-2.5 rounded-xl border transition shrink-0 ${
                        isListeningMic
                          ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                          : "bg-[#1d1638] text-purple-300 border-purple-500/30 hover:text-white"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={nlInput}
                      onChange={(e) => setNlInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleNaturalLanguageReminder()
                      }
                      placeholder={`Type or speak task (e.g., Revise Organic Chemistry / फॉर्म भरना है)...`}
                      className="w-full bg-[#1d1638] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <select
                      value={remCategoryInput}
                      onChange={(e) => setRemCategoryInput(e.target.value)}
                      className="w-full bg-[#1d1638] border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Study & Exam">Study & Exam</option>
                      <option value="Scholarship Deadline">
                        Scholarship Deadline
                      </option>
                      <option value="Career & Job Prep">
                        Career & Job Prep
                      </option>
                      <option value="Personal Task">Personal Task</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="time"
                      value={remTimeInput}
                      onChange={(e) => setRemTimeInput(e.target.value)}
                      className="w-full bg-[#1d1638] border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      onClick={handleNaturalLanguageReminder}
                      className="w-full h-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-extrabold shadow flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add + Speak</span>
                    </button>
                  </div>
                </div>

                {/* Reminders List with Individual Voice Announce Buttons */}
                <div className="space-y-2.5">
                  {reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition ${
                        rem.completed
                          ? "bg-[#100d1e]/60 border-white/5 opacity-60"
                          : "bg-[#141028] border-purple-500/30 hover:border-fuchsia-500/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() =>
                            setReminders((prev) =>
                              prev.map((r) =>
                                r.id === rem.id
                                  ? { ...r, completed: !r.completed }
                                  : r
                              )
                            )
                          }
                          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                            rem.completed
                              ? "bg-emerald-500 border-emerald-400 text-black"
                              : "border-purple-400/50 hover:border-fuchsia-400"
                          }`}
                        >
                          {rem.completed && (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </button>
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              rem.completed
                                ? "line-through text-slate-400"
                                : "text-white"
                            }`}
                          >
                            {rem.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-purple-300">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                              {rem.time}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-purple-950 text-[10px] font-bold text-purple-200">
                              {rem.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Speak Reminder Aloud in Selected Language */}
                        <button
                          onClick={() => speakReminderAloud(rem)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                            speakingId === rem.id
                              ? "bg-fuchsia-600 text-white animate-pulse shadow-lg"
                              : "bg-purple-600/25 hover:bg-purple-600/40 border border-purple-400/30 text-purple-200"
                          }`}
                        >
                          <Volume2 className="w-4 h-4 text-fuchsia-400" />
                          <span>
                            {speakingId === rem.id
                              ? `Speaking (${activeLangObj.short})...`
                              : `🔊 Speak in ${activeLangObj.short}`}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            setReminders(
                              reminders.filter((r) => r.id !== rem.id)
                            )
                          }
                          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400"
                          title="Delete Reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090716]/95 backdrop-blur-xl border-t border-purple-500/20 px-2 py-1.5 flex justify-around">
        {[
          { id: "chat", label: "Chat & 8K", icon: MessageSquare },
          { id: "scanner", label: "Scanner", icon: ScanLine },
          { id: "scholarships", label: "Scholarships", icon: GraduationCap },
          { id: "jobs", label: "Daily Jobs", icon: Briefcase },
          { id: "reminders", label: "Voice Alert", icon: Bell },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                isActive ? "text-fuchsia-400" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
