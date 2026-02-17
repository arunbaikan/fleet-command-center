import axios from "axios";

const API_BASE_URL = "https://m3pmjfgx-3000.inc1.devtunnels.ms/api";

export const fetchCreditReport = async (data: { mobileNumber: string }) => {
  return axios.post(`${API_BASE_URL}/customer/credit-report`, data);
};

export const updateCreditReport = async (data: any) => {
  return axios.post(`${API_BASE_URL}/customer/update-profile`, data);
};

export const personalDetailsVerification = async (data: any) => {
  return axios.post(`${API_BASE_URL}/customer/verify-details`, data);
};

export const submitFinancialProfileDetails = async (data: any) => {
  return axios.post(`${API_BASE_URL}/customer/financial-profile`, data);
};