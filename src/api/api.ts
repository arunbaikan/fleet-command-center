import axios from "axios";

const API_BASE_URL = "https://m3pmjfgx-3000.inc1.devtunnels.ms/api";

export const fetchCreditReport = (data: { mobileNumber: string }) => 
  axios.post(`${API_BASE_URL}/customer/credit-report`, data);

export const updateCreditReport = (data: any) => 
  axios.post(`${API_BASE_URL}/customer/update-profile`, data);

export const personalDetailsVerification = (data: any) => 
  axios.post(`${API_BASE_URL}/customer/verify-personal`, data);

export const submitFinancialProfileDetails = (data: any) => 
  axios.post(`${API_BASE_URL}/customer/financial-profile`, data);