import { useCallback, useEffect, useRef } from "react";

// Pick the best available Danish voice. Called once on first speak since voices
// load asynchronously in the browser.
function pickDanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Try exact da-DK match (Google/Windows)
  const exact = voices.find((v) => v.lang === "da-DK" || v.lang === "da_DK");
  if (exact) return exact;
  // Try any da- locale
  const da = voices.find((v) => v.lang.startsWith("da"));
  if (da) return da;
  // Try by name (some Linux engines name it "Danish" or "da")
  const named = voices.find(
    (v) => /danish|dansk|da\b/i.test(v.name) || /danish|dansk|da\b/i.test(v.lang)
  );
  return named ?? null;
}

export function useTTS() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const resolve = () => {
      if (resolvedRef.current) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      resolvedRef.current = true;
      voiceRef.current = pickDanishVoice(voices);
    };

    resolve();
    window.speechSynthesis.addEventListener("voiceschanged", resolve);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", resolve);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Ensure voices are loaded before speaking
    if (!resolvedRef.current) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickDanishVoice(voices);
        resolvedRef.current = true;
      }
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "da-DK";
    u.rate = 0.78;   // Slightly slower for children; natural rhythm
    u.pitch = 1.0;   // Neutral pitch sounds most natural
    u.volume = 1;

    if (voiceRef.current) {
      u.voice = voiceRef.current;
    }

    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
