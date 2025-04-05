import { useUser } from '@/lib/contexts/userHooks';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const WelcomeGreeting = () => {
  const { user, loading } = useUser(); // Get user data from our context
  const [timeOfDay, setTimeOfDay] = useState('');
  const name = useMemo(() => {
    return loading ? ["Pengguna"] : (user?.name || "Pengguna").split(" ");
  }, [user, loading]);

  const { t } = useTranslation();

  useEffect(() => {
    const getTimeOfDayGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 12) {
        return 'Evening';
      } else {
        return 'Morning';
      }
    };

    setTimeOfDay(getTimeOfDayGreeting());
  }, []);

  return (
    <div className="md:w-full lg:w-full flex flex-col gap-2 relative z-20">
      <div className="mb-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border">
        <h2 className="text-xl font-medium text-muted-foreground">{t("morning_or_night", { time: t(timeOfDay) })}, {name.map((part, index) => <span key={index} className='text-blue-600 font-bold'> {part}</span>)} {t("to")}</h2>
        <p className="text-3xl font-bold tracking-tight montserratBold break-words">
          {t("tvet_program_title")}
        </p>
      </div>
      <h1 className="!text-xl font-bold tracking-tight montserratBold">{t("welcome_message")}</h1>
      <p className="text-muted-foreground">{t("welcome_desc")}</p>
    </div>
  );
}