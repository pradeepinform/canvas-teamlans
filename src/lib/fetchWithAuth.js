// fetchWithAuth.js
export async function fetchWithAuth(endpoint, options = {}) {
  const token = getTokenSomehow(); 

  const res = await fetch(`http://localhost:2000${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    credentials: "include", 
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
