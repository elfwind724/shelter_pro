
import React from 'react';

export interface CategoryItem {
  id: string;
  label: string;
  value: string; // The English prompt segment
}

export interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  type: 'single' | 'multi';
  required?: boolean;
  items: CategoryItem[];
}

export interface SelectionState {
  [categoryId: string]: string[]; // Array of item IDs
}

export interface Preset {
  id: string;
  name: string;
  selections: SelectionState;
  timestamp: number;
}

export interface SafetyAnalysis {
  score: number;
  feedback: string[];
  psychologicalHooks: string[];
}

export interface AudioLayer {
  layer: string;
  sound: string;
  mixingNotes: string; // e.g., "Low pass filter at 200Hz"
}

export interface ThumbnailDesign {
  textColor: string;
  accentColor: string;
  fontRecommendation: string;
  layoutTip: string;
}

// NEW: Configuration for individual text layers
export interface TextConfig {
  x: number;
  y: number;
  fontSize: number;
}

// NEW: Badge Configuration with Position support
export interface BadgeConfig {
  visible: boolean;
  text: string;
  style: 'box' | 'ribbon_tr' | 'ribbon_tl'; // Box (Standard), Ribbon Top-Right, Ribbon Top-Left
  color: string; // Hex color
  x: number; // For Box: Canvas X. For Ribbon: Offset from corner
  y: number; // For Box: Canvas Y. For Ribbon: Vertical shift/thickness adjustment
  fontSize: number; 
}

// NEW: Wrapper for thumbnail layout state
export interface ThumbnailLayerConfig {
  headline: TextConfig;
  subhead: TextConfig;
  // NEW: Vertical Specific Configs
  verticalHeadline?: TextConfig;
  verticalSubhead?: TextConfig;
  badge: BadgeConfig; 
}

// --- NEW: SHORTS STORYBOARD STRUCTURE ---
export interface ShortsFrame {
  step: number;
  actionDescription: string; // Internal logic
  overlayText: string; // Short viral text for the video
  imagePrompt: string; // The prompt used
  imageUrl?: string; // The generated 9:16 image
}

export interface ShortsStory {
  title: string; // Viral Shorts Title
  description: string; // Short description
  tags: string; // Hashtags
  frames: ShortsFrame[]; // 3 Frames
}

export interface GeneratedContent {
  id: string;
  timestamp: number;
  imagePrompt: string;
  thumbnailPrompt: string; // Dedicated high-contrast prompt for 16:9 covers
  verticalThumbnailPrompt: string; // NEW: Dedicated prompt for 9:16 Shorts covers
  videoPrompt: string; // Legacy T2V prompt
  i2vPrompt: string;   // New: Optimized for Image-to-Video (Veo/Sora)
  
  // DARK MODE VARIANTS
  darkImage?: string; // The generated "Lights Off" image
  darkI2vPrompt?: string; // The motion prompt specifically for the dark image
  
  // SHORTS STORYBOARD
  shortsStory?: ShortsStory; // The generated 3-step narrative

  youtubeTitle: string;
  youtubeDescription: string;
  thumbnailText: string[];
  thumbnailDesign: ThumbnailDesign; // New: visual design guide
  thumbnailConfig?: ThumbnailLayerConfig; // NEW: Position and size data
  tags: string;
  analysis: SafetyAnalysis;
  audioGuide: AudioLayer[]; // New: Sound engineering blueprint
  selectedItems: SelectionState;
  score: number;
  generatedImage?: string; // Base64 string of the AI generated preview (Scene)
  thumbnailImage?: string; // Base64 string of the dedicated viral thumbnail (Cover 16:9)
  verticalThumbnailImage?: string; // NEW: Base64 string of the vertical thumbnail (Cover 9:16)
}

// NEW: Advanced SEO Analytics Data Structure
export interface AnalyticsRecord {
  id: string;
  date: string;
  videoTitle: string; // Can be a specific video or "Monthly Report"
  
  // Core Funnel
  impressions: number;
  ctr: number; // Click Through Rate (%)
  views: number;
  
  // Retention & Growth
  avgDuration: string; // e.g., "04:38"
  regulars: number; // Returning Viewers (Channel Regulars)
  subscribers: number; // New Subs Gained
  
  // Algorithmic Signals (Optional but powerful)
  recommendationRate?: number; // % of views from Browse/Suggested
  deviceTV?: number; // % of views on TV (Crucial for Ambience)
  
  notes?: string; // AI Summary
}

export interface GeneratorOptions {
  selections: SelectionState;
}
