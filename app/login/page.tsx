"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../signup/auth.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Login failed"
        );
        return;
      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Login failed");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Login
        </h1>

        <div className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className={styles.input}
          />

          <button
            onClick={login}
            className={styles.button}
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}