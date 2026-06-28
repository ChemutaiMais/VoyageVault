"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./trip.module.css";

type Photo = {
  url: string;
};

type Expense = {
  label: string;
  amount: number;
};

type Trip = {
  _id: string;
  name: string;
  location: string;
  dates: string;
  budget: number;
  currency: string;
  photos: Photo[];
  expenses: Expense[];
};

export default function TripPage() {
  const { id } = useParams();

  const router = useRouter();

  const [trip, setTrip] =
    useState<Trip | null>(null);

  const [photoUrl, setPhotoUrl] =
    useState("");

  const [expenseLabel, setExpenseLabel] =
    useState("");

  const [expenseAmount, setExpenseAmount] =
    useState("");

  // FETCH TRIP
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trips/${id}`
        );

        const data =
          await response.json();

        setTrip(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrip();
  }, [id]);

  // SAVE TRIP DETAILS
  const saveTrip = async () => {
    if (!trip) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(trip),
        }
      );

      const updatedTrip =
        await response.json();

      setTrip(updatedTrip);

      alert("Trip saved!");
    } catch (error) {
      console.error(error);
    }
  };

  // ADD PHOTO
  const addPhoto = async () => {
    if (!trip || !photoUrl.trim())
      return;

    const updatedPhotos = [
      ...trip.photos,
      {
        url: photoUrl,
      },
    ];

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            photos: updatedPhotos,
          }),
        }
      );

      const updatedTrip =
        await response.json();

      setTrip(updatedTrip);

      setPhotoUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE PHOTO
  const deletePhoto = async (
    indexToDelete: number
  ) => {
    if (!trip) return;

    const updatedPhotos =
      trip.photos.filter(
        (_, index) =>
          index !== indexToDelete
      );

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            photos: updatedPhotos,
          }),
        }
      );

      const updatedTrip =
        await response.json();

      setTrip(updatedTrip);
    } catch (error) {
      console.error(error);
    }
  };

  // ADD EXPENSE
  const addExpense = async () => {
    if (
      !trip ||
      !expenseLabel.trim() ||
      !expenseAmount
    )
      return;

    const updatedExpenses = [
      ...trip.expenses,
      {
        label: expenseLabel,
        amount: Number(
          expenseAmount
        ),
      },
    ];

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            expenses:
              updatedExpenses,
          }),
        }
      );

      const updatedTrip =
        await response.json();

      setTrip(updatedTrip);

      setExpenseLabel("");
      setExpenseAmount("");
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async (
    indexToDelete: number
  ) => {
    if (!trip) return;

    const updatedExpenses =
      trip.expenses.filter(
        (_, index) =>
          index !== indexToDelete
      );

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            expenses:
              updatedExpenses,
          }),
        }
      );

      const updatedTrip =
        await response.json();

      setTrip(updatedTrip);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE TRIP
  const deleteTrip = async () => {
    const confirmed = confirm(
      "Delete this trip?"
    );

    if (!confirmed) return;

    try {
      await fetch(
        `http://localhost:5000/api/trips/${id}`,
        {
          method: "DELETE",
        }
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  // TOTAL
  const totalExpenses =
    trip?.expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    ) || 0;

  // LOADING
  if (!trip) {
    return (
      <main className={styles.page}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* TITLE */}
        <input
          value={trip.name}
          onChange={(e) =>
            setTrip({
              ...trip,
              name: e.target.value,
            })
          }
          className={styles.titleInput}
        />

        {/* DETAILS */}
        <div className={styles.details}>
          <input
            type="text"
            placeholder="Location"
            value={trip.location}
            onChange={(e) =>
              setTrip({
                ...trip,
                location:
                  e.target.value,
              })
            }
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Dates"
            value={trip.dates}
            onChange={(e) =>
              setTrip({
                ...trip,
                dates:
                  e.target.value,
              })
            }
            className={styles.input}
          />

          <input
            type="number"
            placeholder="Budget"
            value={trip.budget}
            onChange={(e) =>
              setTrip({
                ...trip,
                budget: Number(
                  e.target.value
                ),
              })
            }
            className={styles.input}
          />

          <select
            value={trip.currency}
            onChange={(e) =>
              setTrip({
                ...trip,
                currency:
                  e.target.value,
              })
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
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveTrip}
          className={styles.saveButton}
        >
          Save Trip
        </button>

        {/* PHOTOS */}
        <div className={styles.section}>
          <h2 className={styles.heading}>
            Photos
          </h2>

          <div className={styles.form}>
            <input
              type="text"
              placeholder="Image URL"
              value={photoUrl}
              onChange={(e) =>
                setPhotoUrl(
                  e.target.value
                )
              }
              className={styles.input}
            />

            <button
              onClick={addPhoto}
              className={styles.button}
            >
              Add Photo
            </button>
          </div>

          <div className={styles.photos}>
            {trip.photos.map(
              (photo, index) => (
                <div
                  key={index}
                  className={
                    styles.photoCard
                  }
                >
                  <img
                    src={photo.url}
                    alt="Trip"
                    className={styles.image}
                  />

                  <button
                    onClick={() =>
                      deletePhoto(index)
                    }
                    className={
                      styles.deleteSmall
                    }
                  >
                    Delete
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* EXPENSES */}
        <div className={styles.section}>
          <h2 className={styles.heading}>
            Expenses
          </h2>

          <div className={styles.form}>
            <input
              type="text"
              placeholder="Expense Name"
              value={expenseLabel}
              onChange={(e) =>
                setExpenseLabel(
                  e.target.value
                )
              }
              className={styles.input}
            />

            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) =>
                setExpenseAmount(
                  e.target.value
                )
              }
              className={styles.input}
            />

            <button
              onClick={addExpense}
              className={styles.button}
            >
              Add Expense
            </button>
          </div>

          <div className={styles.expenses}>
            {trip.expenses.map(
              (expense, index) => (
                <div
                  key={index}
                  className={
                    styles.expenseCard
                  }
                >
                  <div>
                    <p>
                      {expense.label}
                    </p>

                    <strong>
                      {trip.currency}{" "}
                      {expense.amount}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      deleteExpense(
                        index
                      )
                    }
                    className={
                      styles.deleteSmall
                    }
                  >
                    Delete
                  </button>
                </div>
              )
            )}
          </div>

          <div className={styles.total}>
            Total Spent:
            {" "}
            {trip.currency}
            {" "}
            {totalExpenses}
          </div>
        </div>

        {/* DELETE TRIP */}
        <button
          onClick={deleteTrip}
          className={styles.delete}
        >
          Delete Trip
        </button>
      </div>
    </main>
  );
}