import { apiRequest } from "../config/api";

const authService = {
  async resetPassword(token, newPassword) {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }
};

export default authService;

