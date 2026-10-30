// Search & filter types
export interface AuctionFilters {
  state?: string;
  city?: string;
  district?: string;
  category?: string;
  subType?: string;
  auctionType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minEmd?: number;
  maxEmd?: number;
  dateFrom?: string;
  dateTo?: string;
  deadlineBefore?: string;
  organization?: string;
  possession?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// UI types
export type ViewMode = 'grid' | 'list';

export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Auction card display type
export interface AuctionCardData {
  id: string;
  auctionNumber: string;
  title: string;
  slug: string;
  categoryName: string;
  categoryType: string;
  city: string;
  state: string;
  organizationName: string;
  organizationLogo: string | null;
  reservePrice: string;
  emd: string;
  startDateTime: string;
  endDateTime: string;
  submissionDeadline: string;
  auctionType: string;
  status: string;
  possessionStatus: string;
  primaryImage: string | null;
  isFavourited?: boolean;
  sourceListingId?: string | null;
  sourceVerifiedAt?: string | null;
}

export interface OrganizationCardData {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo: string | null;
  activeAuctionCount: number;
}

export interface CategoryCardData {
  name: string;
  slug: string;
  type: string;
  icon: string;
  auctionCount: number;
}

export interface DetailedAuction extends AuctionCardData {
  address: string;
  description: string;
  area: number;
  areaUnit: string;
  inspectionDate: string;
  contactOfficerName: string;
  contactOfficerPhone: string;
  contactOfficerEmail: string;
  terms: string;
  bidIncrement: string;
  images: string[];
  documents: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  organization: {
    name: string;
    slug: string;
    type: string;
    logo: string | null;
    phone: string;
    email: string;
    website: string;
  };
}
