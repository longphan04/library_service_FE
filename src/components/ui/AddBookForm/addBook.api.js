import axios from 'axios';

const BASE_URL = 'http://10.0.5.101:3000';

export const getAuthors = () => axios.get(`${BASE_URL}/author`);
export const getPublishers = () => axios.get(`${BASE_URL}/publisher`);
export const getShelves = () => axios.get(`${BASE_URL}/shelf`);
export const getCategories = () => axios.get(`${BASE_URL}/category`);
export const createBook = (formData) =>
    axios.post(`${BASE_URL}/book`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getBookDetail = (id) =>
    axios.get(`${BASE_URL}/book/${id}`);

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const uploadImage = (file) =>
    axios.post(`${BASE_URL}/upload`, file, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });


export const updateBook = (id, formData) =>
    axios.put(`${BASE_URL}/book/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const createAuthor = (data) =>
    axios.post(`${BASE_URL}/author`, data);