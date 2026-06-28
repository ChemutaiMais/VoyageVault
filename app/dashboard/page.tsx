"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboard.module.css";

type Trip = {
  _id: string;
  name: string;
  expenses?: [];
  photos?: [];
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tripName, setTripName] = useState("");

  // FETCH TRIPS
  const fetchTrips = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/trips"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await response.json();

      setTrips(data);
    } catch (err) {
      console.error(err);
      setError("Could not load trips.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD TRIPS ON PAGE LOAD
  useEffect(() => {
    fetchTrips();
  }, []);

  // ADD NEW TRIP
  const addTrip = async () => {
    if (!tripName.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tripName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }

      const newTrip = await response.json();

      setTrips((prev) => [...prev, newTrip]);

      setTripName("");
    } catch (err) {
      console.error(err);
    }
  };

  // LOADING
  if (loading) {
    return (
      <main className={styles.page}>
        <p>Loading trips...</p>
      </main>
    );
  }

  // ERROR
  if (error) {
    return (
      <main className={styles.page}>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Voyage Vault Dashboard
        </h1>

        <p className={styles.subtitle}>
          Everything you need for your next journey
        </p>
      </header>

      {/* ADD TRIP FORM */}
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Enter trip name"
          value={tripName}
          onChange={(e) =>
            setTripName(e.target.value)
          }
          className={styles.input}
        />

        <button
          onClick={addTrip}
          className={styles.button}
        >
          Add Trip
        </button>
      </div>

      <h2 className={styles.sectionTitle}>
        Your Trips
      </h2>

      {trips.length === 0 ? (
        <p>No trips available yet.</p>
      ) : (
        <div className={styles.tripsGrid}>
          {trips.map((trip) => (
            <Link
              key={trip._id}
              href={`/trip/${trip._id}`}
              className={styles.tripCard}
            >
              <div className={styles.thumbWrap}>
                <Image
                  src="/placeholder.svg"
                  alt={trip.name}
                  fill
                  className={styles.thumb}
                />
              </div>

              <div className={styles.tripBody}>
                <h3 className={styles.tripName}>
                  {trip.name}
                </h3>

                <p className={styles.tripMeta}>
                  Expenses: {trip.expenses?.length || 0}
                </p>

                <p className={styles.tripMeta}>
                  Photos: {trip.photos?.length || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}