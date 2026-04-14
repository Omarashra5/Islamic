import { useState, useEffect } from "react";
import { BookOpen, Search, PlayCircle, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AudioPlayer } from "./audio-player";
import { toast } from "sonner";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

const RECITERS = [
  { id: "ar.alafasy", name: "مشاري العفاسي", value: "ar.alafasy" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", value: "ar.minshawi" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)", value: "ar.abdulbasitmurattal" },
  { id: "ar.abdullahbasfar", name: "عبد الله بصفر", value: "ar.abdullahbasfar" },
  { id: "ar.husary", name: "محمود خليل الحصري", value: "ar.husary" },
  { id: "ar.husarymujawwad", name: "محمود خليل الحصري (مجود)", value: "ar.husarymujawwad" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري", value: "ar.shaatree" },
];

export function QuranReader() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[1].value);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      setSurahs(data.data);
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب السور:", error);
      setLoading(false);
    }
  };

  const fetchSurahWithAudio = async (surahNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter}`
      );
      const data = await response.json();

      const ayahsWithAudio = data.data.ayahs.map((ayah: any) => ({
        number: ayah.number,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        audio: ayah.audio || ayah.audioSecondary?.[0] || ""
      }));

      setAyahs(ayahsWithAudio);
      setSelectedSurah(surahNumber);
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب السورة:", error);
      setLoading(false);
    }
  };

  const handleAyahClick = (ayah: Ayah) => {
    setCurrentAyah(ayah);
    setIsPlayingFullSurah(false);
  };

  const handlePlayFullSurah = () => {
    if (ayahs.length > 0) {
      setCurrentAyah(ayahs[0]);
      setIsPlayingFullSurah(true);
      toast.success("بدء تشغيل السورة كاملة");
    }
  };

  const handleDownloadFullSurah = async () => {
    if (!selectedSurah || ayahs.length === 0) return;

    const surahName = getCurrentSurahName();
    const reciterName = RECITERS.find(r => r.value === selectedReciter)?.name || "القارئ";

    const result = window.confirm(
      `هل تريد تحميل جميع آيات ${surahName}؟\n` +
      `العدد: ${ayahs.length} آية\n` +
      `القارئ: ${reciterName}\n\n` +
      `سيتم تحميل كل آية في ملف منفصل`
    );

    if (!result) return;

    toast.info(`جاري تحميل ${ayahs.length} آية...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < ayahs.length; i++) {
      const ayah = ayahs[i];

      try {
        const response = await fetch(ayah.audio, {
          method: 'GET',
          mode: 'cors',
        });

        if (!response.ok) throw new Error('فشل التحميل');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = `${surahName.replace(/\s+/g, '-')}-${reciterName.replace(/\s+/g, '-')}-آية-${ayah.numberInSurah}.mp3`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
        }, 100);

        successCount++;

        if ((i + 1) % 5 === 0) {
          toast.info(`تم تحميل ${i + 1} من ${ayahs.length} آية`);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`خطأ في تحميل الآية ${ayah.numberInSurah}:`, error);
        failCount++;
      }
    }

    if (failCount === 0) {
      toast.success(`تم تحميل السورة بنجاح! (${successCount} آية)`);
    } else {
      toast.warning(`تم تحميل ${successCount} آية، فشل ${failCount} آية`);
    }
  };

  const handleNextAyah = () => {
    if (!currentAyah) return;
    const currentIndex = ayahs.findIndex(a => a.number === currentAyah.number);
    if (currentIndex < ayahs.length - 1) {
      setCurrentAyah(ayahs[currentIndex + 1]);
    }
  };

  const handlePreviousAyah = () => {
    if (!currentAyah) return;
    const currentIndex = ayahs.findIndex(a => a.number === currentAyah.number);
    if (currentIndex > 0) {
      setCurrentAyah(ayahs[currentIndex - 1]);
    }
  };

  const handleAudioEnded = () => {
    if (!currentAyah) return;
    const currentIndex = ayahs.findIndex(a => a.number === currentAyah.number);
    if (currentIndex < ayahs.length - 1) {
      setCurrentAyah(ayahs[currentIndex + 1]);
    } else {
      setCurrentAyah(null);
      if (isPlayingFullSurah) {
        setIsPlayingFullSurah(false);
        toast.success("انتهت تلاوة السورة");
      }
    }
  };

  const getCurrentAyahIndex = () => {
    if (!currentAyah) return -1;
    return ayahs.findIndex(a => a.number === currentAyah.number);
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentSurahName = () => {
    const surah = surahs.find(s => s.number === selectedSurah);
    return surah ? surah.name : "";
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl arabic-text">القرآن الكريم</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن سورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <select
              value={selectedReciter}
              onChange={(e) => {
                setSelectedReciter(e.target.value);
                if (selectedSurah) {
                  fetchSurahWithAudio(selectedSurah);
                }
              }}
              className="px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {RECITERS.map((reciter) => (
                <option key={reciter.id} value={reciter.value}>
                  {reciter.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedSurah === null ? (
            <motion.div
              key="surahs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredSurahs.map((surah, index) => (
                <motion.button
                  key={surah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchSurahWithAudio(surah.number)}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all text-right"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg text-primary">{surah.number}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <h3 className="text-2xl arabic-text mb-1">{surah.name}</h3>
                      <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</span>
                    <span>{surah.numberOfAyahs} آية</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="ayahs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSurah(null);
                    setAyahs([]);
                    setCurrentAyah(null);
                    setIsPlayingFullSurah(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  ← العودة للسور
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlayFullSurah}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>تشغيل السورة كاملة</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadFullSurah}
                  className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل السورة كاملة</span>
                </motion.button>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <div className="text-center mb-8 pb-6 border-b border-border">
                  <h2 className="text-3xl arabic-text mb-2">{getCurrentSurahName()}</h2>
                  <p className="text-sm text-muted-foreground">
                    القارئ: {RECITERS.find(r => r.value === selectedReciter)?.name}
                  </p>
                  {isPlayingFullSurah && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        جاري تشغيل السورة كاملة
                      </span>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ayahs.map((ayah, index) => (
                      <motion.div
                        key={ayah.number}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleAyahClick(ayah)}
                        className={`p-6 rounded-xl cursor-pointer transition-all ${
                          currentAyah?.number === ayah.number
                            ? "bg-primary/10 border-2 border-primary shadow-md"
                            : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-accent">{ayah.numberInSurah}</span>
                          </div>
                          <p className="flex-1 text-xl leading-loose text-right quran-text">
                            {ayah.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {currentAyah && (
          <AudioPlayer
            audioUrl={currentAyah.audio}
            ayahText={currentAyah.text}
            surahName={getCurrentSurahName()}
            ayahNumber={currentAyah.numberInSurah}
            onEnded={handleAudioEnded}
            onNext={handleNextAyah}
            onPrevious={handlePreviousAyah}
            hasNext={getCurrentAyahIndex() < ayahs.length - 1}
            hasPrevious={getCurrentAyahIndex() > 0}
            autoPlay={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
