
export interface Outcome {
  id: string;
  label: string;
  price: number; // in cents (0-100)
  odds: number; // Decimal odds
  betCount: number; // Number of bettors
  betCountPercentage: number; // % of bettors
  totalAmount: number; // Total amount bet
  totalAmountPercentage: number; // % of total amount
  color?: string;
  image?: string; // Team/Participant logo
  groupName?: string; // Optional: Grouping for multi-question markets
  isBookmakerSide?: boolean; // NEW: Explicitly mark if this specific outcome is the bookmaker's position
  myPosition?: number; // NEW: The amount the current user has bet on this outcome
}

export interface Market {
  id: string;
  title: string;
  league: string;
  description?: string;
  image: string; // Background image or fallback
  teamHomeImage?: string; // Optional: specific home team logo
  teamAwayImage?: string; // Optional: specific away team logo
  endDate: string; // Should include time
  outcomes: Outcome[];
  volume: number; // USD
  isUserCreated: boolean;
  createdBy?: string;
  bookmakerSideId?: string; // ID of the outcome locked by the bookmaker (Main/Default)
  isBookmarked?: boolean;
  hasBet?: boolean;
}

export enum SportCategory {
  ALL = '全部体育',
  BASKETBALL = '篮球',
  FOOTBALL = '足球',
  TENNIS = '网球',
  BASEBALL = '棒球',
  ESPORTS = '电竞'
}

export interface User {
  id: string;
  username: string;
  balance: number;
}
