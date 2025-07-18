"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  notes: string;
}

interface Clinic {
  id: string;
  name: string;
  hours: string;
  address: string;
  logo: string;
  services: string[];
}

export const clinics: Clinic[] = [
  {
    id: 'alpha',
    name: 'Alpha Dental Specialists Centre/Pusat Pakar Pergigian Alpha Dental',
    hours: 'Mon-Sun 9AM - 6PM',
    address: '7 (Ground Floor), Jalan Serampang, Taman Sri Tebrau, 80050 Johor Bahru, Johor.',
    logo: '/alpha dental.jpg',
    services: [
      'Braces by Specialist',
      'Clear Aligner Invisalign by Specialist',
      'Root Canal Treatment by Specialist',
      'Gum Treatment',
      '3D Intraoral Scanning',
      'Same-Day Crown by Specialist',
      'Ceramic Crown & Bridge by Specialist',
      'Veneers by Specialist',
      'Teeth Whitening',
      'Minor Oral Surgery',
      'Wisdom Tooth Surgery',
      'Dentures by Specialist',
      'Dental Implant by Specialist',
      'Laser Treatment',
      'Children Dentistry',
      'Preventive Treatment',
      'Tooth Filling',
      'Scaling & Polishing',
      'Tooth Extraction',
    ],
  },
  {
    id: 'smilecv',
    name: 'SmileCV Dental Clinic',
    hours: 'Sunday- Friday 8AM - 7PM\nSaturdays and Public Holidays are closed',
    address: '100, St Mary Street, Convent, 81100 Johor Bahru, Johor.',
    logo: '/cvDental.jpg',
    services: [
      'Teeth Whitening',
      'Minor Oral Surgery',
      'Wisdom Tooth Surgery',
      'Dentures by Specialist',
      'Dental Implant by Specialist',
      'Laser Treatment',
      'Children Dentistry',
      'Preventive Treatment',
      'Tooth Filling',
      'Scaling & Polishing',
      'Tooth Extraction',
    ],
  },
];

function saveAppointment(date: string) {
  const appointments = JSON.parse(localStorage.getItem('smilescope_appointments') || '[]');
  if (!appointments.includes(date)) {
    appointments.push(date);
    localStorage.setItem('smilescope_appointments', JSON.stringify(appointments));
  }
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [form, setForm] = useState<AppointmentForm>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    urgency: 'low',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedService, setSelectedService] = useState('');

  // Get URL parameters for pre-filled data from SmileChat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    const urgency = urlParams.get('urgency') as 'low' | 'medium' | 'high';
    
    if (reason) {
      setForm(prev => ({
        ...prev,
        reason: decodeURIComponent(reason),
        urgency: urgency || 'low'
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    saveAppointment(form.date); // Save to calendar
    setIsSubmitted(true);
  };

  const handleClinicSelect = (clinicId: string) => {
    setSelectedClinic(clinics.find(c => c.id === clinicId) || null);
    setSelectedService('');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#aedae8] flex items-center justify-center p-4 font-nunito">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#faf8c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="#1c788c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="#1c788c" strokeWidth="2"/></svg>
          </div>
          <h2 className="text-2xl font-bold font-poppins text-[#1c788c] mb-2">Appointment Scheduled!</h2>
          <p className="text-[#1c788c] mb-6 font-nunito">
            Your appointment has been saved to the calendar.
          </p>
          <div className="space-y-3 text-left bg-[#aedae8] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[#1c788c] font-inter">Date:</span>
              <span className="font-bold font-poppins text-[#1c788c]">{form.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1c788c] font-inter">Time:</span>
              <span className="font-bold font-poppins text-[#1c788c]">{form.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1c788c] font-inter">Reason:</span>
              <span className="font-bold font-poppins text-[#1c788c]">{form.reason}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/smilechat'}
            className="mt-6 w-full bg-[#1c788c] text-white py-3 px-4 rounded-lg font-poppins font-bold hover:bg-[#74a8bc] transition-colors"
          >
            Back to SmileChat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Appointment</h1>
        <div className="flex flex-col gap-8">
          {clinics.map((clinic, idx) => (
            <div key={clinic.id}>
              <div
                className="bg-white border border-gray-200 rounded-3xl flex flex-row items-center w-full py-8 px-6 shadow-md cursor-pointer hover:bg-[#eaf6fa] transition"
                onClick={() => router.push(`/appointments/${clinic.id}`)}
              >
                <div className={`${idx === 0 ? 'w-28 h-28 p-3' : 'w-24 h-24'} flex items-center justify-center bg-white overflow-hidden mr-8`}>
                  <Image src={clinic.logo} alt={clinic.name + ' logo'} width={idx === 0 ? 112 : 96} height={idx === 0 ? 112 : 96} className="object-contain" />
                </div>
                <div className="flex flex-col items-start justify-center flex-1">
                  <div className="text-2xl font-bold text-[#1c788c] mb-1">{clinic.name}</div>
                  <div className="text-lg text-gray-700">{clinic.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 