'use client'

import { Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import ReactCalendar from 'react-calendar';

const dentalTips = [
  "Brush your teeth twice a day for a healthy smile!",
  "Floss daily to remove plaque between teeth.",
  "Replace your toothbrush every 3-4 months.",
  "Limit sugary snacks to prevent cavities.",
  "Visit your dentist regularly for checkups.",
  "Drink plenty of water to keep your mouth clean.",
  "Don’t forget to brush your tongue!",
  "Wear a mouthguard when playing sports.",
  "Use fluoride toothpaste for stronger enamel.",
  "A healthy diet supports healthy teeth."
];

function getAppointments() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('smilescope_appointments') || '[]');
}

export default function Home() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<string[]>([]);
  const [tip, setTip] = useState('');

  useEffect(() => {
    setSelectedDate(new Date());
    setAppointments(getAppointments());
    setTip(dentalTips[Math.floor(Math.random() * dentalTips.length)]);
  }, []);

  // useEffect(() => {
  //   if (mounted && !user) {
  //     router.replace('/onboarding');
  //   }
  // }, [user, router, mounted]);

  // if (!mounted || !selectedDate) return null;

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (appointments.includes(dateStr)) {
        return 'highlight-appointment';
      }
    }
    return '';
  }

  function handleCalendarChange(value: Date | Date[] | null) {
    if (Array.isArray(value)) {
      setSelectedDate(value[0] ?? new Date());
    } else if (value instanceof Date) {
      setSelectedDate(value);
    }
  }

  return (
    <div className="flex flex-row min-h-screen bg-[#aedae8] font-nunito">
      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center min-h-screen transition-all duration-300 px-1 md:px-4 py-2 md:py-4">
        <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center transition-all duration-300 mx-auto bg-white rounded-3xl shadow-lg p-3 md:p-6" style={{ boxShadow: '0 2px 16px 0 rgba(28,120,140,0.08)' }}>
          {/* Logo */}
          <div className="flex justify-center mb-2 mt-4">
            <Image src="/logo.svg" alt="Smilescope Logo" width={140} height={60} priority />
          </div>
          {/* Quote */}
          <div className="text-2xl md:text-3xl font-bold text-center mb-4 font-poppins text-[#1c788c]">
          &quot;A confident smile is the best accessory you can wear&quot;
          </div>
          {/* Feature Grid */}
          <div className="w-full flex-1 grid grid-cols-2 grid-rows-2 gap-6 items-center justify-center p-2 md:p-4" style={{maxHeight: '420px'}}>
            {/* Camera Card */}
            <a href="/camera" className="bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-36 md:h-40 text-lg md:text-xl font-bold font-poppins cursor-pointer hover:bg-[#86c4d7] transition shadow-md">
              <Camera size={36} className="mb-1 text-white" />
              CAMERA
            </a>
            {/* Website Card */}
            <a href="https://smilescopebiz.wixsite.com/smilescope-4" target="_blank" rel="noopener noreferrer"
              className="bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-36 md:h-40 text-lg md:text-xl font-bold font-poppins cursor-pointer hover:bg-[#86c4d7] transition shadow-md">
              WEBSITE
            </a>
            {/* Minigame Card */}
            <a href="https://scratch.mit.edu/projects/1061926573" target="_blank" rel="noopener noreferrer"
              className="bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-36 md:h-40 text-lg md:text-xl font-bold font-poppins cursor-pointer hover:bg-[#86c4d7] transition shadow-md">
              MINIGAME
            </a>
            {/* Smile's Note Card */}
            <div className="bg-[#edd1d1] rounded-2xl flex flex-col items-center justify-center h-36 md:h-40 text-lg md:text-xl font-bold font-poppins p-2 text-center shadow-md">
              <div className="mb-1">SMILE'S NOTE</div>
              <div className="text-base font-normal font-nunito">{tip}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel */}
      <div className="w-full md:w-96 flex flex-col items-center px-4 py-8 border-t md:border-t-0 md:border-l border-[#74a8bc] bg-white min-h-screen transition-all duration-300 justify-center">
        {/* User Avatar and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#aedae8] flex items-center justify-center mb-2">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12Zm0 1.5c-3 0-9 1.5-9 4.5V21h18v-3c0-3-6-4.5-9-4.5Z" fill="#1c788c"/></svg>
          </div>
          <div className="text-lg font-bold font-poppins text-[#1c788c]">{user?.username || 'Name'}</div>
        </div>
        {/* Calendar */}
        <div className="w-full bg-[#aedae8] rounded-2xl p-4 flex flex-col items-center shadow-md">
          <div className="text-lg font-bold font-poppins mb-2 text-[#1c788c]">Appointments</div>
          <ReactCalendar
            onChange={(value: any) => handleCalendarChange(value)}
            value={selectedDate}
            tileClassName={tileClassName}
            className="w-full font-nunito rounded-2xl border-none"
          />
          <div className="text-xs font-inter text-[#1c788c] mt-2">Yellow = Appointment</div>
        </div>
      </div>
      <style jsx global>{`
        .highlight-appointment {
          position: relative;
          background: none !important;
          color: #1c788c !important;
          font-weight: bold;
        }
        .highlight-appointment::before {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 32px;
          height: 32px;
          transform: translate(-50%, -50%);
          z-index: 0;
          background: none;
        }
        .highlight-appointment::after {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 28px;
          height: 28px;
          transform: translate(-50%, -50%);
          z-index: 1;
          background: white;
          border: 2px solid #b0b0b0;
          border-radius: 40% 40% 60% 60% / 50% 50% 70% 70%;
          box-shadow: 0 2px 6px 0 rgba(28,120,140,0.04);
        }
        .react-calendar__tile--active {
          background: #e2afaf !important;
          color: #1c788c !important;
        }
        .react-calendar {
          border-radius: 1rem !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}