import { User as Auth0User } from "@auth0/auth0-react";
import { User as ourUser } from "./types";
import { config } from "./config";

export const createOrUpdateUser = async (
  auth0User: Auth0User | undefined,
  accessToken: string,
  formData: { username: string; display_name: string; email: string }
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
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch user");
    }

    console.log("data.data", data.data);

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

export const isProfileComplete = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  const response = await fetch(`${config.API_URL}/api/users/${userId}`);
  const data = await response.json();
  console.log("!!data.data", !!data.data);
  return !!data.data;
};
