"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";

export default function CreateTripPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [dates, setDates] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [currency, setCurrency] =
    useState("KES");

  const createTrip = async () => {
    if (!name.trim()) {
      alert("Trip name required");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            location,
            dates,
            budget: Number(budget),
            currency,
            expenses: [],
            photos: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create trip"
        );
      }

      alert("Trip created!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        "Could not create trip"
      );
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Create New Trip
        </h1>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Trip Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Dates"
            value={dates}
            onChange={(e) =>
              setDates(
                e.target.value
              )
            }
            className={styles.input}
          />

          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) =>
              setBudget(
                e.target.value
              )
            }
            className={styles.input}
          />

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(
                e.target.value
              )
            }
            className={styles.input}
          >
            <option value="KES">
              KES
            </option>

            <option value="USD">
              USD
            </option>

            <option value="EUR">
              EUR
            </option>

            <option value="GBP">
              GBP
            </option>
          </select>

          <button
            onClick={createTrip}
            className={styles.button}
          >
            Create Trip
          </button>
        </div>
      </div>
    </main>
  );
}