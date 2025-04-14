export const setItemWithExpiry = (key, value, ttlInSeconds) => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttlInSeconds * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    return null;
  }
};

export const setAuthTokens = (accessToken, refreshToken, user) => {
  setItemWithExpiry("access_token", accessToken, 3600); // 1 hour
  setItemWithExpiry("refresh_token", refreshToken, 86400); // 24 hours
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => getItemWithExpiry("access_token");
export const getRefreshToken = () => getItemWithExpiry("refresh_token");
export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
