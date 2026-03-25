export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  location: string;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  donorProfile?: DonorProfileDTO;
  organizationProfile?: OrganizationProfileDTO;
}

export interface DonorProfileDTO {
  donorType: string;
  totalDonations: number;
  campaignsSupported: number;
  preferredCategories: string[];
}

export interface OrganizationProfileDTO {
  organizationName: string;
  organizationType: string;
  creationYear?: number;
  websiteUrl?: string;
  address?: string;
  mission?: string;
  sectors?: string[];
  rccm?: string;
  taxId?: string;
  legalDocUrl?: string;
  statutesUrl?: string;
  minasAuthUrl?: string;
  assocReceiptUrl?: string;
  rulesInternalUrl?: string;
  registryEntryUrl?: string;
  socialInquiryUrl?: string;
}
