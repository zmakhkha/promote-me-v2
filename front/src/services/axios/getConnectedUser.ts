import { USerProfile } from "@/components/auth/types";
import api from "./api";

// Function to get the connected user's profile
export const getConnectedUser = async (): Promise<USerProfile> => {
  try {
    const response = await api.get("/profile/"); // Make a GET request to /profile endpoint
    console.log(
      "------------------------+++---------------------User data fetched:",
      response.data
    );

    return response.data; // Return the user's data from the response
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
