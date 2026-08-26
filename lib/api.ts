export async function fetcher(url: string, method = "GET", body?: any) {
    const token = localStorage.getItem("admin-token");
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (!res.ok) {
      throw new Error("API request failed");
    }
    return res.json();
  }
  