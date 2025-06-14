import { getAccessToken, getRefreshToken, storeToken, clearTokens } from './storage';

export const fetchWithAuth = async (url, options = {}) => {
  const token = await getAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // if unauthorized, try refresh
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      throw new Error('Session expired');
    }
  }

  return response;
};

const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  const response = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (data.token) {
    await storeToken(data.token, refreshToken);
    return data.token;
  }

  await clearTokens();
  return null;
};

