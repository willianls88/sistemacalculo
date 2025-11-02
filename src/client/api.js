// src/client/api.js
import axios from "axios";

// Base URL dinâmica via Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://motoca-production.up.railway.app/api",
  timeout: 10000, // timeout de 10s para detectar falhas de conexão
});

// Intercepta todas as requisições para adicionar token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("pizzaria_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Intercepta respostas para debug
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("⚠️ Resposta de erro do servidor:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("⚠️ Erro de conexão com o servidor:", error.message);
    } else {
      console.error("❌ Erro inesperado na requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

// Debug: confirma qual URL está sendo usada
console.log("API base URL:", import.meta.env.VITE_API_URL);

export default api;
