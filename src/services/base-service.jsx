import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";

export async function fetchWithAuth(endpoint, options = {}) {
  let session = await getSession();

  if (!session || !session.idToken) {
    console.error("No valid session or idToken found");
    throw new Error("Not authenticated");
  }

  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        ...options.headers,
         "Content-Type": "application/json",
      },
      data: options.body,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed", error);
    throw error;
  }
}
