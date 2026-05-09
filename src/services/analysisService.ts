import api from './api';

export interface Recommendations {
  description: string;
  traitement: string[];
  prevention: string[];
  urgence: 'aucune' | 'faible' | 'moyenne' | 'haute' | 'critique' | 'inconnue';
}

export interface Prediction {
  class: string;
  confidence: number;
  rank: number;
}

export interface AnalysisResult {
  predictions: Prediction[];
  top_prediction: Prediction;
  recommendations: Recommendations; 
}


export interface AnalysisLog {
  id: number;
  user: number;
  user_username: string;
  image: string;
  image_url: string;
  result: AnalysisResult;
  confidence: number;
  processing_time: number;
  created_at: string;
}

export const analysisService = {
  async uploadImage(imageFile: File): Promise<AnalysisLog> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/analysis/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAnalysisHistory(): Promise<AnalysisLog[]> {
    const response = await api.get('/analysis/history/');
    return response.data;
  },

  async getAnalysisDetail(analysisId: number): Promise<AnalysisLog> {
    const response = await api.get(`/analysis/${analysisId}/`);
    return response.data;
  }
};
