import axios from 'axios';

// API基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// 创建axios实例
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 类型定义
export interface Drama {
  _id: string;
  title: string;
  description: string;
  poster: string;
  category: string;
  tags: string[];
  rating: number;
  viewCount: number;
  duration: number;
  episodeCount: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  releaseDate: string;
  director?: string;
  isHot: boolean;
  isNew: boolean;
  videoUrls: string[];
  cast?: string[];
  commentCount?: number;
  favoriteCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  dramaCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  profile: {
    nickname?: string;
    bio?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    location?: string;
  };
  preferences: {
    favoriteGenres: string[];
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      newDramas: boolean;
      recommendations: boolean;
    };
  };
  stats: {
    totalWatchTime: number;
    dramasWatched: number;
    favoritesCount: number;
    commentsCount: number;
  };
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  query: string;
  total: number;
  items: Array<{
    id: string;
    type: 'drama' | 'user' | 'category';
    title: string;
    description?: string;
    thumbnail?: string;
    score: number;
    highlights?: string[];
    metadata?: any;
  }>;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
  suggestions?: string[];
  executionTime: number;
}

export interface RecommendationResult {
  type: string;
  items: Array<{
    drama: Drama;
    score: number;
    reason: string;
    type: string;
  }>;
  total: number;
  userId?: string;
  generatedAt: string;
  algorithm: string;
  executionTime: number;
}

export interface RankingResult {
  type: string;
  category?: string;
  items: Array<{
    rank: number;
    drama: Drama;
    score: number;
    change: number;
    metrics: {
      viewCount: number;
      rating: number;
      commentCount: number;
      favoriteCount: number;
    };
  }>;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
}

// API方法
export const dramaApi = {
  // 获取短剧列表
  getList: (params?: any) => api.get<{ data: Drama[] }>('/dramas', { params }),
  
  // 获取短剧详情
  getById: (id: string) => api.get<{ data: Drama }>(`/dramas/${id}`),
  
  // 获取热门短剧
  getHot: (limit?: number) => api.get<{ data: Drama[] }>('/dramas/hot', { params: { limit } }),
  
  // 获取最新短剧
  getNew: (limit?: number) => api.get<{ data: Drama[] }>('/dramas/new', { params: { limit } }),
  
  // 获取趋势短剧
  getTrending: (limit?: number) => api.get<{ data: Drama[] }>('/dramas/trending', { params: { limit } }),
};

export const categoryApi = {
  // 获取分类列表
  getList: () => api.get<{ data: Category[] }>('/categories'),
  
  // 获取分类统计
  getStats: () => api.get<{ data: any }>('/categories/stats'),
};

export const authApi = {
  // 用户登录
  login: (data: { email: string; password: string }) => 
    api.post<{ data: { user: User; accessToken: string; expiresIn: number } }>('/auth/login', data),
  
  // 用户注册
  register: (data: { username: string; email: string; password: string; confirmPassword: string; nickname?: string }) =>
    api.post<{ data: { user: User; accessToken: string; expiresIn: number } }>('/auth/register', data),
  
  // 获取用户信息
  getProfile: () => api.get<{ data: User }>('/auth/profile'),
  
  // 用户登出
  logout: () => api.post('/auth/logout'),
  
  // 检查用户名可用性
  checkUsername: (username: string) => api.get<{ data: { available: boolean } }>(`/auth/check-username/${username}`),
  
  // 检查邮箱可用性
  checkEmail: (email: string) => api.get<{ data: { available: boolean } }>(`/auth/check-email/${email}`),
};

export const searchApi = {
  // 搜索
  search: (params: { q: string; [key: string]: any }) => 
    api.get<{ data: SearchResult }>('/search', { params }),
  
  // 获取搜索建议
  getSuggestions: (q: string) => 
    api.get<{ data: string[] }>('/search/suggestions', { params: { q } }),
  
  // 获取热门搜索
  getPopular: (limit?: number) => 
    api.get<{ data: Array<{ keyword: string; count: number; trend: string }> }>('/search/popular', { params: { limit } }),
  
  // 获取推荐
  getRecommendations: (type: string, params?: any) => 
    api.get<{ data: RecommendationResult }>(`/search/recommendations/${type}`, { params }),
  
  // 获取个性化推荐
  getPersonalized: (params?: any) => 
    api.get<{ data: RecommendationResult }>('/search/recommendations/personalized/me', { params }),
  
  // 获取相似推荐
  getSimilar: (dramaId: string, params?: any) => 
    api.get<{ data: RecommendationResult }>(`/search/recommendations/similar/${dramaId}`, { params }),
  
  // 获取榜单
  getRanking: (type: string, params?: any) => 
    api.get<{ data: RankingResult }>(`/search/rankings/${type}`, { params }),
  
  // 获取用户偏好
  getPreferences: () => api.get('/search/preferences'),
  
  // 更新用户偏好
  updatePreferences: (data: { dramaId: string; action: string }) => 
    api.post('/search/preferences', data),
};

export default api;
