// Web Audio API Studio Effects Engine for Sudanese Radio & Broadcast Acoustics

export interface StudioFxConfig {
  enabled: boolean;
  preset: 'radio_khartoum' | 'commercial_studio' | 'grand_hall' | 'warm_broadcast' | 'raw';
  reverbLevel: number; // 0 to 1
  delayFeedback: number; // 0 to 0.5
  bassBoost: number; // dB (-6 to +6)
  presenceBoost: number; // dB (-6 to +6)
  compression: boolean;
}

export const STUDIO_FX_PRESETS: Record<string, { name: string; icon: string; desc: string; config: StudioFxConfig }> = {
  radio_khartoum: {
    name: 'إذاعة الخرطوم الرسمية',
    icon: '📻',
    desc: 'صدى إذاعي متزن مع دفق دافئ ووضوح ممتاز للأصوات الإخبارية والإذاعية.',
    config: {
      enabled: true,
      preset: 'radio_khartoum',
      reverbLevel: 0.25,
      delayFeedback: 0.12,
      bassBoost: 3,
      presenceBoost: 4,
      compression: true,
    }
  },
  commercial_studio: {
    name: 'استوديو الإعلانات الحماسي',
    icon: '🎙️',
    desc: 'صوت مضخم بضغط ديناميكي عالي وصدى قصير لإعلانات قوية وجذابة.',
    config: {
      enabled: true,
      preset: 'commercial_studio',
      reverbLevel: 0.18,
      delayFeedback: 0.08,
      bassBoost: 5,
      presenceBoost: 6,
      compression: true,
    }
  },
  grand_hall: {
    name: 'صدى القاعات والمهرجانات',
    icon: '🏛️',
    desc: 'تأثير صدى واسع النطاق محاكي للمسارح والافتتاحات الكبرى.',
    config: {
      enabled: true,
      preset: 'grand_hall',
      reverbLevel: 0.55,
      delayFeedback: 0.28,
      bassBoost: 2,
      presenceBoost: 2,
      compression: true,
    }
  },
  warm_broadcast: {
    name: 'بث وثائقي دافئ',
    icon: '📻',
    desc: 'نغمة عميقة وهادئة محاكية لأجهزة التسجيل الشريطية والكلاسيكية.',
    config: {
      enabled: true,
      preset: 'warm_broadcast',
      reverbLevel: 0.15,
      delayFeedback: 0.05,
      bassBoost: 4,
      presenceBoost: 1,
      compression: true,
    }
  },
  raw: {
    name: 'صوت استوديو نقي (بدون مؤثرات)',
    icon: '⚡',
    desc: 'النطق المباشر الأصلي بدون أي صدى أو معالجة إضافية.',
    config: {
      enabled: false,
      preset: 'raw',
      reverbLevel: 0,
      delayFeedback: 0,
      bassBoost: 0,
      presenceBoost: 0,
      compression: false,
    }
  }
};

/**
 * Creates an Impulse Response buffer for realistic studio room reverb
 */
function createImpulseResponse(ctx: BaseAudioContext, duration: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = length - i;
    left[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
  }

  return impulse;
}

/**
 * Process audio ArrayBuffer or Blob with Web Audio API OfflineContext to produce a processed WAV Blob
 */
export async function applyStudioFxToAudioBlob(
  audioBlob: Blob,
  fxConfig: StudioFxConfig
): Promise<Blob> {
  if (!fxConfig.enabled || fxConfig.preset === 'raw') {
    return audioBlob;
  }

  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const decodedBuffer = await tempCtx.decodeAudioData(arrayBuffer);
    tempCtx.close();

    // Create OfflineAudioContext for rendering with effects
    const offlineCtx = new OfflineAudioContext(
      decodedBuffer.numberOfChannels,
      decodedBuffer.length + (offlineCtxSampleRate(fxConfig) * 1.5), // add tail for reverb
      decodedBuffer.sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = decodedBuffer;

    // Build Signal Processing Chain
    // Source -> Bass EQ -> Presence EQ -> Compressor -> Split (Dry/Wet) -> Reverb & Delay -> Master Gain -> Destination

    // 1. Low Shelf Bass Boost
    const bassFilter = offlineCtx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200;
    bassFilter.gain.value = fxConfig.bassBoost;

    // 2. High Shelf Presence Boost
    const presenceFilter = offlineCtx.createBiquadFilter();
    presenceFilter.type = 'highshelf';
    presenceFilter.frequency.value = 3500;
    presenceFilter.gain.value = fxConfig.presenceBoost;

    // 3. Dynamics Compressor
    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 10;
    compressor.ratio.value = fxConfig.compression ? 4 : 1;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.1;

    // 4. Reverb Convolver
    const convolver = offlineCtx.createConvolver();
    const reverbDuration = fxConfig.preset === 'grand_hall' ? 2.5 : 1.2;
    convolver.buffer = createImpulseResponse(offlineCtx, reverbDuration, 2.0);

    const dryGain = offlineCtx.createGain();
    const wetGain = offlineCtx.createGain();
    dryGain.gain.value = 1.0 - (fxConfig.reverbLevel * 0.4);
    wetGain.gain.value = fxConfig.reverbLevel * 0.8;

    // 5. Echo Delay Node
    const delay = offlineCtx.createDelay();
    delay.delayTime.value = 0.12; // 120ms radio echo
    const delayFeedbackGain = offlineCtx.createGain();
    delayFeedbackGain.gain.value = fxConfig.delayFeedback;

    delay.connect(delayFeedbackGain);
    delayFeedbackGain.connect(delay);

    // Connect Nodes
    source.connect(bassFilter);
    bassFilter.connect(presenceFilter);
    presenceFilter.connect(compressor);

    // Split Dry & Wet
    compressor.connect(dryGain);
    compressor.connect(convolver);
    convolver.connect(wetGain);

    if (fxConfig.delayFeedback > 0) {
      compressor.connect(delay);
      delay.connect(wetGain);
    }

    dryGain.connect(offlineCtx.destination);
    wetGain.connect(offlineCtx.destination);

    source.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWavBlob(renderedBuffer);

  } catch (err) {
    console.warn("Failed to process audio with Web Audio API offline renderer, returning original blob:", err);
    return audioBlob;
  }
}

function offlineCtxSampleRate(fx: StudioFxConfig): number {
  return 44100;
}

/**
 * Converts an AudioBuffer to a WAV format Blob
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result: Float32Array;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    result = new Float32Array(left.length + right.length);
    for (let i = 0; i < left.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result = buffer.getChannelData(0);
  }

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = result.length * bytesPerSample;
  const bufferLength = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataSize, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataSize, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < result.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
