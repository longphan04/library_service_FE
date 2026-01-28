import axios from '@/utils/axiosConfig';


const BASE_URL = 'https://pensions-imagination-metadata-waiting.trycloudflare.com';

export const getAuthors = () => axios.get(`${BASE_URL}/author`);
export const getPublishers = () => axios.get(`${BASE_URL}/publisher`);
export const getShelves = () => axios.get(`${BASE_URL}/shelf`);
export const getCategories = () => axios.get(`${BASE_URL}/category`);
export const createBook = (formData) =>
    axios.post('/book', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getBookDetail = (id) =>
    axios.get(`/book/${id}`);

export const uploadImage = (file) =>
    axios.post('/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });


export const updateBook = (id, formData) =>
    axios.put(`/book/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const createAuthor = (data) =>
    axios.post('/author', data);