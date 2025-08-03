// export const checkAuthTokens = (): boolean => {
//   const accessToken = localStorage.getItem("accessToken");
//   const refreshToken = localStorage.getItem("refreshToken");

import api from "./api";

//   return Boolean(accessToken && refreshToken);
// };




export async function checkAuthTokens(): Promise<boolean> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token missing.");
    return false;
  }

  try {
    await api.post("/token/verify/", {
      token: accessToken,
    });
    return true;
  } catch (error: any) {
    if (error.response) {
      console.error(
        `Token verification failed: ${error.response.status} - ${error.response.data?.detail || "Unknown error"}`
      );
    } else {
      console.error("Token verification error:", error.message);
    }

    return false;
  }
}
