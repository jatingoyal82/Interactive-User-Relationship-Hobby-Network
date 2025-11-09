import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
  popularityScore: number;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    username: string;
    age: number;
    hobbies: string[];
    popularityScore: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CreateUserData {
  username: string;
  age: number;
  hobbies?: string[];
}

export interface UpdateUserData {
  username?: string;
  age?: number;
  hobbies?: string[];
}

// User API
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  link: async (id: string, friendId: string): Promise<{ user: User; friend: User }> => {
    const response = await api.post(`/users/${id}/link`, { friendId });
    return response.data.data;
  },

  unlink: async (id: string, friendId: string): Promise<{ user: User; friend: User }> => {
    const response = await api.delete(`/users/${id}/unlink`, { data: { friendId } });
    return response.data.data;
  },
};

// Graph API
export const graphApi = {
  getGraphData: async (): Promise<GraphData> => {
    const response = await api.get('/graph');
    return response.data.data;
  },
};

export default api;

