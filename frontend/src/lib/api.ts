import { 
  UserProfile, ClothingItem, OutfitGenerateResponse, SavedOutfit, 
  Product, CartSummary, ChatMessage, TravelPlan, CloudMetrics,
  AgentChatResponse, AgentMemory, FitStudioModel, FitStudioSimulateResponse,
  ShouldIWearResponse, LookComparisonResponse
} from '../types';

const ENV_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_BASE_URL = ENV_BASE.endsWith('/') ? ENV_BASE.slice(0, -1) : ENV_BASE;

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('stylesense_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Normalize path
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullPath = normalizedEndpoint.startsWith('/api') 
    ? `${API_BASE_URL}${normalizedEndpoint}`
    : `${API_BASE_URL}/api${normalizedEndpoint}`;

  try {
    const res = await fetch(fullPath, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit',
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ detail: res.statusText || 'Server Error' }));
      const msg = errorBody.detail || errorBody.message || `Request failed with status ${res.status}`;
      throw new ApiError(msg, res.status, errorBody);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network / CORS failure fallback
    console.error(`API Fetch Error [${options.method || 'GET'} ${fullPath}]:`, err);
    throw new ApiError(err.message || 'Network connection failed', 0);
  }
}

export const api = {
  // Authentication
  async login(email: string, password: string) {
    return request<{ access_token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async signup(full_name: string, email: string, password: string) {
    return request<{ access_token: string; user: UserProfile }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password }),
    });
  },
  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>('/api/auth/me');
  },
  async updatePreferences(prefs: { style_preferences: string[]; favorite_colors: string[]; fashion_goals: string[] }) {
    return request<UserProfile>('/api/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  },

  // Wardrobe
  async getWardrobe(category?: string): Promise<ClothingItem[]> {
    const url = category && category !== 'All' ? `/api/wardrobe?category=${encodeURIComponent(category)}` : '/api/wardrobe';
    return request<ClothingItem[]>(url);
  },
  async addClothing(item: Omit<ClothingItem, 'id' | 'created_at'>): Promise<ClothingItem> {
    return request<ClothingItem>('/api/wardrobe', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  async deleteClothing(id: string): Promise<{ success: boolean }> {
    return request(`/api/wardrobe/${id}`, { method: 'DELETE' });
  },

  // Outfits
  async generateOutfit(params: any): Promise<OutfitGenerateResponse> {
    return request<OutfitGenerateResponse>('/api/outfits/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  async saveOutfit(data: any): Promise<SavedOutfit> {
    return request<SavedOutfit>('/api/outfits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getSavedOutfits(): Promise<SavedOutfit[]> {
    return request<SavedOutfit[]>('/api/outfits');
  },
  async toggleFavorite(outfitId: string): Promise<{ is_favorite: boolean }> {
    return request(`/api/outfits/${outfitId}/favorite`, { method: 'POST' });
  },

  // Chat & AI Stylist
  async sendChat(message: string): Promise<{ reply: string; wardrobe_items_suggested?: any[]; catalog_products_suggested?: any[] }> {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
  async getChatHistory(): Promise<ChatMessage[]> {
    return request<ChatMessage[]>('/api/chat/history');
  },

  // Autonomous Agent
  async agentChat(message: string, alreadyShownIds: string[] = []): Promise<AgentChatResponse> {
    return request<AgentChatResponse>('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ message, already_shown_ids: alreadyShownIds }),
    });
  },
  async getAgentMemory(): Promise<AgentMemory> {
    return request<AgentMemory>('/api/agent/memory');
  },
  async submitAgentFeedback(feedback: { outfit_id: string; rating: number; comments?: string; liked_color?: string; disliked_color?: string }) {
    return request('/api/agent/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },
  async getAgentTools(): Promise<{ tools: { name: string; description: string; category: string }[] }> {
    return request('/api/agent/tools');
  },

  // Products
  async getProducts(
    categoryOrParams?: string | { category?: string; audience?: string; gender?: string; style?: string; search?: string },
    audience?: string,
    search?: string,
    gender?: string
  ): Promise<Product[]> {
    const query = new URLSearchParams();
    if (typeof categoryOrParams === 'object' && categoryOrParams !== null) {
      if (categoryOrParams.category && categoryOrParams.category !== 'All') query.append('category', categoryOrParams.category);
      if (categoryOrParams.audience && categoryOrParams.audience !== 'All') query.append('audience', categoryOrParams.audience);
      if (categoryOrParams.gender && categoryOrParams.gender !== 'All') query.append('gender', categoryOrParams.gender);
      if (categoryOrParams.style && categoryOrParams.style !== 'All') query.append('style', categoryOrParams.style);
      if (categoryOrParams.search) query.append('search', categoryOrParams.search);
    } else {
      if (categoryOrParams && categoryOrParams !== 'All') query.append('category', categoryOrParams);
      if (audience && audience !== 'All') {
        query.append('audience', audience);
        query.append('gender', audience);
      }
      if (gender && gender !== 'All') query.append('gender', gender);
      if (search) query.append('search', search);
    }
    const qs = query.toString();
    return request<Product[]>(qs ? `/api/products?${qs}` : '/api/products');
  },
  async getProduct(id: string): Promise<Product> {
    return request<Product>(`/api/products/${id}`);
  },

  // Cart & Orders
  async getCart(): Promise<CartSummary> {
    return request<CartSummary>('/api/cart');
  },
  async addToCart(productId: string, quantity: number = 1): Promise<CartSummary> {
    return request<CartSummary>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },
  async updateCartItem(cartItemId: string, quantity: number): Promise<CartSummary> {
    return request<CartSummary>(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },
  async updateCartQuantity(cartItemId: string, quantity: number): Promise<CartSummary> {
    return this.updateCartItem(cartItemId, quantity);
  },
  async removeFromCart(cartItemId: string): Promise<CartSummary> {
    return request<CartSummary>(`/api/cart/${cartItemId}`, { method: 'DELETE' });
  },
  async checkout(): Promise<{ success: boolean; transaction_id: string; amount: number; message: string }> {
    return request('/api/cart/checkout', { method: 'POST' });
  },
  async getCartQuote(items: { product_id: string; size?: string; quantity: number }[]): Promise<{
    subtotal: number;
    estimated_tax: number;
    shipping: number;
    total: number;
    item_count: number;
    items_detail: any[];
  }> {
    return request('/api/cart/quote', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  // Travel Assistant
  async packWithAi(data: { destination: string; days: number; purpose: string; expected_weather: string }): Promise<TravelPlan> {
    return request<TravelPlan>('/api/travel/pack', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async virtualTryOn(
    userImageUrl: string, 
    productId?: string, 
    garmentImageUrl?: string,
    garmentTitle?: string,
    garmentCategory?: string
  ): Promise<{
    job_id?: string;
    result_image_url: string;
    status: string;
    is_demo?: boolean;
    provider?: string;
    message?: string;
  }> {
    return request('/api/tryon', {
      method: 'POST',
      body: JSON.stringify({
        user_image: userImageUrl,
        user_image_url: userImageUrl,
        garment_image: garmentImageUrl,
        garment_image_url: garmentImageUrl,
        garment_title: garmentTitle,
        garment_category: garmentCategory,
        product_id: productId
      }),
    });
  },
  async getTryOnJobStatus(jobId: string): Promise<{
    job_id: string;
    result_image_url: string;
    status: string;
    is_demo: boolean;
    provider: string;
  }> {
    return request(`/api/tryon/${jobId}`);
  },

  // Fit Studio
  async getFitStudioModels(): Promise<{ models: FitStudioModel[] }> {
    return request<{ models: FitStudioModel[] }>('/api/fit-studio/models');
  },
  async simulateFitStudio(data: { person_image_url: string; garments: Record<string, any>; model_id?: string; provider?: string }): Promise<FitStudioSimulateResponse> {
    return request<FitStudioSimulateResponse>('/api/fit-studio/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Should I Wear This
  async reviewShouldIWear(data: { items: any[]; occasion: string; destination?: string; weather?: string }): Promise<ShouldIWearResponse> {
    return request<ShouldIWearResponse>('/api/should-i-wear-this', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Compare Looks
  async compareLooks(data: { look_a_name?: string; look_a_items: any[]; look_b_name?: string; look_b_items: any[]; occasion: string }): Promise<LookComparisonResponse> {
    return request<LookComparisonResponse>('/api/compare-looks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Cloud Monitoring
  async getCloudMetrics(): Promise<CloudMetrics> {
    return request<CloudMetrics>('/api/monitor/metrics');
  },
};

export default api;
