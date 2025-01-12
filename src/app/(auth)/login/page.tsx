"use client";

import { useAuthStore } from "@/store/Auth";
import React from "react";

function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //collect data
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    //validation
    if (!email || !password) {
      setError(() => "Please fill in all fields");
      return;
    }

    //handle loaing and error
    setIsLoading(() => true);
    setError(() => "");

    //login -> store
    const loginResponse = await login(email, password);

    if (loginResponse.error) {
      setError(() => loginResponse.error!.message);
    }

    setIsLoading(() => false);
  };
  return <div>LoginPage</div>;
}

export default LoginPage;
