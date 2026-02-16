export interface Campaign {
  id?: string;
  organizationId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  region: string;
  targetAmount: number;
  currentAmount?: number;
  donorCount?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  images?: string[];
  documents?: string[];
}
