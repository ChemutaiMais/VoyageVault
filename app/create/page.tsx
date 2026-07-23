"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

import { CldUploadWidget } from "next-cloudinary";

import styles from "./create.module.css";

const MapPicker = dynamic(
  () =>
    import(
      "../../components/ui/MapPicker"
    ),
  {
    ssr: false,
  }
);

export default function CreatePage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [currency, setCurrency] =
    useState("KES");

  const [image, setImage] =
    useState("");

  const [coords, setCoords] =
    useState<number[]>([]);

  const [loading, setLoading] =
    useState(false);

  const handleBudgetChange = (
    value: string
  ) => {
    const numeric =
      value.replace(/,/g, "");

    if (!isNaN(Number(numeric))) {
      setBudget(
        Number(
          numeric
        ).toLocaleString()
      );
    }
  };

  const createTrip = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,

            location,

            dates:
              `${startDate} → ${endDate}`,

            budget: Number(
              budget.replace(
                /,/g,
                ""
              )
            ),

            currency,

            image,

            coords,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create trip"
        );
      }

      router.push(
        "/dashboard"
      );
    } catch (error: any) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form
        onSubmit={createTrip}
        className={styles.form}
      >
        <h1 className={styles.title}>
          Create New Trip
        </h1>

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
          required
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

        <div className={styles.dateRow}>
          <div
            className={
              styles.dateBox
            }
          >
            <label
              className={
                styles.label
              }
            >
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className={
                styles.input
              }
            />
          </div>

          <div
            className={
              styles.dateBox
            }
          >
            <label
              className={
                styles.label
              }
            >
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className={
                styles.input
              }
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={(e) =>
            handleBudgetChange(
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

        <div className={styles.mapBox}>
          <p className={styles.label}>
            Select Trip Location
          </p>

          <MapPicker
            coords={coords}
            setCoords={setCoords}
          />
        </div>

        <div className={styles.uploadBox}>
          <CldUploadWidget
            uploadPreset="voyagevault"
            onSuccess={(
              result: any
            ) => {
              setImage(
                result.info
                  .secure_url
              );
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() =>
                  open()
                }
                className={
                  styles.uploadButton
                }
              >
                Upload Trip Image
              </button>
            )}
          </CldUploadWidget>

          {image && (
            <img
              src={image}
              alt="Preview"
              className={
                styles.preview
              }
            />
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
        >
          {loading
            ? "Creating..."
            : "Create Trip"}
        </button>
      </form>
    </main>
  );
}