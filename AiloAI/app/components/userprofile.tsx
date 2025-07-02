"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return user ? (
    <div>
      <h2>Welcome, {user.name}</h2>
      <a href="/api/auth/logout">Logout</a>
    </div>
  ) : (
    <a href="/api/auth/login">Login</a>
  );
}
