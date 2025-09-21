export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/me",
  },

  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },

  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
  },

  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/all",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/download/excel",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};

// Simplified paths for easier use
export const INCOME = "/api/v1/income";
export const EXPENSES = "/api/v1/expense";
export const DASHBOARD = "/api/v1/dashboard";
export const INCOME_DOWNLOAD = "/api/v1/income/downloadexcel";
export const EXPENSES_DOWNLOAD = "/api/v1/expense/download/excel";
