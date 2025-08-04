import axios from "axios";

export const checkAuthTokens = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    return false;
  }

  // Decode JWT without verifying signature to check expiry
  const decodeToken = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
		console.error("Failed to decode token", e);
      return null;
    }
  };

  const accessPayload = decodeToken(accessToken);
  const now = Math.floor(Date.now() / 1000);

  if (!accessPayload || accessPayload.exp < now) {
    try {
      const res = await axios.post("http://localhost:2000/api/v1/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("accessToken", res.data.access);
      return true;
    } catch (err) {
      console.warn("[checkAuthTokens]", err, "Access token expired and refresh failed.");
      return false;
    }
  }

  return true;
};
