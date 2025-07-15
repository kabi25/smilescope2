"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

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

const clinics: Clinic[] = [
  {
    id: 'alpha',
    name: 'Alpha Dental Specialists Centre/Pusat Pakar Pergigian Alpha Dental',
    hours: 'Mon-Sun 9AM - 6PM',
    address: '7 (Ground Floor), Jalan Serampang, Taman Sri Tebrau, 80050 Johor Bahru, Johor.',
    logo: '/alpha-dental-logo.jpg',
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
    logo: '/smilecv-logo.jpg',
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Clinic Selection */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map(clinic => (
            <div key={clinic.id} className={`border rounded-lg p-6 shadow-sm bg-white transition-all duration-200 flex flex-col items-center ${selectedClinic?.id === clinic.id ? 'ring-2 ring-blue-500' : ''}`}> 
              <div className="w-24 h-24 mb-3 relative">
                <Image src={clinic.logo} alt={clinic.name + ' logo'} fill style={{objectFit:'contain'}} className="rounded" />
              </div>
              <h2 className="text-xl font-bold mb-1 text-center">{clinic.name}</h2>
              <div className="text-sm mb-2 text-center"><b>Address:</b> {clinic.address}</div>
              <button
                className={`mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${selectedClinic?.id === clinic.id ? 'opacity-70' : ''}`}
                onClick={() => handleClinicSelect(clinic.id)}
                disabled={selectedClinic?.id === clinic.id}
              >
                {selectedClinic?.id === clinic.id ? 'Selected' : 'Select'}
              </button>
              {/* Expanded details if selected */}
              {selectedClinic?.id === clinic.id && (
                <div className="w-full mt-4">
                  <div className="text-sm mb-1"><b>Consultation Hours:</b> {clinic.hours}</div>
                  <div className="mb-2">
                    <b>Services:</b>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 mt-1"
                      value={selectedService}
                      onChange={e => setSelectedService(e.target.value)}
                      required
                    >
                      <option value="">Select a service</option>
                      {clinic.services.map((service, idx) => (
                        <option key={idx} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show the rest of the form only if a clinic and service are selected */}
        {selectedClinic && selectedService && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Appointment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        required
                        value={form.time}
                        onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Reason for Visit
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Concern *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.reason}
                        onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Tooth pain, cavity, cleaning"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <div className="flex space-x-4">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <label key={level} className="flex items-center">
                            <input
                              type="radio"
                              name="urgency"
                              value={level}
                              checked={form.urgency === level}
                              onChange={(e) => setForm(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                              className="mr-2"
                            />
                            <span className="capitalize">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional information or symptoms..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgency Indicator */}
            {form.reason && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Visit Summary</h3>
                <div className={`p-3 rounded-lg border flex items-center space-x-2 ${getUrgencyColor(form.urgency)}`}>
                  {getUrgencyIcon(form.urgency)}
                  <span className="font-medium capitalize">{form.urgency} Priority</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {form.urgency === 'high' && 'We recommend scheduling as soon as possible.'}
                  {form.urgency === 'medium' && 'We\'ll schedule you within the next few days.'}
                  {form.urgency === 'low' && 'Regular appointment scheduling applies.'}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">appointments@smilescope.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.href = '/camera'}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                >
                  📸 Take Dental Photo
                </button>
                <button
                  onClick={() => window.location.href = '/smilechat'}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                >
                  💬 Chat with AI Assistant
                </button>
                <button
                  onClick={() => window.location.href = '/informations'}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                >
                  📚 Dental Information
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
} 