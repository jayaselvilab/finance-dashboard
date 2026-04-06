import axios from 'axios';

// ✅ FIXED: Using the 'qp4r' URL that is connected to your MongoDB
const API = axios.create({ 
    baseURL: 'https://finance-dashboard-qp4r.onrender.com' 
});

export const fetchRecords = () => API.get('/api/records'); 
export const createRecord = (data) => API.post('/api/records', data);


























