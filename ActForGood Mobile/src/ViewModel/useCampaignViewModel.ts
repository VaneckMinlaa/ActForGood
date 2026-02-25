import {create} from 'zustand';
import {Campaign} from '../Models/campaign.model';
import campaignRepository from '../Repository/campaign.repository';

interface CampaignState {
  campaigns: Campaign[];
  activeCampaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;

  fetchCampaigns: () => Promise<void>;
  fetchActiveCampaigns: () => Promise<void>;
  fetchCampaign: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useCampaignViewModel = create<CampaignState>(set => ({
  campaigns: [],
  activeCampaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    set({loading: true, error: null});
    try {
      const campaigns = await campaignRepository.getCampaigns();
      set({loading: false, campaigns});
    } catch (err: any) {
      set({loading: false, error: err.message || 'Failed to fetch campaigns'});
    }
  },

  fetchActiveCampaigns: async () => {
    set({loading: true, error: null});
    try {
      const activeCampaigns = await campaignRepository.getActiveCampaigns();
      set({loading: false, activeCampaigns});
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch active campaigns',
      });
    }
  },

  fetchCampaign: async (id: string) => {
    set({loading: true, error: null});
    try {
      const selectedCampaign = await campaignRepository.getCampaign(id);
      set({loading: false, selectedCampaign});
    } catch (err: any) {
      set({loading: false, error: err.message || 'Failed to fetch campaign'});
    }
  },

  clearSelected: () => set({selectedCampaign: null}),
}));
