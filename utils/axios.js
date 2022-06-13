import axios from 'axios'

let baseUrl = 'http://localhost:5000/api/v1/';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers:{accept: 'application/json'}
})

export {axiosInstance}