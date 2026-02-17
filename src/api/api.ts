import axios from "axios";

const API_BASE_URL = "https://m3pmjfgx-3000.inc1.devtunnels.ms/api/customer";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const fetchCreditReport = async (payload) => {
  const resp = await apiClient.post("/fetch-credit-report", payload);

  console.log("Response for credit report", resp);
  return resp;
};
export const updateCreditReport = async (payload) => {
  const resp = await apiClient.post("/update-credit-report", payload);
  console.log("Response for credit report", resp);
  return resp;
};

export const personalDetailsVerification = async (data: any) => {
  return axios.post(`${API_BASE_URL}/customer/verify-details`, data);
};

export const submitFinancialProfileDetails = async (data: any) => {
  return axios.post(`${API_BASE_URL}/customer/financial-profile`, data);
};

export const sendOtpToMobile = async (payload) => {
  const resp = await apiClient.post("/send-otp-to-mobile", payload);
  return resp;
};


export const verifyOtpApi = async (payload) => {
  const resp = await apiClient.post("/validate-otp", payload);
  console.log(resp, "resp");
  return resp;
};
export const fetchEligibleLoanProducts = async () => {
  const mobile = sessionStorage.getItem("mobile_number")
  const resp = await apiClient.post("/provisional-credit-assesment", {
    mobileNumber: mobile
  })
  return resp
}