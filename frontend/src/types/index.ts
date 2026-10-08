export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  style_preferences: string[];
  favorite_colors: string[];
  fashion_goals: string[];
  created_at?: string;
}

export interface ClothingItem {
  id: string;
  user_id?: string;
  name: string;
  image_url: string;
  category: string;
  color: string;
  style: string;
  season: string;
  occasion: string;
  formality: string;
  description?: string;
  created_at?: string;
}

export interface ScoreBreakdown {
  occasion_match: number;
  style_compatibility: number;
  color_compatibility: number;
  weather_compatibility: number;
  user_preference_match: number;
  final_score: number;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  items: ClothingItem[];
  compatibility_score: number;
  explanation: string;
  score_breakdown: ScoreBreakdown;
  alternative_suggestion?: string;
}

export interface OutfitGenerateResponse {
  primary_outfit: OutfitRecommendation;
  alternative_outfits: OutfitRecommendation[];
  weather_context: string;
  styling_tips: string[];
}

export interface SavedOutfit {
  id: string;
  name: string;
  occasion: string;
  style: string;
  compatibility_score: number;
  explanation: string;
  is_favorite: boolean;
  created_at: string;
  items: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    color: string;
  }[];
}

export interface SellerOption {
  id: string;
  name: string;
  hub?: string;
  location: string;
  standard_days: number;
  standard_price: number;
  express_days: number;
  express_price: number;
  rating?: number;
  is_in_stock: boolean;
  dispatch_time?: string;
}

export interface Accessory {
  id?: string;
  title: string;
  brand?: string;
  category: 'bag' | 'shoes' | 'jewelry' | 'fragrance' | string;
  image: string;
  price: number;
  reason: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  audience: string;
  gender?: 'men' | 'women' | 'unisex' | string;
  style: string;
  color: string;
  image_url: string;
  brand: string;
  rating: number;
  sellers?: SellerOption[];
  accessories?: Accessory[];
  created_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  estimated_tax: number;
  shipping: number;
  total: number;
  item_count: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at?: string;
  wardrobe_items_suggested?: ClothingItem[];
  catalog_products_suggested?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    brand: string;
  }[];
  provider_used?: string;
}

export interface PackingItem {
  category: string;
  item: string;
  packed: boolean;
}

export interface TravelPlan {
  destination: string;
  duration_days: number;
  weather_notes: string;
  packing_checklist: PackingItem[];
  recommended_outfits: OutfitRecommendation[];
  missing_wardrobe_items: {
    name: string;
    reason: string;
    suggested_price: number;
  }[];
  accessories: string[];
}

export interface CloudMetrics {
  total_api_requests: number;
  ai_recommendation_requests: number;
  active_users: number;
  storage_usage_mb: number;
  average_response_time_ms: number;
  cloud_services_status: Record<string, string>;
  recent_activities: {
    timestamp: string;
    action: string;
    status: string;
    latency: string;
  }[];
}

// Agent & Fit Studio Types
export interface AgentTraceStep {
  step_num: number;
  tool_name: string;
  description: string;
  input_params: Record<string, any>;
  output_summary: string;
  duration_ms: number;
}

export interface AgentChatResponse {
  reply: string;
  intent: string;
  plan_summary: string[];
  traces: AgentTraceStep[];
  final_score: number;
  memory_status: Record<string, any>;
  catalog_products_suggested?: any[];
}

export interface AgentMemory {
  user_id: string;
  preferred_styles: string[];
  preferred_colors: string[];
  avoided_colors: string[];
  body_silhouette_pref: string;
  feedback_count: number;
  last_updated: string;
}

export interface FitStudioModel {
  id: string;
  name: string;
  gender: string;
  image_url: string;
}

export interface FitStudioSimulateResponse {
  result_image_url: string;
  status: string;
  provider: string;
  is_demo: boolean;
  layers_applied: string[];
  score: number;
  breakdown: Record<string, number>;
  feedback: string[];
}

export interface ShouldIWearResponse {
  verdict: string;
  score: number;
  stars: number;
  breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
  elevated_variation?: {
    type: string;
    title: string;
    description: string;
    items: any[];
    projected_score: number;
    score_delta: number;
  };
}

export interface LookComparisonResponse {
  score_a: number;
  score_b: number;
  breakdown_a: Record<string, number>;
  breakdown_b: Record<string, number>;
  winner: string;
  winner_name: string;
  reasoning: string;
  key_differences: string[];
}

