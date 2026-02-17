import axios from "axios";

// Mocking the API calls based on the provided code
export const fetchCreditReport = async (data: { mobileNumber: string }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    data: {
      data: {
        _id: "mock_user_id",
        firstName: "John",
        lastName: "Doe",
        middleName: "Middle",
        dateOfBirth: "1990-01-01T00:00:00Z",
        panCard: "ABCDE1234F",
        emails: [{ email: "john.doe@gmail.com" }],
        uanNumber: "123456789012",
        employmentStatus: "salaried",
        employmentExperience: "5",
        companyName: "Mock Corp",
        monthlyIncome: 50000,
        city: "Mumbai",
        addresses: [
          {
            type: "Residence",
            streetAddress: "123 Mock Street",
            state: "Maharashtra",
            pincode: "400001"
          }
        ],
        cibilScore: 750,
        last6MonthsEnquiryCount: 1,
        settlements: 0,
        emiBounces: 0,
        creaditCardUtilization: 30,
        existingEmi: 5000,
        loanTenure: 24,
        salaryMode: "bank_transfer",
        employmentCategory: "Category A"
      }
    }
  };
};

export const updateCreditReport = async (payload: any) => {
  console.log("Updating credit report with:", payload);
  return { success: true };
};

export const personalDetailsVerification = async (payload: any) => {
  return { success: true };
};

export const submitFinancialProfileDetails = async (payload: any) => {
  return { success: true };
};