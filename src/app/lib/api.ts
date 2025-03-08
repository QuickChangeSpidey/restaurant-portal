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
      if (response.status === 500) {
        alert("Something went wrong:" + response.statusText);
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

  export async function apiFileUpload<T>(url: string, options: any, file?: File): Promise<T> {
    try {
      // Create FormData to send with the request
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }

      const response = await fetch(url, {
        ...options,
        method: "POST",
        body: formData,  
        credentials: "include", 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json() as Promise<T>;
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  }
  
  
  