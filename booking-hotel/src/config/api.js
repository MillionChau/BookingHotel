const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (process.env.NODE_ENV === 'development') {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5360/api';
    }
    return `http://${hostname}:5360/api`;
  }

  return process.env.REACT_APP_API_URL || `http://${hostname}:5360/api`;
};

if (typeof window !== 'undefined') {
  window.API_BASE_URL = getApiBaseUrl();
}

export const API_BASE_URL =
  typeof window !== 'undefined' ? window.API_BASE_URL : getApiBaseUrl();
