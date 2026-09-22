export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'CityAuction';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PROPERTY_CATEGORIES = [
  { value: 'RESIDENTIAL', label: 'Residential', icon: 'Home', slug: 'residential' },
  { value: 'COMMERCIAL', label: 'Commercial', icon: 'Building2', slug: 'commercial' },
  { value: 'INDUSTRIAL', label: 'Industrial', icon: 'Factory', slug: 'industrial' },
  { value: 'AGRICULTURAL', label: 'Agricultural', icon: 'Tractor', slug: 'agricultural' },
  { value: 'LAND', label: 'Land / Plot', icon: 'Map', slug: 'land' },
  { value: 'OTHER', label: 'Other', icon: 'Package', slug: 'other' },
] as const;

export const AUCTION_TYPES = [
  { value: 'SARFAESI', label: 'SARFAESI' },
  { value: 'DRT', label: 'DRT' },
  { value: 'NPA', label: 'NPA' },
  { value: 'FORWARD', label: 'Forward Auction' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const AUCTION_STATUSES = [
  { value: 'UPCOMING', label: 'Upcoming', color: 'info' },
  { value: 'LIVE', label: 'Live', color: 'success' },
  { value: 'CLOSING_SOON', label: 'Closing Soon', color: 'warning' },
  { value: 'CLOSED', label: 'Closed', color: 'neutral' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
  { value: 'SOLD', label: 'Sold', color: 'accent' },
] as const;

export const POSSESSION_STATUSES = [
  { value: 'PHYSICAL', label: 'Physical Possession' },
  { value: 'SYMBOLIC', label: 'Symbolic Possession' },
  { value: 'NOT_IN_POSSESSION', label: 'Not in Possession' },
] as const;

export const BUDGET_RANGES = [
  { value: '0-2000000', label: 'Below ₹20 Lakh' },
  { value: '2000000-5000000', label: '₹20 Lakh - ₹50 Lakh' },
  { value: '5000000-10000000', label: '₹50 Lakh - ₹1 Crore' },
  { value: '10000000-50000000', label: '₹1 Crore - ₹5 Crore' },
  { value: '50000000-', label: 'Above ₹5 Crore' },
] as const;

export const SORT_OPTIONS = [
  { value: 'date_asc', label: 'Auction Date (Soonest)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newly Added' },
  { value: 'closing_soon', label: 'Closing Soon' },
] as const;

export const ITEMS_PER_PAGE = 20;

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const;

import type { NavItem } from '@/types';

export const NAV_LINKS: readonly NavItem[] = [
  { href: '/auctions', label: 'Auctions' },
  { href: '/properties', label: 'Properties', children: [
    { href: '/properties/residential', label: 'Residential' },
    { href: '/properties/commercial', label: 'Commercial' },
    { href: '/properties/industrial', label: 'Industrial' },
    { href: '/properties/agricultural', label: 'Agricultural' },
    { href: '/properties/land', label: 'Land / Plot' },
  ]},
  { href: '/organizations', label: 'Banks & Institutions' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/resources', label: 'Resources', children: [
    { href: '/resources/blog', label: 'Blog' },
    { href: '/resources/guides', label: 'Guides' },
    { href: '/resources/faqs', label: 'FAQs' },
  ]},
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const FILE_UPLOAD_LIMITS = {
  maxDocumentSize: 10 * 1024 * 1024, // 10MB
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;
