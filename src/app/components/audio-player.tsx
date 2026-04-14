import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl: string;
  ayahText: string;
  surahName: string;
  ayahNumber: number;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  autoPlay?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function AudioPlayer({
  audioUrl,
  ayahText,
  surahName,
  ayahNumber,
  onEnded,
  onNext,
  onPrevious,
  autoPlay = false,
  hasNext = false,
  hasPrevious = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, autoPlay]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (onEnded) {
      onEnded();
    }
  };

  const handleDownload = async () => {
    try {
      toast.info("جاري تحميل الآية...");

      const response = await fetch(audioUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('فشل التحميل');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${surahName.replace(/\s+/g, '-')}-آية-${ayahNumber}.mp3`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast.success("تم تحميل الآية بنجاح!");
    } catch (error) {
      console.error('خطأ في التحميل:', error);

      toast.error("حدث خطأ في التحميل. جاري المحاولة بطريقة بديلة...");

      try {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = audioUrl;
        a.download = `${surahName.replace(/\s+/g, '-')}-آية-${ayahNumber}.mp3`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success("تم فتح رابط التحميل");
      } catch (fallbackError) {
        console.error('خطأ في الطريقة البديلة:', fallbackError);
        toast.error("عذراً، لم نتمكن من تحميل الملف");
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="relative h-1 bg-secondary">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={`p-2 rounded-lg transition-colors ${
                hasPrevious
                  ? "hover:bg-secondary text-foreground"
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
              title="الآية السابقة"
            >
              <SkipForward className="w-5 h-5 rotate-180" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              disabled={!hasNext}
              className={`p-2 rounded-lg transition-colors ${
                hasNext
                  ? "hover:bg-secondary text-foreground"
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
              title="الآية التالية"
            >
              <SkipBack className="w-5 h-5 rotate-180" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMute}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{surahName} - آية {ayahNumber}</p>
            <p className="text-xs text-muted-foreground truncate quran-text">{ayahText}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="تحميل الآية"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
