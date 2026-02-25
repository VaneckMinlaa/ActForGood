import {API_ENDPOINTS} from '../Constants/api';
import {Campaign} from '../Models/campaign.model';
import apiService from './api.service';

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
