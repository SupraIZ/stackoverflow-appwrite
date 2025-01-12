"use client";

import { useAuthStore } from "@/store/Auth";
import React from "react";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //collect data
    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    //validation
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError(() => "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    setIsLoading(() => true);
    setError(() => "");

    //register -> store
    const response = await createAccount(
      `${firstname} ${lastname}`,
      email.toString(),
      password.toString()
    );

    if (response.error) {
      setError(() => response.error!.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(() => loginResponse.error!.message);
      }
    }

    setIsLoading(() => false);
  };
  return <div>RegisterPage</div>;
}

export default RegisterPage;
