"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboard.module.css";

type Trip = {
  _id: string;
  name: string;
  location?: string;
  dates?: string;
  budget?: number;
  currency?: string;
  expenses?: [];
  photos?: [];
  image?: string;
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<
    Trip[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchTrips =
      async () => {
        try {
          const response =
            await fetch(
              "http://localhost:5000/api/trips"
            );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch trips"
            );
          }

          const data =
            await response.json();

          setTrips(data);
        } catch (err) {
          console.error(err);

          setError(
            "Could not load trips."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Loading trips...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>
          {error}
        </p>
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
          Everything you need for
          your next journey
        </p>

        <Link
          href="/create"
          className={
            styles.createButton
          }
        >
          + New Trip
        </Link>
      </header>

      <section className={styles.section}>
        <h2
          className={
            styles.sectionTitle
          }
        >
          Your Trips
        </h2>

        {trips.length === 0 ? (
          <p className={styles.message}>
            No trips available yet.
          </p>
        ) : (
          <div
            className={
              styles.tripsGrid
            }
          >
            {trips.map((trip) => (
              <Link
                key={trip._id}
                href={`/trip/${trip._id}`}
                className={
                  styles.tripCard
                }
              >
                <div
                  className={
                    styles.thumbWrap
                  }
                >
                  <Image
                    src={
                      trip.image ||
                      "/placeholder.svg"
                    }
                    alt={trip.name}
                    fill
                    className={
                      styles.thumb
                    }
                  />
                </div>

                <div
                  className={
                    styles.tripBody
                  }
                >
                  <h3
                    className={
                      styles.tripName
                    }
                  >
                    {trip.name}
                  </h3>

                  <p
                    className={
                      styles.tripMeta
                    }
                  >
                    {trip.location ||
                      "Unknown Location"}
                  </p>

                  <p
                    className={
                      styles.tripMeta
                    }
                  >
                    {trip.dates ||
                      "No dates"}
                  </p>

                  <p
                    className={
                      styles.tripMeta
                    }
                  >
                    Budget:
                    {" "}
                    {trip.currency}
                    {" "}
                    {trip.budget ||
                      0}
                  </p>

                  <p
                    className={
                      styles.tripMeta
                    }
                  >
                    Expenses:
                    {" "}
                    {trip.expenses
                      ?.length || 0}
                  </p>

                  <p
                    className={
                      styles.tripMeta
                    }
                  >
                    Photos:
                    {" "}
                    {trip.photos
                      ?.length || 0}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}