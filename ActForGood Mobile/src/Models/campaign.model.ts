export interface Campaign {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  region: string;
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  status: string;
  urgency: string;
  startDate: string;
  endDate: string;
  images: string[];
}
