import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, 
  withCredentials: true                    
});

// 2️⃣  Generic wrapper
export const apiConnector = (
  method = 'GET',
  url = '/',           
  bodyData = null,
  headers = {},
  params = {}
) =>
  axiosInstance({
    method,
    url,               
    data: bodyData,
    headers,
    params
  });
