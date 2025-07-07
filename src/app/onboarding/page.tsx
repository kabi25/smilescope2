"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Onboarding - Smilescope',
};

export default function OnboardingPage() {
  const { updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    phone: '',
    country: '',
  });
  const [profilePicture, setProfilePicture] = useState('/default-avatar.png');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...formData, profilePicture });
    router.replace('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to SmileScope!</h1>
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600"
            >
              <span>📷</span>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Get Started
        </button>
      </form>
    </main>
  );
}

// Disable the root layout (and sidebar) for onboarding
export const dynamic = 'force-static'; // Optional: disables SSR for onboarding
export function layout({ children }: { children: React.ReactNode }) {
  return children;
} 