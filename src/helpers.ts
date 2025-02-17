import { User as Auth0User } from "@auth0/auth0-react";
import { User as ourUser, User } from "./types";
import { config } from "./config";

export const createOrUpdateUser = async (
  auth0User: Auth0User | undefined,
  accessToken: string,
  formData: { username: string; display_name: string; email: string },
): Promise<void> => {
  try {
    const response = await fetch(`${config.API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...formData,
        id: auth0User?.sub,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create or update user");
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<ourUser | null> => {
  try {
    const response = await fetch(`${config.API_URL}/api/users/${id}`);

    // Log the response status and headers
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    const data = await response.json();

    // Log the entire data response
    console.log("Response Data:", data);

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch user");
    }

    if (!data.data) {
      return null;
    }

    return {
      id: data.data.id,
      username: data.data.username,
      displayName: data.data.display_name,
      avatarUrl: data.data.avatar_url,
      createdAt: data.data.created_at,
      email: data.data.email,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const isProfileComplete = async (
  userId: string,
  accessToken?: string,
): Promise<boolean> => {
  try {
    // Input validation
    if (!userId) {
      console.warn("isProfileComplete: No userId provided");
      return false;
    }

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if access token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Make API request
    const response = await fetch(`${config.API_URL}/api/users/${userId}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.info("isProfileComplete: User not found");
        return false;
      }
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      console.warn("isProfileComplete: API returned success: false");
      return false;
    }
    if (!data.data) {
      return false;
    }

    const user = data.data as User;
    const isComplete = Boolean(
      user.id &&
        user.username?.trim() &&
        user.displayName?.trim() &&
        user.email?.trim(),
    );

    console.debug(
      `isProfileComplete: Profile ${isComplete ? "is" : "is not"} complete`,
    );

    return isComplete;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};
