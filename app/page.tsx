"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "loading" | "intro" | "reasons" | "question" | "celebration";

// ─── Floating Hearts Background ───────────────────────────────────────────────
interface Heart {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function FloatingHearts({ count = 18 }: { count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const emojis = ["❤️", "💕", "💖", "💗", "💝", "💘", "🩷", "💞", "💓"];
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 96,
        delay: Math.random() * 8,
        duration: 5 + Math.random() * 5,
        size: 1 + Math.random() * 1.8,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-15vh", opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${heart.left}%`,
            fontSize: `${heart.size}rem`,
            userSelect: "none",
          }}
        >
          {heart.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Sparkle Burst (celebration only) ────────────────────────────────────────
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  repeatDelay: number;
}

function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 14,
        delay: Math.random() * 2,
        repeatDelay: Math.random() * 2.5,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute select-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}px` }}
          animate={{ scale: [0, 1.4, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.2,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

// ─── Stage 1: Loading ─────────────────────────────────────────────────────────
const loadingMessages = [
  "Gathering courage... 💪",
  "Loading romantic playlist... 🎵",
  "Preparing butterflies in stomach... 🦋",
  "Polishing the ring... 💍",
  "Almost ready to embarrass myself... 😅",
  "Your destiny is loading... 💕",
];

function LoadingStage({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 18 + 4, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 700);
        }
        return next;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * loadingMessages.length),
      loadingMessages.length - 1
    );
    setMsgIdx(idx);
  }, [progress]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-pink-300 via-rose-200 to-purple-300"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl mb-8 select-none"
      >
        💌
      </motion.div>

      <motion.h1
        className="text-3xl md:text-4xl font-black text-pink-800 mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Just a moment...
      </motion.h1>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-pink-700 text-lg mb-10 font-semibold"
        >
          {loadingMessages[msgIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-64 h-5 bg-pink-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #ec4899, #a855f7, #ec4899)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            width: `${progress}%`,
          }}
          transition={{ ease: "easeOut" }}
        />
      </div>
      <p className="text-pink-600 mt-3 font-black text-lg">{Math.floor(progress)}%</p>
    </motion.div>
  );
}

// ─── Stage 2: Intro ───────────────────────────────────────────────────────────
function IntroStage({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -80 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
        className="text-8xl md:text-9xl mb-6 select-none"
      >
        🥺
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-5xl md:text-7xl font-black text-pink-700 mb-5 leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Hey Babe! 💕
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="text-xl md:text-2xl text-pink-600 max-w-md mb-4 font-semibold"
      >
        I&apos;ve been planning this for a while now...
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
        className="text-xl md:text-2xl text-pink-600 max-w-md mb-4 font-semibold"
      >
        I tried to do it in person, but I got nervous and ate your fries instead. 🍟
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35 }}
        className="text-2xl md:text-3xl font-black text-purple-600 mb-12"
      >
        So I built a website. 🖥️
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.65, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.06, boxShadow: "0 0 35px rgba(236,72,153,0.55)" }}
        whileTap={{ scale: 0.94 }}
        onClick={onContinue}
        className="bg-linear-to-r from-pink-500 to-purple-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-full shadow-xl cursor-pointer"
      >
        Okay... tell me more 👀
      </motion.button>
    </motion.div>
  );
}

// ─── Stage 3: Reasons ─────────────────────────────────────────────────────────
const reasons = [
  { emoji: "☕", text: "You already know my entire food & drink order by heart" },
  { emoji: "😂", text: "You laugh at my terrible jokes — even the truly bad ones" },
  { emoji: "🛋️", text: "You + couch + Netflix = the perfect evening. Every. Single. Time." },
  { emoji: "🤝", text: "You've seen me at my worst and somehow still chose my best" },
  { emoji: "📶", text: "I love you more than fast WiFi... and that is saying A LOT" },
];

function ReasonsStage({ onContinue }: { onContinue: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < reasons.length) {
      const t = setTimeout(() => setVisibleCount((c) => c + 1), 900);
      return () => clearTimeout(t);
    }
  }, [visibleCount]);

  const allVisible = visibleCount >= reasons.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-black text-pink-700 mb-8 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        5 Reasons You Should Say YES 🧾
      </motion.h2>

      <div className="max-w-lg w-full space-y-4 mb-10">
        {reasons.map((reason, i) =>
          i < visibleCount ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -60, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="bg-white/75 backdrop-blur-sm border-2 border-pink-200 rounded-2xl p-4 flex items-center gap-4 shadow-md"
            >
              <span className="text-3xl shrink-0 select-none">{reason.emoji}</span>
              <p className="text-pink-800 font-semibold text-base md:text-lg flex-1">{reason.text}</p>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-green-500 text-xl font-black shrink-0 select-none"
              >
                ✓
              </motion.span>
            </motion.div>
          ) : null
        )}
      </div>

      <AnimatePresence>
        {allVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 35px rgba(236,72,153,0.55)" }}
            whileTap={{ scale: 0.94 }}
            onClick={onContinue}
            className="bg-linear-to-r from-pink-500 to-purple-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-full shadow-xl cursor-pointer"
          >
            Okay okay, just ask me already! 🙈
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Runaway "No" Button ──────────────────────────────────────────────────────
const noMessages = [
  "No 😐",
  "Nope! 😅",
  "Stop it!! 😤",
  "I SAID NO 😡",
  "Please no 🥹",
  "Last chance 😤",
  "...ok fine 🫣",
];

function RunawayButton({
  noCount,
  onNoAttempt,
}: {
  noCount: number;
  onNoAttempt: () => void;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const flee = useCallback(() => {
    onNoAttempt();
    setPos({
      x: (Math.random() - 0.5) * 380,
      y: (Math.random() - 0.5) * 280,
    });
  }, [onNoAttempt]);

  if (noCount >= 7) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-pink-400 text-sm italic mt-2 select-none"
      >
        (The &ldquo;No&rdquo; button has left the chat 👋)
      </motion.p>
    );
  }

  const scale = Math.max(0.25, 1 - noCount * 0.12);

  return (
    <motion.button
      animate={{ x: pos.x, y: pos.y, scale }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      onMouseEnter={flee}
      onTouchStart={flee}
      className="bg-gray-200 text-gray-500 px-8 py-4 rounded-full font-black text-xl border-2 border-gray-300 cursor-pointer select-none"
      style={{ touchAction: "none" }}
    >
      {noMessages[Math.min(noCount, noMessages.length - 1)]}
    </motion.button>
  );
}

// ─── Stage 4: The Question ────────────────────────────────────────────────────
const QUESTION = "Will you marry me? 💍";

function QuestionStage({ onYes }: { onYes: () => void }) {
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [noCount, setNoCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setTyped(QUESTION.slice(0, i));
        if (i >= QUESTION.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 75);
    }, 600);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-pink-500 mb-4 font-bold"
      >
        So...
      </motion.p>

      {/* Typewriter heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-4xl md:text-6xl font-black text-pink-700 mb-12 min-h-20 leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {typed}
        {!typingDone && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-0.5"
          >
            |
          </motion.span>
        )}
      </motion.h1>

      {/* Buttons — appear after typing is done */}
      <AnimatePresence>
        {typingDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* YES */}
              <motion.button
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(236,72,153,0.45)",
                    "0 0 50px rgba(236,72,153,0.85)",
                    "0 0 20px rgba(236,72,153,0.45)",
                  ],
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                onClick={onYes}
                className="bg-linear-to-r from-pink-500 via-rose-500 to-red-400 text-white text-3xl font-black px-16 py-6 rounded-full shadow-2xl cursor-pointer select-none"
              >
                YES! 💍
              </motion.button>

              {/* Runaway NO */}
              <RunawayButton
                noCount={noCount}
                onNoAttempt={() => setNoCount((c) => c + 1)}
              />
            </div>

            <AnimatePresence>
              {noCount > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-400 text-sm font-semibold select-none"
                >
                  Times you tried to click No: {noCount} 😤
                  {noCount >= 4 ? " Really?? Come on! 😭" : ""}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Stage 5: Celebration ─────────────────────────────────────────────────────
const celebrationHearts = ["❤️", "💕", "💖", "💗", "💝", "💘", "🩷", "💞"];

function CelebrationStage() {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    import("canvas-confetti").then(({ default: confetti }) => {
      const end = Date.now() + 7000;
      const colors = ["#ff6b9d", "#ff8e53", "#ffd700", "#a855f7", "#ec4899", "#34d399"];
      const rand = (min: number, max: number) => Math.random() * (max - min) + min;

      interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        const count = 55 * ((end - Date.now()) / 7000);
        confetti({
          particleCount: count,
          spread: 360,
          startVelocity: 30,
          ticks: 60,
          zIndex: 9999,
          colors,
          origin: { x: rand(0.1, 0.3), y: -0.1 },
        });
        confetti({
          particleCount: count,
          spread: 360,
          startVelocity: 30,
          ticks: 60,
          zIndex: 9999,
          colors,
          origin: { x: rand(0.7, 0.9), y: -0.1 },
        });
      }, 240);
    });
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10 py-16"
    >
      <motion.div
        animate={{ scale: [1, 1.35, 1], rotate: [0, -12, 12, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        className="text-7xl md:text-9xl mb-6 select-none"
      >
        💍
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="text-4xl md:text-7xl font-black text-pink-600 mb-4 leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        SHE SAID YES! 🎉
      </motion.h1>

      {/* Bouncing hearts row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-1 text-3xl mb-6 select-none"
      >
        {celebrationHearts.map((char, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -22, 0] }}
            transition={{
              duration: 0.9,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-2xl md:text-3xl text-pink-700 font-black mb-3"
      >
        I love you so much, Babe! 💕
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-lg text-pink-500 max-w-md mb-8 font-semibold"
      >
        From this day forward, I promise to always make you laugh, steal your fries
        (lovingly), and love you with everything I have. 🍟❤️
      </motion.p>

      {/* Love note card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="bg-white/80 backdrop-blur-sm border-2 border-pink-300 rounded-3xl p-6 max-w-sm shadow-xl"
      >
        <p className="text-pink-800 text-lg font-medium italic leading-relaxed">
          &ldquo;You are my favorite adventure, my best friend, and my forever.
          Let&apos;s make it official! 💍&rdquo;
        </p>
        <p className="text-pink-500 mt-3 font-black">— Your favorite human 😊</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-50 to-purple-100 relative overflow-hidden">
      {stage !== "loading" && <FloatingHearts count={20} />}
      {stage === "celebration" && <Sparkles />}

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <LoadingStage key="loading" onComplete={() => setStage("intro")} />
        )}
        {stage === "intro" && (
          <IntroStage key="intro" onContinue={() => setStage("reasons")} />
        )}
        {stage === "reasons" && (
          <ReasonsStage key="reasons" onContinue={() => setStage("question")} />
        )}
        {stage === "question" && (
          <QuestionStage key="question" onYes={() => setStage("celebration")} />
        )}
        {stage === "celebration" && <CelebrationStage key="celebration" />}
      </AnimatePresence>
    </div>
  );
}
