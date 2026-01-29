export interface MatchScore {
  campaignId: string;
  campaignTitle: string;
  score: number;
  reason: string;
  factors: MatchFactors;
}

export interface MatchFactors {
  preferenceMatch: number;
  locationMatch: number;
  urgencyScore: number;
  impactScore: number;
  budgetMatch: number;
}
