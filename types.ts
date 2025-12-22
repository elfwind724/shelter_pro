
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

// NEW: Wrapper for thumbnail layout state
export interface ThumbnailLayerConfig {
  headline: TextConfig;
  subhead: TextConfig;
}

export interface GeneratedContent {
  id: string;
  timestamp: number;
  imagePrompt: string;
  videoPrompt: string; // Legacy T2V prompt
  i2vPrompt: string;   // New: Optimized for Image-to-Video (Veo/Sora)
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
  generatedImage?: string; // Base64 string of the AI generated preview
  thumbnailImage?: string; // Base64 string of the composited thumbnail
}

export interface GeneratorOptions {
  selections: SelectionState;
}
