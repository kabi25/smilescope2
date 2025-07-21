export interface Clinic {
  id: string;
  name: string;
  hours: string;
  address: string;
  logo: string;
  services: string[];
}

export const Clinics: Clinic[] = [
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