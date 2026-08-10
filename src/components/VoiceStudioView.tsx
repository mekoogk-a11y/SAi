import React, { useState } from 'react';
import { 
  Play, 
  Pause,
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  Loader2, 
  RefreshCw, 
  Mic2, 
  Copy, 
  Heart, 
  Check, 
  Plus, 
  History,
  Sliders,
  Radio,
  UserCheck,
  Zap,
  Info,
  HelpCircle,
  FileCheck,
  Share2,
  Users,
  Disc,
  Layers,
  Activity,
  Flame,
  Music,
  Settings,
  ListMusic,
  SkipForward,
  SkipBack,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Timer
} from 'lucide-react';

import { SUDANESE_VOICE_PERSONAS, VoicePersona, SpeechQualityEngine } from '../lib/voicePersonas';
import { LearningSystemManager } from '../lib/learningSystem';
import { STUDIO_FX_PRESETS, StudioFxConfig, applyStudioFxToAudioBlob } from '../lib/studioAudioProcessor';

export interface PlaylistItem {
  id: string;
  title: string;
  text: string;
  personaId: string;
  personaName: string;
  audioUrl?: string | null;
  isGenerating?: boolean;
  pauseAfterSec?: number;
}

interface VoiceStudioViewProps {
  PRESETS: any[];
  VOICES: any[];
  TONES: any[];
  text: string;
  setText: (t: string) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  selectedTone: string;
  setSelectedTone: (t: string) => void;
  isGenerating: boolean;
  setIsGenerating: (g: boolean) => void;
  isOptimizing: boolean;
  setIsOptimizing: (o: boolean) => void;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  voiceHistory: any[];
  setVoiceHistory: React.Dispatch<React.SetStateAction<any[]>>;
  isVoiceFallbackActive: boolean;
  setIsVoiceFallbackActive: (val: boolean) => void;
  savedAdVoices?: any[];
  handleSaveAdVoice?: (item: any) => void;
  handleEditAdVoiceInStudio?: (item: any) => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  PRESETS,
  VOICES,
  TONES,
  text,
  setText,
  selectedVoice,
  setSelectedVoice,
  selectedTone,
  setSelectedTone,
  isGenerating,
  setIsGenerating,
  isOptimizing,
  setIsOptimizing,
  audioUrl,
  setAudioUrl,
  isPlaying,
  setIsPlaying,
  audioRef,
  showToast,
  voiceHistory,
  setVoiceHistory,
  isVoiceFallbackActive,
  setIsVoiceFallbackActive,
  savedAdVoices = [],
  handleSaveAdVoice,
  handleEditAdVoiceInStudio
}) => {
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(SUDANESE_VOICE_PERSONAS[0]);
  const [favoriteVoices, setFavoriteVoices] = useState<string[]>(['sudan-abdallah', 'sudan-mudather', 'sudan-badr']);
  const [activeTab, setActiveTab] = useState<'studio' | 'playlist' | 'compare' | 'history'>('studio');
  const [selectedSaveCat, setSelectedSaveCat] = useState<string>('عروض وتخفيضات');
  const [voiceCategoryFilter, setVoiceCategoryFilter] = useState<'all' | 'ad' | 'radio' | 'doc' | 'female'>('all');

  // Playlist (قائمة التشغيل المتتابعة) State
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    {
      id: 'pl-1',
      title: 'المقدمة والافتتاحية الإعلانية',
      text: 'يا أخوانا ويا أهلي في كل مكان! حبابكم ألف في العرض الإعلاني الأقوى والأضخم لهذا الموسم!',
      personaId: 'sudan-abdallah',
      personaName: 'عبد الله السوار - إذاعي حماسي',
      pauseAfterSec: 1
    },
    {
      id: 'pl-2',
      title: 'تفاصيل العرض والتخفيضات',
      text: 'تخفيضات تصل لـ 50% على جميع المنتجات والخدمات! الجودة مضمونة والتوصيل لحد باب بيتك في أسرع وقت.',
      personaId: 'sudan-muna',
      personaName: 'منى عوض - إعلاني حيوي',
      pauseAfterSec: 1
    },
    {
      id: 'pl-3',
      title: 'الخاتمة ورقم التواصل',
      text: 'ما تضيع الفرصة يا حبيب! اطلب هسة واستفيد من الخصم، اتصل بنا أو زُور موقعنا الإلكتروني، والخير باسط بإذن الله!',
      personaId: 'sudan-mudather',
      personaName: 'مدثر الطيب - وثائقي فخم',
      pauseAfterSec: 0
    }
  ]);

  const [isPlayingPlaylist, setIsPlayingPlaylist] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(-1);
  const [isGeneratingAllPlaylist, setIsGeneratingAllPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistText, setNewPlaylistText] = useState('');
  const [newPlaylistPersonaId, setNewPlaylistPersonaId] = useState('sudan-abdallah');

  const isPlayingPlaylistRef = React.useRef(false);
  const playlistAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // Generate Audio for single Playlist Item
  const generatePlaylistItemAudio = async (itemId: string): Promise<string | null> => {
    const item = playlist.find(p => p.id === itemId);
    if (!item) return null;

    setPlaylist(prev => prev.map(p => p.id === itemId ? { ...p, isGenerating: true } : p));

    const persona = SUDANESE_VOICE_PERSONAS.find(p => p.id === item.personaId) || selectedPersona;
    const optimized = SpeechQualityEngine.optimizeSpeechText(item.text, persona.id);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: optimized,
          voiceName: persona.geminiVoiceAlias,
          tone: persona.tone
        })
      });

      if (res.ok) {
        const rawBlob = await res.blob();
        let processedBlob = rawBlob;

        if (isFxEnabled && personaFxMap[persona.id] !== false) {
          try {
            const presetConfig = STUDIO_FX_PRESETS[activeFxPreset]?.config || STUDIO_FX_PRESETS['radio_khartoum'].config;
            processedBlob = await applyStudioFxToAudioBlob(rawBlob, {
              ...presetConfig,
              enabled: true,
              reverbLevel: customReverb,
              delayFeedback: customDelay,
              bassBoost: customBass,
              presenceBoost: customPresence
            });
          } catch (e) {
            console.warn("Playlist FX application error:", e);
          }
        }

        const url = URL.createObjectURL(processedBlob);
        setPlaylist(prev => prev.map(p => p.id === itemId ? { ...p, audioUrl: url, isGenerating: false } : p));
        return url;
      }
    } catch (err) {
      console.warn("Playlist audio generation failed:", err);
    } finally {
      setPlaylist(prev => prev.map(p => p.id === itemId ? { ...p, isGenerating: false } : p));
    }
    return null;
  };

  // Generate All Playlist Audio
  const handleGenerateAllPlaylist = async () => {
    if (playlist.length === 0) return;
    setIsGeneratingAllPlaylist(true);
    showToast("جاري توليد المقاطع الصوتية لقائمة التشغيل بالكامل... 🎙️");

    for (const item of playlist) {
      if (!item.audioUrl) {
        await generatePlaylistItemAudio(item.id);
      }
    }

    setIsGeneratingAllPlaylist(false);
    showToast("تم جهوزية جميع المقاطع الصوتية في قائمة التشغيل! 🎵");
  };

  // Play Playlist Sequentially
  const handlePlaySequentialPlaylist = async (startIndex = 0) => {
    if (playlist.length === 0) {
      showToast("قائمة التشغيل فارغة، يرجى إضافة نصوص أولاً.", "error");
      return;
    }

    isPlayingPlaylistRef.current = true;
    setIsPlayingPlaylist(true);

    for (let i = startIndex; i < playlist.length; i++) {
      if (!isPlayingPlaylistRef.current) break;

      setCurrentPlaylistIndex(i);
      const item = playlist[i];

      let url = item.audioUrl;
      if (!url) {
        url = await generatePlaylistItemAudio(item.id);
      }

      if (!url) {
        showToast(`تعذر توليد صوت للإعلان: ${item.title}`, "error");
        continue;
      }

      if (!isPlayingPlaylistRef.current) break;

      await new Promise<void>((resolve) => {
        if (!playlistAudioRef.current) {
          playlistAudioRef.current = new Audio(url!);
        } else {
          playlistAudioRef.current.src = url!;
        }

        const audio = playlistAudioRef.current;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();

        audio.play().catch((err) => {
          console.warn("Playback error:", err);
          resolve();
        });
      });

      if (!isPlayingPlaylistRef.current) break;

      if (item.pauseAfterSec && item.pauseAfterSec > 0 && i < playlist.length - 1) {
        await new Promise(r => setTimeout(r, item.pauseAfterSec! * 1000));
      }
    }

    isPlayingPlaylistRef.current = false;
    setIsPlayingPlaylist(false);
    setCurrentPlaylistIndex(-1);
  };

  // Stop Playlist Playback
  const handleStopPlaylist = () => {
    isPlayingPlaylistRef.current = false;
    setIsPlayingPlaylist(false);
    setCurrentPlaylistIndex(-1);
    if (playlistAudioRef.current) {
      playlistAudioRef.current.pause();
      playlistAudioRef.current.currentTime = 0;
    }
    showToast("تم إيقاف تشغيل قائمة الإعلانات ⏸️");
  };

  // Move Playlist Item Up/Down
  const movePlaylistItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= playlist.length) return;

    const updated = [...playlist];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPlaylist(updated);
    showToast("تم إعادة ترتيب عناصر قائمة التشغيل 🔀");
  };

  // Remove Item
  const removePlaylistItem = (id: string) => {
    setPlaylist(playlist.filter(p => p.id !== id));
    showToast("تم مسح الفقرة الإعلانية من قائمة التشغيل");
  };

  // Add Item to Playlist
  const handleAddPlaylistItem = () => {
    if (!newPlaylistText.trim()) {
      showToast("يرجى كتابة نص الإعلان أولاً الإضافة لقائمة التشغيل", "error");
      return;
    }

    const persona = SUDANESE_VOICE_PERSONAS.find(p => p.id === newPlaylistPersonaId) || selectedPersona;
    const newItem: PlaylistItem = {
      id: `pl-${Date.now()}`,
      title: newPlaylistTitle.trim() || `فقرة إعلانية ${playlist.length + 1}`,
      text: newPlaylistText,
      personaId: persona.id,
      personaName: persona.name,
      pauseAfterSec: 1
    };

    setPlaylist([...playlist, newItem]);
    setNewPlaylistTitle('');
    setNewPlaylistText('');
    showToast("تمت إضافة الفقرة الإعلانية لقائمة التشغيل بنجاح! 🎵");
  };
  // Sample audio preview playing state
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);

  // Side-by-side comparison state
  const [compareVoiceA, setCompareVoiceA] = useState<string>('sudan-abdallah');
  const [compareVoiceB, setCompareVoiceB] = useState<string>('sudan-mudather');
  const [compareAudioA, setCompareAudioA] = useState<string | null>(null);
  const [compareAudioB, setCompareAudioB] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Learning feedback modal state
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [feedbackTerm, setFeedbackTerm] = useState('');
  const [feedbackMeaning, setFeedbackMeaning] = useState('');

  // Live Studio Effects & Reverb State
  const [isFxEnabled, setIsFxEnabled] = useState<boolean>(true);
  const [activeFxPreset, setActiveFxPreset] = useState<string>('radio_khartoum');
  const [customReverb, setCustomReverb] = useState<number>(0.25);
  const [customDelay, setCustomDelay] = useState<number>(0.12);
  const [customBass, setCustomBass] = useState<number>(3);
  const [customPresence, setCustomPresence] = useState<number>(4);
  const [isProcessingFx, setIsProcessingFx] = useState<boolean>(false);

  // Per-persona FX enabling map (voiceId -> boolean)
  const [personaFxMap, setPersonaFxMap] = useState<Record<string, boolean>>({
    'sudan-abdallah': true,
    'sudan-mudather': true,
    'sudan-badr': true,
    'sudan-muna': true,
    'sudan-taj': true,
    'sudan-nasr': true
  });

  const togglePersonaFx = (personaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyActive = personaFxMap[personaId] !== false;
    setPersonaFxMap(prev => ({ ...prev, [personaId]: !isCurrentlyActive }));
    showToast(!isCurrentlyActive ? "تم تفعيل صدى ومؤثرات الاستوديو لهذه الشخصية 🎙️" : "تم تعطيل المؤثرات لهذه الشخصية (صوت مباشر) ⚡");
  };

  // Filter personas by category
  const filteredPersonas = SUDANESE_VOICE_PERSONAS.filter(persona => {
    if (voiceCategoryFilter === 'ad') return persona.style === 'حماسي إعلاني';
    if (voiceCategoryFilter === 'radio') return persona.style === 'إذاعي دافئ';
    if (voiceCategoryFilter === 'doc') return persona.style === 'وثائقي فخم' || persona.style === 'راوي قصص';
    if (voiceCategoryFilter === 'female') return persona.gender === 'امرأة';
    return true;
  });

  // Handle persona change
  const handleSelectPersona = (persona: VoicePersona) => {
    setSelectedPersona(persona);
    setSelectedVoice(persona.geminiVoiceAlias);
    setSelectedTone(persona.tone);
    setSpeechSpeed(persona.speed);
    showToast(`تم اختيار شخصية الصوت: ${persona.name}`);
  };

  // Preview Persona Sample Voice
  const handlePlayPersonaSample = async (persona: VoicePersona, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingSampleId === persona.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingSampleId(null);
      return;
    }

    setPlayingSampleId(persona.id);
    const optimizedSample = SpeechQualityEngine.optimizeSpeechText(persona.samplePhrase, persona.id);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: optimizedSample,
          voiceName: persona.geminiVoiceAlias,
          tone: persona.tone
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const sampleAudio = new Audio(url);
        sampleAudio.onended = () => setPlayingSampleId(null);
        sampleAudio.onerror = () => fallbackSample(optimizedSample, persona);
        await sampleAudio.play();
        return;
      }
    } catch (err) {
      // fallback
    }

    fallbackSample(optimizedSample, persona);
  };

  const fallbackSample = (optimizedText: string, persona: VoicePersona) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(optimizedText);
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => v.lang.includes('AR'));
      if (arVoice) utterance.voice = arVoice;

      utterance.lang = 'ar-SA';
      utterance.rate = persona.speed || 1.0;
      utterance.pitch = persona.speechPitchValue || 1.0;

      utterance.onend = () => setPlayingSampleId(null);
      utterance.onerror = () => setPlayingSampleId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingSampleId(null);
    }
  };

  // Toggle Favorites
  const toggleFavorite = (id: string) => {
    if (favoriteVoices.includes(id)) {
      setFavoriteVoices(favoriteVoices.filter(v => v !== id));
      showToast("تمت الإزالة من المفضلة");
    } else {
      setFavoriteVoices([...favoriteVoices, id]);
      showToast("تمت الإضافة للمفضلة ❤️");
    }
  };

  // Generate Audio via Server API or SpeechSynthesis Fallback + Auto Play & Share
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      showToast("يرجى كتابة نص إعلاني أو سيناريو أولاً للتوليد.", "error");
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    // Apply Speech Quality Engine optimization tuned for selected persona
    const optimizedSpeech = SpeechQualityEngine.optimizeSpeechText(text, selectedPersona.id);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: optimizedSpeech,
          voiceName: selectedPersona.geminiVoiceAlias,
          tone: selectedPersona.tone
        })
      });

      if (res.ok) {
        const rawBlob = await res.blob();
        let processedBlob = rawBlob;

        const isPersonaFxActive = personaFxMap[selectedPersona.id] !== false;
        if (isFxEnabled && isPersonaFxActive) {
          setIsProcessingFx(true);
          try {
            const presetConfig = STUDIO_FX_PRESETS[activeFxPreset]?.config || STUDIO_FX_PRESETS['radio_khartoum'].config;
            const fxConfig: StudioFxConfig = {
              ...presetConfig,
              enabled: true,
              reverbLevel: customReverb,
              delayFeedback: customDelay,
              bassBoost: customBass,
              presenceBoost: customPresence
            };
            processedBlob = await applyStudioFxToAudioBlob(rawBlob, fxConfig);
            showToast("تم تطبيق مؤثرات صدى استوديو الإذاعة والـ FX بنجاح! 🎙️✨");
          } catch (e) {
            console.warn("Studio FX application error, using raw audio:", e);
          } finally {
            setIsProcessingFx(false);
          }
        } else {
          showToast("تم توليد التسجيل الصوتي المباشر بنجاح! 🔊");
        }

        const url = URL.createObjectURL(processedBlob);
        setAudioUrl(url);
        setIsVoiceFallbackActive(false);

        // Add to history
        const newHist = {
          id: Date.now().toString(),
          text,
          voiceId: selectedPersona.id,
          voiceName: selectedPersona.name,
          tone: selectedPersona.tone,
          audioUrl: url,
          created_at: new Date().toISOString(),
          isVoiceFallbackActive: false
        };
        setVoiceHistory(prev => [newHist, ...prev]);

        // Auto play generated audio immediately
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, 300);

      } else {
        throw new Error("Server error, activating local TTS");
      }
    } catch (err) {
      console.log("Activating browser SpeechSynthesis fallback");
      setIsVoiceFallbackActive(true);
      showToast("تم تشغيل محرك النطق السوداني المحلي بنجاح!");

      // Local SpeechSynthesis trigger with Sudanese phonetic tuning
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(optimizedSpeech);
        
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => v.lang.includes('AR'));
        if (arVoice) {
          utterance.voice = arVoice;
        }

        utterance.lang = 'ar-SA';
        utterance.rate = speechSpeed || selectedPersona.speed || 1.0;
        utterance.pitch = selectedPersona.speechPitchValue || 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // External Share function for generated recording
  const handleShareAudio = async () => {
    if (!audioUrl) {
      showToast("يرجى توليد تسجيل صوتي أولاً للمشاركة.", "error");
      return;
    }

    const shareTitle = `تسجيل صوتي سوداني - ${selectedPersona.name}`;
    const shareText = `استمع إلى هذا التسجيل الصوتي الإعلاني بصوت (${selectedPersona.name}) عبر منصة SAi السودانية:\n"${text.slice(0, 100)}..."`;

    if (navigator.share) {
      try {
        const blob = await fetch(audioUrl).then(r => r.blob());
        const file = new File([blob], `sai-sudanese-voice-${selectedPersona.id}.wav`, { type: 'audio/wav' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file]
          });
          showToast("تمت مشاركة الملف الصوتي بنجاح! 🚀");
          return;
        } else {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: window.location.href
          });
          showToast("تمت المشاركة الخارجية بنجاح!");
          return;
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          copyShareText(shareText);
        }
      }
    } else {
      copyShareText(shareText);
    }
  };

  const copyShareText = (shareText: string) => {
    navigator.clipboard.writeText(shareText);
    showToast("تم نسخ رابط وتفاصيل التسجيل للحافظة ومشاركته خارج التطبيق! 📋");
  };

  // Side-by-side Voice Comparison
  const handleCompareVoices = async () => {
    if (!text.trim()) {
      showToast("أدخل نصاً أولاً للمقارنة بين الأصوات", "error");
      return;
    }
    setIsComparing(true);
    setCompareAudioA(null);
    setCompareAudioB(null);

    const personaA = SUDANESE_VOICE_PERSONAS.find(p => p.id === compareVoiceA) || SUDANESE_VOICE_PERSONAS[0];
    const personaB = SUDANESE_VOICE_PERSONAS.find(p => p.id === compareVoiceB) || SUDANESE_VOICE_PERSONAS[1];

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/generate-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: SpeechQualityEngine.optimizeSpeechText(text, personaA.id),
            voiceName: personaA.geminiVoiceAlias,
            tone: personaA.tone
          })
        }),
        fetch('/api/generate-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: SpeechQualityEngine.optimizeSpeechText(text, personaB.id),
            voiceName: personaB.geminiVoiceAlias,
            tone: personaB.tone
          })
        })
      ]);

      if (resA.ok) {
        const blobA = await resA.blob();
        setCompareAudioA(URL.createObjectURL(blobA));
      }
      if (resB.ok) {
        const blobB = await resB.blob();
        setCompareAudioB(URL.createObjectURL(blobB));
      }

      showToast("تم توليد الملفين لمقارنة النبرة والأداء!");
    } catch (e) {
      showToast("تعذر استكمال المقارنة أونلاين، تم تجربة النطق المحلي", "error");
    } finally {
      setIsComparing(false);
    }
  };

  // Submit Unrecognized Term to Learning System
  const handleSubmitLearningTerm = () => {
    if (!feedbackTerm.trim()) {
      showToast("يرجى كتابة الكلمة السودانية المراد إضافتها للتعلم", "error");
      return;
    }
    LearningSystemManager.logUnmappedTerm(feedbackTerm, text, feedbackMeaning);
    showToast("تم تسليم الكلمة لنظام التعلم الذاتي لتحديث القاموس والنطق! شكراً لك 🇸🇩");
    setFeedbackTerm('');
    setFeedbackMeaning('');
    setShowLearningModal(false);
  };

  // Optimize text via Gemini text optimizer
  const handleOptimizeText = async () => {
    if (!text.trim()) {
      showToast("أدخل نصاً أولاً لتحسينه لصالح الإعلانات السودانية.", "error");
      return;
    }

    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (data.text) {
        setText(data.text);
        showToast("تم تحسين الصياغة الإعلانية بالعامية السودانية الحماسية بنجاح!");
      }
    } catch (err) {
      showToast("تعذر تحسين النص حالياً.", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Vibe Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/80 border border-emerald-500/30 p-6 rounded-3xl space-y-3 backdrop-blur-xl text-right">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>محرك الأصوات السودانية الطبيعي (SLVI) 🇸🇩</span>
          </div>

          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'studio' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              المصمم الصوتي
            </button>
            <button
              onClick={() => setActiveTab('playlist')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'playlist' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>قائمة التشغيل 🎵</span>
              {playlist.length > 0 && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                  {playlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'compare' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              مقارنة الأصوات ⚖️
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'history' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              السجل 📜
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">استوديو الأصوات السودانية الاحترافي</h2>
        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-3xl">
          أختر الشخصية الصوتية السودانية المناسبة لإعلانك، برنامجك الإذاعي، أو روايتك، مع تحكم كامل في السرعة والنبرة وجودة مخارج الحروف.
        </p>
      </div>

      {activeTab === 'studio' && (
        <div className="space-y-6">

          {/* Voice Selector Header & Grid System (أجهزة التبديل بين الشخصيات الصوتية) */}
          <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-5 space-y-4 backdrop-blur-xl text-right shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">اختر الشخصية الصوتية السودانية (Voice Selector)</h3>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs font-bold bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setVoiceCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${voiceCategoryFilter === 'all' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  الكل ({SUDANESE_VOICE_PERSONAS.length})
                </button>
                <button
                  onClick={() => setVoiceCategoryFilter('ad')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${voiceCategoryFilter === 'ad' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  ⚡ إعلاني
                </button>
                <button
                  onClick={() => setVoiceCategoryFilter('radio')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${voiceCategoryFilter === 'radio' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  📻 إذاعي
                </button>
                <button
                  onClick={() => setVoiceCategoryFilter('doc')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${voiceCategoryFilter === 'doc' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  📖 وثائقي
                </button>
                <button
                  onClick={() => setVoiceCategoryFilter('female')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${voiceCategoryFilter === 'female' ? 'bg-pink-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  🌸 نسائي
                </button>
              </div>
            </div>

            {/* Selector Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredPersonas.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                const isFav = favoriteVoices.includes(persona.id);
                const isSamplePlaying = playingSampleId === persona.id;

                return (
                  <div
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona)}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-emerald-950/60 border-emerald-500 shadow-xl ring-2 ring-emerald-500/40 scale-[1.02]'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            <span>{persona.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </h4>
                          <p className="text-[10px] text-zinc-400 leading-tight">{persona.speakerTitle}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(persona.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${isFav ? 'text-rose-500' : 'text-zinc-600 hover:text-zinc-300'}`}
                          title="إضافة للمفضلة"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                          {persona.style}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold">
                          {persona.ageGroup}
                        </span>
                      </div>
                    </div>

                    {/* Preview Sample Player & Persona FX Toggle */}
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handlePlayPersonaSample(persona, e)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 ${
                          isSamplePlaying
                            ? 'bg-amber-500 text-zinc-950 font-black animate-pulse'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isSamplePlaying ? <Pause className="w-3 h-3 fill-zinc-950" /> : <Play className="w-3 h-3 fill-emerald-400" />}
                        <span>{isSamplePlaying ? 'جاري الاستماع...' : 'استماع لعينات'}</span>
                      </button>

                      <button
                        onClick={(e) => togglePersonaFx(persona.id, e)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-xl transition-all flex items-center gap-1 border ${
                          personaFxMap[persona.id] !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                        title="تفعيل أو تعطيل صدى الاستوديو لهذه الشخصية"
                      >
                        <Disc className="w-3 h-3" />
                        <span>{personaFxMap[persona.id] !== false ? 'صدى مفعّل 🎙️' : 'مباشر ⚡'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Radio Studio Effects & Reverb Engine Panel */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-5 space-y-4 text-right backdrop-blur-xl shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
                  <Disc className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>نظام التأثيرات الصوتية الحية وصدى الاستوديو الإذاعي (Studio Reverb & FX)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      محرك Web Audio API الحقيقي
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">تحاكِي استوديوهات الإذاعة والتلفزيون السوداني الرسمية بوضوح وحضور صوتي عالي</p>
                </div>
              </div>

              {/* Master FX Toggle Switch */}
              <button
                onClick={() => {
                  setIsFxEnabled(!isFxEnabled);
                  showToast(!isFxEnabled ? "تم تفعيل نظام مؤثرات الاستوديو الإذاعي 🎙️" : "تم تعطيل مؤثرات الاستوديو (النطق المباشر) ⚡");
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                  isFxEnabled
                    ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{isFxEnabled ? 'مؤثرات الاستوديو: مفعّلة 🟢' : 'مؤثرات الاستوديو: معطّلة ⚪'}</span>
              </button>
            </div>

            {isFxEnabled && (
              <div className="space-y-4 pt-1 animate-fade-in">
                {/* Studio Preset Selection */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 mb-2 block">اختر بيئة الاستوديو ونمط الصدى الإذاعي:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(STUDIO_FX_PRESETS).map(([key, preset]) => {
                      const isActive = activeFxPreset === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setActiveFxPreset(key);
                            setCustomReverb(preset.config.reverbLevel);
                            setCustomDelay(preset.config.delayFeedback);
                            setCustomBass(preset.config.bassBoost);
                            setCustomPresence(preset.config.presenceBoost);
                            showToast(`تم اختيار نمط: ${preset.name}`);
                          }}
                          className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-1.5 ${
                            isActive
                              ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base">{preset.icon}</span>
                            {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                          </div>
                          <span className="text-xs font-bold">{preset.name}</span>
                          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-tight">{preset.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced Parameter Controls Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 text-xs text-zinc-300">
                  
                  {/* Reverb Level */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-emerald-400" />
                        <span>نسبة الصدى (Reverb):</span>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">{Math.round(customReverb * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={customReverb}
                      onChange={(e) => setCustomReverb(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Delay Echo Feedback */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>تكرار الصدى (Echo):</span>
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">{Math.round(customDelay * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.4"
                      step="0.02"
                      value={customDelay}
                      onChange={(e) => setCustomDelay(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Radio Bass EQ */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>تضخيم الباس (Radio Bass):</span>
                      </span>
                      <span className="font-mono text-amber-400 font-bold">+{customBass} dB</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="1"
                      value={customBass}
                      onChange={(e) => setCustomBass(parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* High Presence EQ */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>وضوح الحروف (Presence):</span>
                      </span>
                      <span className="font-mono text-purple-400 font-bold">+{customPresence} dB</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="1"
                      value={customPresence}
                      onChange={(e) => setCustomPresence(parseInt(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Controls (2 Cols) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Presets */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl text-right">
                <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>نماذج سيناريوهات إعلانية سودانية جاهزة</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setText(p.text)}
                      className="p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-right transition-all group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400">{p.title}</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold">{p.badge}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{p.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-4 backdrop-blur-xl text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-zinc-200">السيناريو للنطق الصوتي:</label>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                      الصوت: {selectedPersona.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowLearningModal(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>قاموس الكلمات</span>
                    </button>
                    <button
                      onClick={handleOptimizeText}
                      disabled={isOptimizing}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
                    >
                      {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>تحسين بالعامية</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
                  placeholder="اكتب سيناريو إعلانك أو النص السوداني هنا..."
                />

                {/* Smart Ad Reading Time Counter (عداد الوقت التقريبي للقراءة) */}
                {(() => {
                  const wordsCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
                  const charsCount = text.length;

                  let baseWpm = 130;
                  if (selectedPersona.tone.includes('حماسي') || selectedPersona.style.includes('إعلاني') || selectedPersona.style.includes('حيوي')) {
                    baseWpm = 145;
                  } else if (selectedPersona.tone.includes('وثائقي') || selectedPersona.tone.includes('عميق') || selectedPersona.tone.includes('هادئ')) {
                    baseWpm = 115;
                  }

                  const effectiveWpm = baseWpm * speechSpeed;
                  const estimatedSec = wordsCount > 0 ? Math.max(1, Math.round((wordsCount / (effectiveWpm / 60)))) : 0;

                  const formattedTime = estimatedSec >= 60 
                    ? `${Math.floor(estimatedSec / 60)} دقيقة و ${estimatedSec % 60} ثانية`
                    : `${estimatedSec} ثانية`;

                  let adCategoryBadge = {
                    label: "ادخل النص لحساب مدة الإعلان",
                    color: "bg-zinc-800 text-zinc-400 border-zinc-700",
                    targetRange: "15 - 60 ثانية"
                  };

                  if (estimatedSec > 0 && estimatedSec <= 18) {
                    adCategoryBadge = {
                      label: "إعلان قصير (Social / Stories / Reel)",
                      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      targetRange: "استهدف 15 ثانية"
                    };
                  } else if (estimatedSec > 18 && estimatedSec <= 38) {
                    adCategoryBadge = {
                      label: "إعلان قياسي (Radio & TV Ad)",
                      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                      targetRange: "استهدف 30 ثانية"
                    };
                  } else if (estimatedSec > 38 && estimatedSec <= 75) {
                    adCategoryBadge = {
                      label: "إعلان ترويجي كامل (Commercial)",
                      color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                      targetRange: "استهدف 60 ثانية"
                    };
                  } else if (estimatedSec > 75) {
                    adCategoryBadge = {
                      label: "سرد وثائقي / تقرير طويل",
                      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                      targetRange: "أكثر من دقيقة"
                    };
                  }

                  return (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950/90 border border-zinc-800 rounded-2xl text-xs backdrop-blur-md">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Live Timer Counter */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono font-bold">
                          <Timer className="w-4 h-4 animate-pulse text-emerald-400" />
                          <span>الوقت المقدر: {formattedTime}</span>
                        </div>

                        {/* Words & Chars breakdown */}
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <span className="font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">{wordsCount}</span> كلمة
                          <span className="text-zinc-600">•</span>
                          <span className="font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">{charsCount}</span> حرف
                        </div>
                      </div>

                      {/* Recommendation Category Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2.5 py-1 rounded-xl border font-bold flex items-center gap-1 ${adCategoryBadge.color}`}>
                          <span>{adCategoryBadge.label}</span>
                          <span className="opacity-75 font-normal">({adCategoryBadge.targetRange})</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Speed & Pitch Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-300">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>سرعة النطق:</span>
                    <input
                      type="range"
                      min="0.75"
                      max="1.5"
                      step="0.05"
                      value={speechSpeed}
                      onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                      className="w-28 accent-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-emerald-400 font-bold">{speechSpeed}x</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        if (!text.trim()) {
                          showToast("يرجى كتابة نص إعلاني أولاً لإضافته لقائمة التشغيل.", "error");
                          return;
                        }
                        const newItem: PlaylistItem = {
                          id: `pl-${Date.now()}`,
                          title: `فقرة: ${selectedPersona.name.split('-')[0].trim()}`,
                          text: text,
                          personaId: selectedPersona.id,
                          personaName: selectedPersona.name,
                          pauseAfterSec: 1
                        };
                        setPlaylist(prev => [...prev, newItem]);
                        showToast("تمت إضافة النص إلى قائمة التشغيل الإعلانية 🎵");
                      }}
                      className="px-4 py-3 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold rounded-2xl text-xs transition-all flex items-center gap-1.5"
                      title="إضافة هذا النص كفقرة في قائمة التشغيل المتتابعة"
                    >
                      <ListMusic className="w-4 h-4 text-emerald-400" />
                      <span>أضف لقائمة التشغيل 🎵</span>
                    </button>

                    <button
                      onClick={handleGenerateVoice}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
                      <span>توليد التسجيل بصوت ({selectedPersona.name.split('-')[0].trim()})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Generated Player */}
              {(audioUrl || isVoiceFallbackActive) && (
                <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-zinc-950 border border-emerald-500/40 rounded-3xl p-5 space-y-4 shadow-2xl animate-fade-in text-right">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>التسجيل الصوتي الجاهز ({selectedPersona.name}) 🔊</span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShareAudio}
                        className="text-xs text-amber-300 font-black flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all shadow-md"
                        title="مشاركة التسجيل خارج التطبيق"
                      >
                        <Share2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>مشاركة خارج التطبيق 🚀</span>
                      </button>

                      {audioUrl && (
                        <a
                          href={audioUrl}
                          download={`sai-${selectedPersona.id}-${Date.now()}.wav`}
                          className="text-xs text-emerald-950 font-black flex items-center gap-1 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-1.5 rounded-xl transition-all shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل WAV</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} controls className="w-full h-10 accent-emerald-500" />
                  )}

                  {/* Save to Profile Favorites Bar */}
                  <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-300 font-bold">التصنيف الإعلاني:</span>
                      <select
                        value={selectedSaveCat}
                        onChange={(e) => setSelectedSaveCat(e.target.value)}
                        className="bg-zinc-950 text-emerald-300 border border-emerald-500/30 rounded-xl px-2.5 py-1 text-xs focus:outline-none"
                      >
                        <option value="عروض وتخفيضات">🏷️ عروض وتخفيضات</option>
                        <option value="إعلانات حماسية">🔥 إعلانات حماسية</option>
                        <option value="مطاعم وأغذية">🍔 مطاعم وأغذية</option>
                        <option value="عقارات فاخرة">🏠 عقارات فاخرة</option>
                        <option value="خدمات وتطبيقات">⚡ خدمات وتطبيقات</option>
                        <option value="عامة">🇸🇩 عامة</option>
                      </select>
                    </div>

                    {handleSaveAdVoice && (
                      <button
                        onClick={() => {
                          handleSaveAdVoice({
                            text,
                            voiceId: selectedPersona.id,
                            voiceName: selectedPersona.name,
                            tone: selectedPersona.tone,
                            category: selectedSaveCat,
                            audioUrl
                          });
                        }}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 fill-emerald-500/20" />
                        <span>حفظ للمفضلة ❤️</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Active Persona Card Details */}
            <div className="space-y-4">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl text-right">
                <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase">تفاصيل الشخصية المختارة</h3>
                
                <div className="space-y-2.5 p-3.5 bg-zinc-950 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{selectedPersona.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${selectedPersona.badgeColor}`}>
                      {selectedPersona.style}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300">{selectedPersona.speakerTitle}</p>

                  <div className="text-[10px] text-zinc-400 space-y-1 pt-1 border-t border-zinc-800">
                    <p><strong className="text-zinc-200">النبرة:</strong> {selectedPersona.tone}</p>
                    <p><strong className="text-zinc-200">السرعة الموصى بها:</strong> {selectedPersona.speed}x</p>
                    <p><strong className="text-zinc-200">الاستخدام الموصى به:</strong> {selectedPersona.recommendedUse}</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400">عبارة نموذجية للنطق:</span>
                  <p className="text-[11px] text-zinc-300 italic">"{selectedPersona.samplePhrase}"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Playlist Tab (قائمة التشغيل الإعلانية المتتابعة) */}
      {activeTab === 'playlist' && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Top Bar: Controls & Master Playlist Player */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-emerald-950/60 border border-emerald-500/40 rounded-3xl p-5 md:p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
                    <ListMusic className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>قائمة التشغيل الإعلانية المتتابعة (Sequential Ad Playlist)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                        {playlist.length} فقرة إعلانية
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      رتّب عدة نصوص إعلانية وشغّلها بضغطة زر واحدة بشكل متتابع، مع إمكانية التقديم أو التبديل بين الشخصيات الصوتية لكل فقرة!
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGenerateAllPlaylist}
                  disabled={isGeneratingAllPlaylist || playlist.length === 0}
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-40"
                >
                  {isGeneratingAllPlaylist ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Mic2 className="w-4 h-4 text-emerald-400" />}
                  <span>توليد جميع الأصوات 🎙️</span>
                </button>

                {isPlayingPlaylist ? (
                  <button
                    onClick={handleStopPlaylist}
                    className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-500/20 animate-pulse"
                  >
                    <Pause className="w-4 h-4 fill-zinc-950" />
                    <span>إيقاف التشغيل المتتابع ⏸️</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlaySequentialPlaylist(0)}
                    disabled={playlist.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>تشغيل القائمة بالكامل متتابعاً ▶️</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Playing Status Indicator */}
            {isPlayingPlaylist && currentPlaylistIndex >= 0 && currentPlaylistIndex < playlist.length && (
              <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-emerald-950/80 border border-emerald-500/50 rounded-2xl space-y-2 animate-fade-in shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-black">
                    <Activity className="w-4 h-4 animate-bounce" />
                    <span>جاري تشغيل الفقرة ({currentPlaylistIndex + 1} من {playlist.length}):</span>
                    <span className="text-white bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
                      {playlist[currentPlaylistIndex].title}
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-400 font-bold">
                    الراوي: {playlist[currentPlaylistIndex].personaName}
                  </span>
                </div>

                <p className="text-xs text-zinc-200 bg-zinc-950/90 p-3 rounded-xl border border-zinc-800 line-clamp-2 leading-relaxed italic">
                  "{playlist[currentPlaylistIndex].text}"
                </p>

                {/* Progress bar visualizer */}
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse w-full"></div>
                </div>
              </div>
            )}

            {/* Quick Add New PlaylistItem Inline */}
            <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>إضافة فقرة إعلانية جديدة للقائمة:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="عنوان الفقرة (مثال: العرض الحصري، رقم الاتصال)..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />

                <select
                  value={newPlaylistPersonaId}
                  onChange={(e) => setNewPlaylistPersonaId(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none"
                >
                  {SUDANESE_VOICE_PERSONAS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.style})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddPlaylistItem}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة للقائمة 🎵</span>
                </button>
              </div>

              <textarea
                value={newPlaylistText}
                onChange={(e) => setNewPlaylistText(e.target.value)}
                rows={2}
                placeholder="اكتب نص الفقرة الإعلانية بالعامية السودانية هنا..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Playlist Items Cards List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>ترتيب ونصوص الفقرات في قائمة التشغيل ({playlist.length}):</span>
            </h4>

            {playlist.length === 0 ? (
              <div className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-3xl p-8 text-center space-y-2">
                <ListMusic className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400 font-bold">قائمة التشغيل فارغة حالياً</p>
                <p className="text-[11px] text-zinc-500">أضف فقرات إعلانية جديدة من النموذج أعلاه أو من المصمم الصوتي.</p>
              </div>
            ) : (
              playlist.map((item, index) => {
                const isCurrentlyPlaying = isPlayingPlaylist && currentPlaylistIndex === index;
                const persona = SUDANESE_VOICE_PERSONAS.find(p => p.id === item.personaId) || SUDANESE_VOICE_PERSONAS[0];

                return (
                  <div
                    key={item.id}
                    className={`p-4 md:p-5 rounded-3xl border transition-all space-y-3.5 ${
                      isCurrentlyPlaying
                        ? 'bg-gradient-to-r from-emerald-950/90 via-zinc-900 to-zinc-950 border-emerald-500 shadow-xl ring-2 ring-emerald-500/40'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Item Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border ${
                          isCurrentlyPlaying
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 animate-pulse'
                            : 'bg-zinc-950 text-emerald-400 border-zinc-800'
                        }`}>
                          {index + 1}
                        </span>

                        <div className="space-y-0.5">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPlaylist(prev => prev.map(p => p.id === item.id ? { ...p, title: val } : p));
                            }}
                            className="bg-transparent text-xs font-black text-white hover:bg-zinc-950/50 focus:bg-zinc-950 border border-transparent focus:border-zinc-800 rounded-lg px-2 py-0.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Controls: Reorder & Actions */}
                      <div className="flex items-center gap-1.5 text-xs">
                        {/* Voice Persona Picker */}
                        <select
                          value={item.personaId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const pObj = SUDANESE_VOICE_PERSONAS.find(p => p.id === selectedId);
                            setPlaylist(prev => prev.map(p => p.id === item.id ? { 
                              ...p, 
                              personaId: selectedId, 
                              personaName: pObj?.name || 'صوت سوداني',
                              audioUrl: null
                            } : p));
                            showToast("تم تغيير الشخصية الصوتية لهذه الفقرة");
                          }}
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1 text-[11px] text-emerald-300 font-bold focus:outline-none"
                        >
                          {SUDANESE_VOICE_PERSONAS.map(p => (
                            <option key={p.id} value={p.id}>
                              🎙️ {p.name}
                            </option>
                          ))}
                        </select>

                        {/* Pause After Duration Dropdown */}
                        <select
                          value={item.pauseAfterSec || 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setPlaylist(prev => prev.map(p => p.id === item.id ? { ...p, pauseAfterSec: val } : p));
                          }}
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1 text-[10px] text-zinc-400 font-bold focus:outline-none"
                          title="فترة التوقف المؤقت بعد هذه الفقرة"
                        >
                          <option value={0}>توقف 0 ثانية</option>
                          <option value={1}>توقف 1 ثانية</option>
                          <option value={2}>توقف 2 ثانية</option>
                          <option value={3}>توقف 3 ثواني</option>
                        </select>

                        {/* Move Up/Down */}
                        <button
                          onClick={() => movePlaylistItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                          title="تقديم الفقرة لأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePlaylistItem(index, 'down')}
                          disabled={index === playlist.length - 1}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                          title="تأخير الفقرة لأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => removePlaylistItem(item.id)}
                          className="p-1.5 bg-zinc-950 hover:bg-rose-950/50 border border-zinc-800 hover:border-rose-500/40 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                          title="حذف الفقرة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Text Body Editor */}
                    <textarea
                      value={item.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlaylist(prev => prev.map(p => p.id === item.id ? { ...p, text: val, audioUrl: null } : p));
                      }}
                      rows={2}
                      className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-y leading-relaxed"
                    />

                    {/* Individual Audio Preview Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            if (!item.audioUrl) {
                              await generatePlaylistItemAudio(item.id);
                            } else {
                              handlePlaySequentialPlaylist(index);
                            }
                          }}
                          disabled={item.isGenerating}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            isCurrentlyPlaying
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {item.isGenerating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-emerald-400" />
                          )}
                          <span>
                            {item.isGenerating 
                              ? 'جاري التوليد...' 
                              : item.audioUrl 
                                ? (isCurrentlyPlaying ? 'شغال حالياً 🔊' : 'تشغيل من هنا ▶️') 
                                : 'توليد الصوت 🎙️'
                            }
                          </span>
                        </button>

                        <span className="text-[10px] text-zinc-500">
                          النمط: {persona.style}
                        </span>
                      </div>

                      {item.audioUrl && (
                        <div className="flex items-center gap-2">
                          <audio src={item.audioUrl} controls className="h-7 w-48 accent-emerald-500" />
                          <a
                            href={item.audioUrl}
                            download={`sai-playlist-${item.id}.wav`}
                            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 rounded-lg text-xs"
                            title="تحميل المقطع الصوتي"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* Side-by-Side Voice Comparison Tab */}
      {activeTab === 'compare' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-6 text-right animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>مقارنة الأصوات والنبرات السودانية جنباً إلى جنب</span>
            </h3>
            <p className="text-xs text-zinc-400">اختر شخصيتين صوتيتين وقارن النطق والجودة لنفس النص في وقت واحد.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-emerald-400">الصوت الأول (أ):</label>
              <select
                value={compareVoiceA}
                onChange={(e) => setCompareVoiceA(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {SUDANESE_VOICE_PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {compareAudioA && (
                <audio src={compareAudioA} controls className="w-full mt-2 h-8 accent-emerald-500" />
              )}
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-teal-400">الصوت الثاني (ب):</label>
              <select
                value={compareVoiceB}
                onChange={(e) => setCompareVoiceB(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {SUDANESE_VOICE_PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {compareAudioB && (
                <audio src={compareAudioB} controls className="w-full mt-2 h-8 accent-teal-500" />
              )}
            </div>
          </div>

          <button
            onClick={handleCompareVoices}
            disabled={isComparing}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isComparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
            <span>توليد ومقارنة الصوتين الآن</span>
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4 text-right animate-fade-in">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>سجل التسجيلات الصوتية السابقة</span>
          </h3>

          {voiceHistory.length === 0 ? (
            <p className="text-xs text-zinc-500 py-8 text-center">لا توجد تسجيلات صوتية سابقة في السجل حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {voiceHistory.map((h, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{h.voiceName || 'صوت سوداني'}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(h.created_at).toLocaleString('ar-SD')}</span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{h.text}</p>
                  {h.audioUrl && (
                    <audio src={h.audioUrl} controls className="w-full h-8 accent-emerald-500 mt-1" />
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900">
                    <button
                      onClick={() => {
                        setText(h.text);
                        if (h.voiceId) setSelectedVoice(h.voiceId);
                        if (h.tone) setSelectedTone(h.tone);
                        setActiveTab('studio');
                        showToast("تم فتح النص والتسجيل في الاستوديو للتعديل ✨");
                      }}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-[11px] font-bold transition-all"
                    >
                      تعديل في الاستوديو ✏️
                    </button>

                    {handleSaveAdVoice && (
                      <button
                        onClick={() => {
                          handleSaveAdVoice({
                            text: h.text,
                            voiceId: h.voiceId || selectedPersona.id,
                            voiceName: h.voiceName || selectedPersona.name,
                            tone: h.tone || selectedPersona.tone,
                            category: 'إعلانات حماسية',
                            audioUrl: h.audioUrl
                          });
                        }}
                        className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3 fill-emerald-500/20" />
                        <span>حفظ للمفضلة ❤️</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Learning Modal */}
      {showLearningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-cyan-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-right animate-fade-in">
            <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span>إضافة أو تصحيح كلمة سودانية لنظام التعلم الذاتي</span>
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              ساعدنا في تحسين وتدريب القاموس ومحرك النطق السوداني بإدخال الكلمة والمعنى المناسب:
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={feedbackTerm}
                onChange={(e) => setFeedbackTerm(e.target.value)}
                placeholder="الكلمة السودانية (مثال: حبابك، جكس، حنك...)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <textarea
                value={feedbackMeaning}
                onChange={(e) => setFeedbackMeaning(e.target.value)}
                placeholder="المعنى أو كيفية النطق المناسب..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSubmitLearningTerm}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black rounded-xl text-xs transition-all"
              >
                تسليم لنظام التعلم
              </button>
              <button
                onClick={() => setShowLearningModal(false)}
                className="px-4 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs hover:bg-zinc-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VoiceStudioView;
