import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";

export async function fetchWithAuth(endpoint, options = {}) {
  const session = await getSession();

  if (!session || !session.idToken) {
    console.warn("Session or ID token not found:", session);
    throw new Error("Not authenticated or missing ID token");
  }

  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        ...options.headers,
      },
      data: options.body,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed", error.response?.data || error.message);
    throw new Error("API request failed");
  }
}
