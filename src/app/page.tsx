'use client'

import { Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useContext } from 'react';

const quickActions = [
  {
    name: 'Take Photo',
    description: 'Capture new dental images',
    href: '/camera',
    icon: Camera,
    color: 'bg-blue-500',
  },
  {
    name: 'Book Appointment',
    description: 'Schedule your next visit',
    href: '/appointments',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    name: 'Chat with AI',
    description: 'Get instant dental advice',
    href: '/smilechat',
    icon: MessageSquare,
    color: 'bg-purple-500',
  },
];

const stats = [
  {
    name: 'Total Scans',
    value: '156',
    change: '+12%',
    trend: 'up',
    icon: Activity,
  },
  {
    name: 'Dentist Network',
    value: '50+',
    change: '+5',
    trend: 'up',
    icon: Users,
  },
  {
    name: 'Patient Rating',
    value: '4.9',
    change: '+0.2',
    trend: 'up',
    icon: Star,
  },
];

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

function getBookingDetails(dateStr: string) {
  if (typeof window === 'undefined') return null;
  const all = JSON.parse(localStorage.getItem('smilescope_booking_details') || '{}');
  return all[dateStr] || null;
}

function toLocalDateString(date: Date) {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d < today;
}

export default function Home() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<string[]>([]);
  const [tip, setTip] = useState('');
  // Get sidebar collapsed state from context or prop if available
  // Remove: const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  // In the Smile's Note card, always show the label for now (or use a global context if you want dynamic behavior).

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
      const dateStr = toLocalDateString(date);
      if (appointments.includes(dateStr) && !isPastDate(date)) {
        return 'highlight-appointment';
      }
    }
    return '';
  }

  function handleCalendarChange(value: Date | (Date | null)[] | null) {
    if (Array.isArray(value)) {
      // react-calendar can return [Date | null, Date | null] for ranges
      const firstDate = value.find((d): d is Date => d instanceof Date);
      setSelectedDate(firstDate ?? new Date());
    } else if (value instanceof Date) {
      setSelectedDate(value);
    }
  }

  const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : '';
  const bookingDetails = mounted && selectedDateStr ? getBookingDetails(selectedDateStr) : null;

  // Placeholder for sidebar collapsed state (replace with context/prop if available)
  const sidebarCollapsed = true; // Set to false to simulate expanded

  return (
    <div className="flex flex-row min-h-screen max-h-screen overflow-hidden bg-[#aedae8] font-nunito">
      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center min-h-screen transition-all duration-300 px-1 md:px-4 py-2 md:py-4">
        <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center transition-all duration-300 mx-auto bg-white rounded-3xl shadow-lg p-3 md:p-6" style={{ boxShadow: '0 2px 16px 0 rgba(28,120,140,0.08)' }}>
          {/* Logo */}
          <div className="flex justify-center mb-2 mt-2">
            <Image src="/smilescope.jpeg" alt="Smilescope Logo" width={340} height={170} priority />
          </div>
          {/* Quote */}
          <div className="text-2xl md:text-3xl font-bold text-center mb-2 font-poppins text-[#1c788c]" style={{marginTop: '-1.5rem'}}>
            "A confident smile is the best accessory you can wear."
          </div>
          {/* Feature Grid */}
          <div className="w-full flex-1 flex items-center justify-center" style={{minHeight: '220px'}}>
            <div className={`grid grid-cols-2 grid-rows-2 gap-4 place-items-center`}>
              {/* AI Camera Card */}
              <button onClick={() => router.push('/camera')} className={`bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-20 md:h-24 ${sidebarCollapsed ? 'w-56 md:w-64' : 'w-40 md:w-48'} cursor-pointer hover:bg-[#86c4d7] transition shadow-md`}>
                <Camera size={48} className="text-white" />
              </button>
              {/* Smilescope Website Card */}
              <a href="https://smilescopebiz.wixsite.com/smilescope-4" target="_blank" rel="noopener noreferrer" className={`bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-20 md:h-24 ${sidebarCollapsed ? 'w-56 md:w-64' : 'w-40 md:w-48'} cursor-pointer hover:bg-[#86c4d7] transition shadow-md`}>
                <Laptop size={48} className="text-white" />
              </a>
              {/* Minigame Card */}
              <a href="https://scratch.mit.edu/projects/1061926573" target="_blank" rel="noopener noreferrer" className={`bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-20 md:h-24 ${sidebarCollapsed ? 'w-56 md:w-64' : 'w-40 md:w-48'} cursor-pointer hover:bg-[#86c4d7] transition shadow-md`}>
                <Gamepad2 size={48} className="text-white" />
              </a>
              {/* Smile's Note Card */}
              <div className={`bg-[#74a8bc] rounded-2xl flex flex-col items-center justify-center h-20 md:h-24 ${sidebarCollapsed ? 'w-56 md:w-64' : 'w-40 md:w-48'} cursor-default shadow-md p-0`}>
                <div className="mb-1 text-base md:text-lg font-bold font-poppins text-white">SMILE'S NOTE</div>
                <div className="text-xs md:text-sm font-normal font-nunito text-white px-2" style={{lineHeight:1.2, maxWidth:'90%'}}>{tip}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mounted && (
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
              tileContent={({ date, view }) => {
                const dateStr = toLocalDateString(date);
                if (view === 'month' && appointments.includes(dateStr) && !isPastDate(date)) {
                  return (
                    <span style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 36,
                    }}>
                      <img src="/tooth.png" alt="Tooth" style={{position:'absolute', left:'50%', top:'50%', width:40, height:44, objectFit:'contain', zIndex:1, transform:'translate(-50%, -50%)'}} />
                      <span style={{position:'relative', zIndex:2}}>{date.getDate()}</span>
                    </span>
                  );
                }
                return null;
              }}
            />
            <div className="text-xs font-inter text-[#1c788c] mt-2">Tooth = Appointment</div>
            {bookingDetails && (
              <div className="mt-4 w-full bg-white rounded-xl p-4 shadow text-left">
                <div className="text-base font-bold text-[#1c788c] mb-2">Booking Details</div>
                <div><span className="font-semibold">Clinic:</span> {bookingDetails.clinic}</div>
                <div><span className="font-semibold">Service:</span> {bookingDetails.service}</div>
                <div><span className="font-semibold">Name:</span> {bookingDetails.name}</div>
                <div><span className="font-semibold">Email:</span> {bookingDetails.email}</div>
                <div><span className="font-semibold">Phone:</span> {bookingDetails.phone}</div>
                <div><span className="font-semibold">Date:</span> {bookingDetails.date}</div>
                <div><span className="font-semibold">Time:</span> {bookingDetails.time}</div>
                {bookingDetails.notes && <div><span className="font-semibold">Notes:</span> {bookingDetails.notes}</div>}
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx global>{`
        .highlight-appointment {
          position: relative;
          background: none !important;
          color: #1c788c !important;
          font-weight: bold;
        }
        .highlight-appointment::before,
        .highlight-appointment::after {
          display: none !important;
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