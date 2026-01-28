import axios from '@/utils/axiosConfig';

export const getAuthors = () => axios.get('/author');
export const getPublishers = () => axios.get('/publisher');
export const getShelves = () => axios.get('/shelf');
export const getCategories = () => axios.get('/category');
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
    axios.post('/author/', data);