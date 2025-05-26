import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Helper function to add auth headers
const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const api = {
    // Games
    getGames: () => apiClient.get('/games').then(res => res.data),
    getGame: (id) => apiClient.get(`/games/${id}`).then(res => res.data),
    createGame: (game) => apiClient.post('/games', game).then(res => res.data),

    // Users
    register: (userData) => apiClient.post('/users/register', userData),
    login: (credentials) => apiClient.post('/users/login', credentials),
    getMe: (token) => apiClient.get('/users/me', withAuth(token)),

    // Reviews
    getReviews: (gameId) => apiClient.get(`/games/${gameId}/reviews`).then(res => res.data),
    getAllReviews: () => apiClient.get('/reviews'),
    createReview: (gameId, review, token) =>
        token
            ? apiClient.post('/reviews', review, withAuth(token))
            : apiClient.post(`/games/${gameId}/reviews`, review).then(res => res.data),
    getUserReviews: (userId) => apiClient.get(`/reviews/user/${userId}`),
    deleteReview: (reviewId, token) => apiClient.delete(`/reviews/${reviewId}`, withAuth(token))
};
