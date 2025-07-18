'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { clinics } from '../page';

export default function ClinicBookingPage() {
  const router = useRouter();
  const { clinicId } = useParams();
  const clinic = clinics.find((c: { id: string }) => c.id === clinicId);
  const [selectedService, setSelectedService] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!clinic) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">Clinic not found</div>;
  }

  function toLocalDateString(date: string) {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  function saveAppointment(date: string) {
    const dateStr = toLocalDateString(date);
    const appointments = JSON.parse(localStorage.getItem('smilescope_appointments') || '[]');
    if (!appointments.includes(dateStr)) {
      appointments.push(dateStr);
      localStorage.setItem('smilescope_appointments', JSON.stringify(appointments));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    saveAppointment(form.date);
    // Save booking details for calendar
    const all = JSON.parse(localStorage.getItem('smilescope_booking_details') || '{}');
    const dateStr = toLocalDateString(form.date);
    all[dateStr] = {
      clinic: clinic.name,
      service: selectedService,
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time: form.time,
      notes: form.notes,
    };
    localStorage.setItem('smilescope_booking_details', JSON.stringify(all));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#faf8c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="#1c788c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="#1c788c" strokeWidth="2"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1c788c] mb-2">Appointment Booked!</h2>
          <p className="text-[#1c788c] mb-6">Your appointment at {clinic.name} is confirmed.</p>
          <button onClick={() => router.push('/appointments')} className="mt-4 bg-[#1c788c] text-white font-bold rounded-lg px-6 py-3 hover:bg-[#74a8bc] transition">Back to Appointments</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/appointments')} className="mb-6 text-blue-500 hover:underline">&larr; Back to clinics</button>
        <div className="flex flex-row items-center gap-6 mb-8">
          <Image src={clinic.logo} alt={clinic.name + ' logo'} width={96} height={96} className="object-contain rounded-xl" />
          <div>
            <div className="text-2xl font-bold text-[#1c788c] mb-1">{clinic.name}</div>
            <div className="text-lg text-gray-700">{clinic.address}</div>
            <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">{clinic.hours}</div>
          </div>
        </div>
        <div className="mb-8">
          <div className="text-lg font-bold text-[#1c788c] mb-2">Choose a Service</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clinic.services.map((service: string) => (
              <button
                key={service}
                className={`px-4 py-2 rounded-lg border font-medium transition ${selectedService === service ? 'bg-[#1c788c] text-white border-[#1c788c]' : 'bg-white text-[#1c788c] border-[#aedae8] hover:bg-[#eaf6fa]'}`}
                onClick={() => setSelectedService(service)}
                type="button"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
        {selectedService && (
          <form onSubmit={handleSubmit} className="bg-[#eaf6fa] rounded-2xl p-6 flex flex-col gap-4 shadow">
            <div className="text-xl font-bold text-[#1c788c] mb-2">Book {selectedService}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="tel"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Phone"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                required
              />
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                required
              />
            </div>
            <textarea
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional Notes (optional)"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
            <button
              type="submit"
              className="mt-4 bg-[#1c788c] text-white font-bold rounded-lg px-6 py-3 hover:bg-[#74a8bc] transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 