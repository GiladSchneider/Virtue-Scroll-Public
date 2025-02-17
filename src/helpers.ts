import { User as Auth0User } from "@auth0/auth0-react";
import { User as ourUser, User } from "./types";
import { config } from "./config";

export const getIdFromSub = (sub: string | undefined): string => {
  return sub ? sub.split("|")[1] : "";
}

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
        id: getIdFromSub(auth0User?.sub),
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
      display_name: data.data.display_name,
      avatar_url: data.data.avatar_url,
      created_at: data.data.created_at,
      email: data.data.email,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const isProfileComplete = async (
  userId: string,
): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }

    const response = await fetch(`${config.API_URL}/api/users/${userId}`, {
      method: "GET",
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
    console.log("isProfileComplete: User data:", user);
    const isComplete = Boolean(
      user.id &&
        user.username?.trim() &&
        user.display_name?.trim() &&
        user.email?.trim(),
    );

    console.log(
      `isProfileComplete: Profile ${isComplete ? "is" : "is not"} complete`,
    );

    return isComplete;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};
