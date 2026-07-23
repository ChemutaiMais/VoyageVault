"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const signup = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
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
            "Signup failed"
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

      alert("Account created!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Signup failed");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Create Account
        </h1>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className={styles.input}
          />

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
            onClick={signup}
            className={styles.button}
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}