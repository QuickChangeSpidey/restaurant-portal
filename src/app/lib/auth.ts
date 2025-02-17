import AWS from "aws-sdk";

// Ensure AWS SDK is properly configured
AWS.config.update({ region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-2" });

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Function to check if the user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("authToken"); // Example using localStorage
  }
  return false;
}

// Function to get user info from Cognito
export const getUserInfo = async () => {
  if (typeof window === "undefined") {
    console.error("getUserInfo cannot be called on the server-side");
    return null;
  }

  const accessToken = localStorage.getItem("authToken");
  
  if (!accessToken) {
    console.error("No access token found in localStorage");
    return null;
  }

  const params = {
    AccessToken: accessToken
  };

  try {
    const userData = await cognitoIdentityServiceProvider.getUser(params).promise();
    console.log("User Data:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};


export const deleteUser = async () => {
  try {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) throw new Error("User is not authenticated");

    await cognitoIdentityServiceProvider.deleteUser({ AccessToken: accessToken }).promise();
    alert("Account deleted successfully");
    localStorage.removeItem("authToken");
    window.location.href = "/"; // Redirect to home page
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Failed to delete account. Please try again.");
  }
}
