export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // Include cookies for authentication
      });
  
      if (response.status === 401) {
        alert("Unauthorized - Redirecting to login");
        window.location.href = "/auth"; // Redirect to /auth if unauthorized
        return Promise.reject(new Error("Unauthorized - Redirecting to login"));
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json() as Promise<T>;
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  }
  