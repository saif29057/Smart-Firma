import api from './api';

export interface Article {
  title: string;
  description?: string;
  content?: string;
  author?: string;
  source?: string;
  url: string;
  image_url?: string;
  published_at: string;
}

export interface NewsResponse {
  total_results: number;
  articles: Article[];
  category: string;
  country: string;
}

export interface Category {
  value: string;
  label: string;
}

export const newsService = {
  async getNews(category: string = 'general', country: string = 'fr', pageSize: number = 20): Promise<NewsResponse> {
    const params = { category, country, page_size: pageSize };
    const response = await api.get('/news/', { params });
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/news/categories/');
    return response.data.categories;
  }
};
