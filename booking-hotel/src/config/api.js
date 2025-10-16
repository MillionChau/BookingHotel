const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    const isNetworkAccess = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
    
    if (isNetworkAccess) {
      return `http://${window.location.hostname}:5360`;
    }
    return 'http://localhost:5360';
  }
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();