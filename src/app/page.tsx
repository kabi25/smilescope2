'use client'

import Link from 'next/link';
import { Camera, Calendar, MessageSquare, ChevronRight, Activity, Users, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/');
  //   }
  // }, [user, router]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Welcome back, Dr. Smith
            </h1>
            <p className="mt-1 text-neutral-500">
              Here&apos;s what&apos;s happening with your dental practice today.
            </p>
          </div>
          <Link href="/settings" className="btn btn-primary">
            View Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    {stat.name}
                  </p>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="ml-2 text-sm font-medium text-success-600">
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-neutral-100 p-3">
                  <Icon className="h-5 w-5 text-neutral-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between">
                  <div>
                    <div className={`inline-flex rounded-lg ${action.color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-neutral-900">
                      {action.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Activity
          </h2>
          <Link href="/activity" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <div className="card divide-y divide-neutral-200">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    New dental scan uploaded
                  </p>
                  <p className="text-sm text-neutral-500">
                    2 hours ago
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}