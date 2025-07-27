import axios from 'axios';

// Cria uma instância do axios com configurações pré-definidas
export const api = axios.create({
  baseURL: 'http://localhost:3000', // O endereço base do nosso backend
});

// Isso é um "interceptor": um código que roda ANTES de cada requisição ser enviada
api.interceptors.request.use(
  (config) => {
    // Pega o token do armazenamento local
    const token = localStorage.getItem('authToken');

    // Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Continua com a requisição
  },
  (error) => {
    return Promise.reject(error);
  }
);