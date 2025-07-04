import { Campaign } from "@/types/campaign";

const STORAGE_KEY = 'linkedin-automation-campaigns';

export const storageService = {
  getCampaigns(): Campaign[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return [];
    }
  },

  saveCampaign(campaign: Campaign): void {
    try {
      const campaigns = this.getCampaigns();
      const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
      
      if (existingIndex >= 0) {
        campaigns[existingIndex] = campaign;
      } else {
        campaigns.push(campaign);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  },

  deleteCampaign(campaignId: string): void {
    try {
      const campaigns = this.getCampaigns();
      const filtered = campaigns.filter(c => c.id !== campaignId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  },

  getCampaignById(campaignId: string): Campaign | null {
    const campaigns = this.getCampaigns();
    return campaigns.find(c => c.id === campaignId) || null;
  }
};