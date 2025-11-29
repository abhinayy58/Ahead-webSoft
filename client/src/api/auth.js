import { request } from "./client";

export const authKeys = {
  me: ["auth", "me"],
};

export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser() {
  try {
    return await request("/auth/me");
  } catch (error) {
    if (error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

