import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Helper function to decode JWT and extract user ID
const getUserIdFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || payload.id;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Helper function to add auth headers
const withAuth = (token) => {
    const userId = getUserIdFromToken(token);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'User-ID': userId
        }
    };
};

export const api = {
    // Games
    getGames: () => apiClient.get('/games').then(res => res.data),
    getAllGames: () => apiClient.get('/games').then(res => res.data),
    getGame: (id) => apiClient.get(`/games/${id}`).then(res => res.data),
    createGame: (game) => apiClient.post('/games', game).then(res => res.data),
    createGameComplete: (gameData, token) =>
        apiClient.post('/games', gameData, withAuth(token)).then(res => res.data),
    searchGames: (title) => apiClient.get(`/games/search?title=${title}`).then(res => res.data),
    searchGamesByTitle: (title) => apiClient.get(`/games/search?title=${title}`).then(res => res.data),
    getGamesByGenre: (genre) => apiClient.get(`/games/genre/${genre}`).then(res => res.data),

    // Users
    register: (userData) => apiClient.post('/users/register', userData),
    login: (credentials) => apiClient.post('/users/login', credentials),
    getMe: (token) => apiClient.get('/users/me', withAuth(token)),

    // Reviews
    getReviews: (gameId) => apiClient.get(`/games/${gameId}/reviews`).then(res => res.data),
    getAllReviews: () => apiClient.get('/reviews').then(res => res.data),
    createReview: (reviewRequest, token) =>
        apiClient.post('/reviews', reviewRequest, withAuth(token)).then(res => res.data),
    getUserReviews: (userId) => apiClient.get(`/reviews/user/${userId}`),
    deleteReview: (reviewId, token) => apiClient.delete(`/reviews/${reviewId}`, withAuth(token))
};
