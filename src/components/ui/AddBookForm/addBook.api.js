import axios from 'axios';

const BASE = 'http://10.0.5.101:3000';

export const getAuthors = () => axios.get(`${BASE}/author`);
export const getPublishers = () => axios.get(`${BASE}/publisher`);
export const getShelves = () => axios.get(`${BASE}/shelf`);
export const createBook = (formData) =>
    axios.post(`${BASE}/book`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });