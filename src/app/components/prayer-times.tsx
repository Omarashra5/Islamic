import { useState, useEffect } from "react";
import { Clock, MapPin, Bell, BellOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      const interval = setInterval(() => {
        updateNextPrayer();
        checkPrayerNotifications();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes, notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    } else if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchPrayerTimes(30.0444, 31.2357);
        }
      );
    } else {
      fetchPrayerTimes(30.0444, 31.2357);
    }
  };

  const fetchPrayerTimes = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
      );
      const data = await response.json();

      if (data.code === 200) {
        const timings: PrayerTimesData = data.data.timings;
        const prayers: PrayerTime[] = [
          { name: "Fajr", time: timings.Fajr, arabicName: "الفجر" },
          { name: "Sunrise", time: timings.Sunrise, arabicName: "الشروق" },
          { name: "Dhuhr", time: timings.Dhuhr, arabicName: "الظهر" },
          { name: "Asr", time: timings.Asr, arabicName: "العصر" },
          { name: "Maghrib", time: timings.Maghrib, arabicName: "المغرب" },
          { name: "Isha", time: timings.Isha, arabicName: "العشاء" },
        ];

        setPrayerTimes(prayers);
        setLocation(data.data.meta.timezone);
        setDate(data.data.date.hijri.date + " هـ");
        setLoading(false);
      }
    } catch (error) {
      console.error("خطأ في جلب مواعيد الصلاة:", error);
      setLoading(false);
    }
  };

  const updateNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const mainPrayers = prayerTimes.filter(p => p.name !== "Sunrise");

    for (let i = 0; i < mainPrayers.length; i++) {
      const prayer = mainPrayers[i];
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        setNextPrayer(prayer.arabicName);
        const diff = prayerTime - currentTime;
        const hoursLeft = Math.floor(diff / 60);
        const minutesLeft = diff % 60;
        setTimeUntilNext(
          `${hoursLeft > 0 ? hoursLeft + " ساعة و " : ""}${minutesLeft} دقيقة`
        );
        return;
      }
    }

    setNextPrayer(mainPrayers[0].arabicName);
    const [hours, minutes] = mainPrayers[0].time.split(":").map(Number);
    const prayerTime = hours * 60 + minutes;
    const diff = 24 * 60 - currentTime + prayerTime;
    const hoursLeft = Math.floor(diff / 60);
    const minutesLeft = diff % 60;
    setTimeUntilNext(`${hoursLeft} ساعة و ${minutesLeft} دقيقة`);
  };

  const checkPrayerNotifications = () => {
    if (!notificationsEnabled || prayerTimes.length === 0) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const mainPrayers = prayerTimes.filter(p => p.name !== "Sunrise");

    mainPrayers.forEach((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;
      const timeDiff = prayerTime - currentTime;

      if (timeDiff === 5) {
        showNotification(prayer.arabicName, prayer.time);
      }
    });
  };

  const showNotification = (prayerName: string, time: string) => {
    if (Notification.permission === "granted") {
      new Notification(`حان وقت ${prayerName}`, {
        body: `موعد الصلاة في ${time}`,
        icon: "/icon.png",
        badge: "/icon.png",
      });

      toast.success(`حان وقت ${prayerName}`, {
        description: `موعد الصلاة في ${time}`,
      });
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("تم تفعيل الإشعارات");
      } else {
        toast.error("لم يتم منح إذن الإشعارات");
      }
    } else {
      setNotificationsEnabled(false);
      toast.info("تم إيقاف الإشعارات");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل مواعيد الصلاة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <h1 className="text-4xl arabic-text">مواعيد الصلاة</h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className={`p-3 rounded-xl border transition-colors ${
                notificationsEnabled
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/50"
              }`}
              title={notificationsEnabled ? "إيقاف الإشعارات" : "تفعيل الإشعارات"}
            >
              {notificationsEnabled ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-sm text-muted-foreground">{date}</p>
        </motion.div>

        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">الصلاة القادمة</p>
              <h2 className="text-3xl mb-3 arabic-text">{nextPrayer}</h2>
              <p className="text-lg text-muted-foreground">بعد {timeUntilNext}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prayerTimes.map((prayer, index) => {
            const isNext = prayer.arabicName === nextPrayer;
            return (
              <motion.div
                key={prayer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-2xl border transition-all ${
                  isNext
                    ? "bg-primary/10 border-primary shadow-lg scale-105"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="text-center">
                  <h3 className="text-2xl mb-2 arabic-text">{prayer.arabicName}</h3>
                  <p className="text-3xl tabular-nums">
                    {prayer.time}
                  </p>
                  {prayer.name !== "Sunrise" && isNext && (
                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/20 text-xs text-primary">
                      الصلاة القادمة
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
