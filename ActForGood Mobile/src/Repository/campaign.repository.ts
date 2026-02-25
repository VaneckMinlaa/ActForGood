import {Campaign} from '../Models/campaign.model';
import campaignService from '../Service/campaign.service';

class CampaignRepository {
  async getCampaigns(): Promise<Campaign[]> {
    return await campaignService.getCampaigns();
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return await campaignService.getActiveCampaigns();
  }

  async getCampaign(id: string): Promise<Campaign> {
    return await campaignService.getCampaign(id);
  }
}

export default new CampaignRepository();
