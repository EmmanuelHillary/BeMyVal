import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import loveSong from "@/assets/music/love.mp3";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Attempt to auto-play immediately when component mounts
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        try {
          await audioRef.current.play();
          setPlaying(true);
        } catch (error) {
          // Autoplay was prevented by browser, wait for user interaction
          const handleInteraction = async () => {
            if (audioRef.current && !playing) {
              try {
                await audioRef.current.play();
                setPlaying(true);
              } catch (e) {}
            }
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
          };
          document.addEventListener("click", handleInteraction);
          document.addEventListener("keydown", handleInteraction);
          
          return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
          };
        }
      }
    };
    
    attemptAutoplay();
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src={loveSong}
      />
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/30 transition-all"
        aria-label={playing ? "Mute music" : "Play music"}
      >
        {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
};

export default MusicPlayer;