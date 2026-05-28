const API_BASE_URL = 'https://localhost:7017/api';


const api = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            ...options.headers
        },
        ...options
    };

    const response = await fetch(url, config);
    if (response.status === 401) {
        window.location.href = '/login'; // редирект в случае если пользователь не авторизован
    }
    return response;
};

export default api;