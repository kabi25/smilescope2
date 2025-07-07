"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

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
    setIsSubmitted(true);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Appointment Scheduled!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully scheduled. We'll send you a confirmation email with all the details.
          </p>
          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{form.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{form.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reason:</span>
              <span className="font-medium">{form.reason}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/smilechat'}
            className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">
            Schedule your dental appointment with ease. We'll get back to you to confirm the details.
          </p>
        </div>

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
      </div>
    </div>
  );
} 