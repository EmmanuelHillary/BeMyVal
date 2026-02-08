import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import coupleImg from "@/assets/couple.png";
import FallingHearts from "@/components/FallingHearts";
import laughSound from "@/assets/music/laughing-dog-meme_RGJZz7yi.mp3";

const NO_TEXTS = [
  "No 😢",
  "Are you sure? 🥺",
  "Really sure? 💔",
  "Think again My love! 😭",
  "Pls don't do this Darling! 😭💔",
  "Oya nau let me see you try and click No again 😝",
];

// Laughing sound URL
const LAUGH_SOUND_URL = laughSound;

const Index = () => {
  const navigate = useNavigate();
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isRunningAway, setIsRunningAway] = useState(false);
  const [isLaughing, setIsLaughing] = useState(false);
  const [vibrationKey, setVibrationKey] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const laughAudioRef = useRef<HTMLAudioElement | null>(null);
  const firstMovePlayedRef = useRef(false);

  // Initialize laugh audio
  useEffect(() => {
    laughAudioRef.current = new Audio(LAUGH_SOUND_URL);
    laughAudioRef.current.volume = 0.5;
    return () => {
      if (laughAudioRef.current) {
        laughAudioRef.current.pause();
        laughAudioRef.current = null;
      }
    };
  }, []);

  const yesScale = 1 + noCount * 0.2;
  const noText = NO_TEXTS[Math.min(noCount, NO_TEXTS.length - 1)];
  const shouldRunAway = noCount >= 5;

  const getRandomPosition = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 200;
    const buttonHeight = 50;
    const padding = 20;

    const maxX = viewportWidth - buttonWidth - padding;
    const maxY = viewportHeight - buttonHeight - padding;

    const x = padding + Math.random() * (maxX - padding);
    const y = padding + Math.random() * (maxY - padding);

    return { x, y };
  }, []);

  const playLaughOnce = () => {
    if (firstMovePlayedRef.current) return;
    firstMovePlayedRef.current = true;

    if (laughAudioRef.current) {
      laughAudioRef.current.currentTime = 0;
      laughAudioRef.current.play().catch(() => {});
    }
  };

  const playLaughSound = useCallback(() => {
    if (laughAudioRef.current) {
      laughAudioRef.current.currentTime = 0;
      laughAudioRef.current.play().catch(() => {});
    }
  }, []);

  const runAway = useCallback(() => {
    if (!shouldRunAway) return;

    setIsRunningAway(true);
    setIsLaughing(true);
    setVibrationKey((k) => k + 1); // Trigger new vibration animation

    // Play laughing sound
    playLaughSound();

    const newPos = getRandomPosition();
    setNoPosition(newPos);

    // Auto-scroll to follow the button
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(0, newPos.y - window.innerHeight / 2),
        behavior: "smooth",
      });
    }, 100);

    // Stop laughing after animation
    setTimeout(() => {
      setIsLaughing(false);
    }, 800);
  }, [shouldRunAway, getRandomPosition, playLaughSound]);

  const handleNo = useCallback(() => {
    if (noCount < 5) {
      setNoCount((c) => c + 1);
    } else {
      // if (laughAudioRef.current) {
      //   laughAudioRef.current.currentTime = 0;
      //   laughAudioRef.current.play().catch(() => {});
      // }
      runAway();
    }
  }, [noCount, runAway]);

  const handleNoHover = useCallback(() => {
    if (shouldRunAway) {
      runAway();
    }
  }, [shouldRunAway, runAway]);

  const handleYes = () => {
    navigate("/yes");
  };

  // Removed old vibrateAnimation - now using key-based re-render for fresh animation each move

  return (
    <div className="min-h-screen valentine-gradient flex flex-col items-center justify-center relative overflow-hidden px-4">
      <FallingHearts />

      <motion.div
        className="z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={coupleImg}
          alt="Cute couple"
          className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-6 rounded-full border-4 border-primary/30 shadow-lg object-cover"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="text-5xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💌
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-3 leading-tight">
          Will you be my Valentine?
        </h1>

        <p className="text-lg text-muted-foreground mb-10">
          I promise to make you smile every single day 💕
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          {/* YES Button */}
          <motion.button
            onClick={handleYes}
            className="rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-shadow"
            style={
              {
                "--btn-scale": yesScale,
                fontSize: `${1 + noCount * 0.15}rem`,
                padding: `${0.75 + noCount * 0.15}rem ${2 + noCount * 0.3}rem`,
              } as React.CSSProperties
            }
            animate={{
              scale:
                noCount > 0 ? [yesScale, yesScale * 1.08, yesScale] : yesScale,
            }}
            transition={{
              duration: 0.5,
              repeat: noCount > 0 ? Infinity : 0,
              ease: "easeInOut",
            }}
            whileHover={{ scale: yesScale * 1.1 }}
            whileTap={{ scale: yesScale * 0.95 }}
          >
            Yes! 💖
          </motion.button>

          {/* NO Button - Normal position */}
          {!shouldRunAway && (
            <AnimatePresence>
              {noCount < NO_TEXTS.length && (
                <motion.button
                  onClick={handleNo}
                  // onMouseEnter={() => {
                  //   if (noCount === 4 ) playLaughSound();
                  // }}
                  onTouchStart={() => {
                    if (noCount === 4) playLaughSound();
                  }}
                  className="rounded-full bg-secondary text-secondary-foreground font-semibold px-6 py-3 border border-border hover:bg-secondary/80 transition-colors"
                  animate={
                    noPosition.x !== 0 || noPosition.y !== 0 ? noPosition : {}
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  style={{
                    fontSize: `${Math.max(0.7, 1 - noCount * 0.03)}rem`,
                    opacity: Math.max(0.5, 1 - noCount * 0.05),
                  }}
                  whileHover={
                    noCount >= 4
                      ? {
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 100,
                        }
                      : {}
                  }
                >
                  {noText}
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>

        {noCount > 0 && noCount < 5 && (
          <motion.p
            className="mt-6 text-sm text-muted-foreground italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {noCount < 3
              ? "The yes button is calling you... 👀"
              : noCount < 5
                ? "It's growing because it wants you to click it! 🫣"
                : "There's only one right answer here... 😏"}
          </motion.p>
        )}
      </motion.div>

      {/* Escaping NO Button - Fixed position when running away */}
      <AnimatePresence>
        {shouldRunAway && (
          <motion.button
            key={vibrationKey}
            ref={noButtonRef}
            onClick={handleNo}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            className="fixed z-50 rounded-full bg-secondary text-secondary-foreground font-semibold px-6 py-3 border border-border shadow-xl cursor-pointer"
            initial={{ opacity: 1, left: noPosition.x, top: noPosition.y }}
            animate={{
              left: noPosition.x,
              top: noPosition.y,
              x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
              rotate: [0, -8, 8, -8, 8, -5, 5, -2, 2, 0],
            }}
            transition={{
              left: { type: "spring", stiffness: 200, damping: 20 },
              top: { type: "spring", stiffness: 200, damping: 20 },
              x: { duration: 0.3, repeat: 1, ease: "easeInOut" },
              rotate: { duration: 0.3, repeat: 1, ease: "easeInOut" },
            }}
            style={{
              fontSize: "0.9rem",
            }}
          >
            <span className="flex items-center gap-2">
              {noText}
              {isLaughing && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  🤣
                </motion.span>
              )}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {shouldRunAway && (
        <motion.p
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 text-lg text-primary font-semibold z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          
        </motion.p>
      )}
    </div>
  );
};

export default Index;
