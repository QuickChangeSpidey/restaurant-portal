export function isAuthenticated(): boolean {
    // Placeholder: Replace this with actual auth logic (JWT, cookies, session, etc.)
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("authToken"); // Example using localStorage
    }
    return false;
  }
  