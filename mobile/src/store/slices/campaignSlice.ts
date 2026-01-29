import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import campaignService, {Campaign} from '../../services/campaign.service';

interface CampaignState {
  campaigns: Campaign[];
  activeCampaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  activeCampaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchAll',
  async () => {
    return await campaignService.getCampaigns();
  }
);

export const fetchActiveCampaigns = createAsyncThunk(
  'campaigns/fetchActive',
  async () => {
    return await campaignService.getActiveCampaigns();
  }
);

export const fetchCampaign = createAsyncThunk(
  'campaigns/fetchOne',
  async (id: string) => {
    return await campaignService.getCampaign(id);
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearSelected: state => {
      state.selectedCampaign = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCampaigns.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      .addCase(fetchActiveCampaigns.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCampaigns = action.payload;
      })
      .addCase(fetchActiveCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active campaigns';
      })
      .addCase(fetchCampaign.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaign';
      });
  },
});

export const {clearSelected} = campaignSlice.actions;
export default campaignSlice.reducer;
