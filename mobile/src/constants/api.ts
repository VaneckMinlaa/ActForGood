export const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api'
  : 'https://api.actforgood.com/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_USER: (id: string) => `/users/${id}`,
    UPDATE_USER: (id: string) => `/users/${id}`,
  },
  CAMPAIGNS: {
    LIST: '/campaigns',
    ACTIVE: '/campaigns/active',
    GET: (id: string) => `/campaigns/${id}`,
  },
  MATCHING: {
    RECOMMENDATIONS: (donorId: string) => `/matching/recommendations/${donorId}`,
  },
  PAYMENTS: {
    CREATE: '/payments',
    GET: (id: string) => `/payments/${id}`,
    BY_DONOR: (donorId: string) => `/payments/donor/${donorId}`,
    BY_CAMPAIGN: (campaignId: string) => `/payments/campaign/${campaignId}`,
  },
};
