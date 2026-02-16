import apiService from './api.service';
import {API_ENDPOINTS} from '../Constants/api';

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

class CampaignService {
  async getCampaigns(): Promise<Campaign[]> {
    return await apiService.get<Campaign[]>(API_ENDPOINTS.CAMPAIGNS.LIST);
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return await apiService.get<Campaign[]>(API_ENDPOINTS.CAMPAIGNS.ACTIVE);
  }

  async getCampaign(id: string): Promise<Campaign> {
    return await apiService.get<Campaign>(API_ENDPOINTS.CAMPAIGNS.GET(id));
  }
}

export default new CampaignService();
