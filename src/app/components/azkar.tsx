import { useState } from "react";
import { Heart, Sunrise as SunriseIcon, Sunset, Moon, Hand } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Zikr {
  id: number;
  text: string;
  count: number;
  reference?: string;
}

interface AzkarCategory {
  id: string;
  title: string;
  icon: any;
  color: string;
  azkar: Zikr[];
}

const AZKAR_DATA: AzkarCategory[] = [
  {
    id: "morning",
    title: "أذكار الصباح",
    icon: SunriseIcon,
    color: "text-amber-500",
    azkar: [
      {
        id: 1,
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ",
        count: 1,
        reference: "رواه مسلم"
      },
      {
        id: 2,
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        count: 1,
        reference: "رواه الترمذي"
      },
      {
        id: 3,
        text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا، وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
        count: 1,
        reference: "رواه أحمد"
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        count: 100,
        reference: "رواه مسلم"
      },
      {
        id: 5,
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 10,
        reference: "رواه البخاري"
      },
      {
        id: 6,
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
        count: 1,
        reference: "رواه ابن ماجه"
      },
      {
        id: 7,
        text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        count: 100,
        reference: "رواه البخاري"
      },
    ]
  },
  {
    id: "evening",
    title: "أذكار المساء",
    icon: Sunset,
    color: "text-orange-500",
    azkar: [
      {
        id: 1,
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا",
        count: 1,
        reference: "رواه مسلم"
      },
      {
        id: 2,
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        count: 1,
        reference: "رواه الترمذي"
      },
      {
        id: 3,
        text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا، وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
        count: 1,
        reference: "رواه أحمد"
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        count: 100,
        reference: "رواه مسلم"
      },
      {
        id: 5,
        text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ، وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
        count: 4,
        reference: "رواه أبو داود"
      },
    ]
  },
  {
    id: "sleep",
    title: "أذكار النوم",
    icon: Moon,
    color: "text-indigo-500",
    azkar: [
      {
        id: 1,
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 2,
        text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
        count: 1,
        reference: "رواه مسلم"
      },
      {
        id: 3,
        text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        count: 3,
        reference: "رواه أبو داود"
      },
      {
        id: 4,
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 5,
        text: "سُبْحَانَ اللَّهِ",
        count: 33,
        reference: "رواه البخاري"
      },
      {
        id: 6,
        text: "الْحَمْدُ لِلَّهِ",
        count: 33,
        reference: "رواه البخاري"
      },
      {
        id: 7,
        text: "اللَّهُ أَكْبَرُ",
        count: 34,
        reference: "رواه البخاري"
      },
    ]
  },
  {
    id: "general",
    title: "أذكار عامة",
    icon: Heart,
    color: "text-rose-500",
    azkar: [
      {
        id: 1,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 2,
        text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 3,
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        count: 1,
        reference: "رواه مسلم"
      },
      {
        id: 5,
        text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        count: 7,
        reference: "رواه أبو داود"
      },
      {
        id: 6,
        text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        count: 1,
        reference: "رواه البخاري"
      },
    ]
  },
  {
    id: "dua",
    title: "أدعية مأثورة",
    icon: Hand,
    color: "text-emerald-500",
    azkar: [
      {
        id: 1,
        text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        count: 1,
        reference: "سورة البقرة"
      },
      {
        id: 2,
        text: "رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي، يَفْقَهُوا قَوْلِي",
        count: 1,
        reference: "سورة طه"
      },
      {
        id: 3,
        text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
        count: 1,
        reference: "سورة آل عمران"
      },
      {
        id: 4,
        text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
        count: 1,
        reference: "رواه البخاري"
      },
      {
        id: 5,
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
        count: 1,
        reference: "رواه ابن ماجه"
      },
    ]
  },
];

export function Azkar() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counters, setCounters] = useState<{ [key: string]: number }>({});

  const handleZikrClick = (categoryId: string, zikrId: number, maxCount: number) => {
    const key = `${categoryId}-${zikrId}`;
    const currentCount = counters[key] || 0;
    const newCount = currentCount + 1;

    if (newCount <= maxCount) {
      setCounters({ ...counters, [key]: newCount });
    } else {
      setCounters({ ...counters, [key]: 0 });
    }
  };

  const getCounter = (categoryId: string, zikrId: number) => {
    const key = `${categoryId}-${zikrId}`;
    return counters[key] || 0;
  };

  const resetCounters = () => {
    setCounters({});
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-4xl arabic-text">الأذكار والأدعية</h1>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory === null ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {AZKAR_DATA.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Icon className={`w-8 h-8 ${category.color}`} />
                      </div>
                    </div>
                    <h3 className="text-2xl arabic-text">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {category.azkar.length} ذكر
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="azkar-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    resetCounters();
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  ← العودة
                </button>
                <button
                  onClick={resetCounters}
                  className="px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                >
                  إعادة تعيين العدادات
                </button>
              </div>

              <div className="space-y-6">
                {AZKAR_DATA.find(c => c.id === selectedCategory)?.azkar.map((zikr, index) => {
                  const currentCount = getCounter(selectedCategory, zikr.id);
                  const progress = (currentCount / zikr.count) * 100;
                  const isComplete = currentCount >= zikr.count;

                  return (
                    <motion.div
                      key={zikr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleZikrClick(selectedCategory, zikr.id, zikr.count)}
                      className={`p-8 rounded-2xl cursor-pointer transition-all ${
                        isComplete
                          ? "bg-primary/10 border-2 border-primary shadow-lg"
                          : "bg-card border border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="mb-6">
                        <p className="text-2xl leading-loose text-right quran-text mb-4">
                          {zikr.text}
                        </p>
                        {zikr.reference && (
                          <p className="text-sm text-muted-foreground text-right">
                            {zikr.reference}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${isComplete ? "bg-primary" : "bg-accent"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          isComplete ? "bg-primary text-primary-foreground" : "bg-secondary"
                        }`}>
                          <span className="tabular-nums">
                            {currentCount} / {zikr.count}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
