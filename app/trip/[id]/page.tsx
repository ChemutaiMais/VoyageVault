
"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

type Expense = {
  label: string;
  category: string;
  amount: number;
};

type Photo = {
  url: string;
  caption: string;
};

export default function TripPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const [trip, setTrip] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [newExpense, setNewExpense] =
    useState({
      label: "",
      category: "",
      amount: "",
    });

  const [newPhoto, setNewPhoto] =
    useState({
      url: "",
      caption: "",
    });

  //
  // FETCH TRIP
  //
  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `http://localhost:5000/api/trips/${params.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.error ||
              "Failed to fetch trip"
          );
        }

        setTrip({
          ...data,

          expenses:
            data.expenses ||
            [],

          photos:
            data.photos ||
            [],
        });
      } catch (err: any) {
        setError(
          err.message
        );
      } finally {
        setLoading(
          false
        );
      }
    };

 //
// SAVE TRIP
//
const saveTrip = async (updatedTrip = trip) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/trips/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTrip),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save trip");
    }

    const savedTrip = await response.json();

    setTrip(savedTrip);
  } catch (err: any) {
    alert(err.message);
  }
};

//
// DELETE TRIP
//
const deleteTrip = async () => {
  const confirmed = confirm("Delete this trip?");

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/trips/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

//
// ADD EXPENSE
//
const addExpense = async () => {
  if (!newExpense.label || !newExpense.amount) {
    return;
  }

  const updatedTrip = {
    ...trip,
    expenses: [
      ...(trip.expenses || []),
      {
        label: newExpense.label,
        category: newExpense.category,
        amount: Number(newExpense.amount),
      },
    ],
  };

  setTrip(updatedTrip);

  setNewExpense({
    label: "",
    category: "",
    amount: "",
  });

  await saveTrip(updatedTrip);
};

//
// DELETE EXPENSE
//
const deleteExpense = async (index: number) => {
  const updatedTrip = {
    ...trip,
    expenses: trip.expenses.filter(
      (_: Expense, i: number) => i !== index
    ),
  };

  setTrip(updatedTrip);

  await saveTrip(updatedTrip);
};
  // ADD PHOTO
  //
  const addPhoto =
    () => {
      if (!newPhoto.url)
        return;

      setTrip({
        ...trip,

        photos: [
          ...trip.photos,

          {
            url: newPhoto.url,

            caption:
              newPhoto.caption,
          },
        ],
      });

      setNewPhoto({
        url: "",
        caption: "",
      });
    };

  //
  // DELETE PHOTO
  //
  const deletePhoto =
    (index: number) => {
      const updated =
        trip.photos.filter(
          (
            _: Photo,
            i: number
          ) =>
            i !== index
        );

      setTrip({
        ...trip,

        photos:
          updated,
      });
    };

  //
  // TOTAL EXPENSES
  //
  const totalExpenses =
    trip?.expenses?.reduce(
      (
        sum: number,
        expense: Expense
      ) =>
        sum +
        expense.amount,
      0
    ) || 0;

  if (loading) {
    return (
      <div
        style={{
          background:
            "#020617",
          color: "white",
          minHeight:
            "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          fontSize:
            "24px",
        }}
      >
        Loading trip...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: 40,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <main
      style={{
        background:
          "#020617",

        minHeight:
          "100vh",

        color: "white",

        padding: "40px",

        fontFamily:
          "sans-serif",
      }}
    >
      <div
        style={{
          background:
            "#0f172a",

          borderRadius:
            "24px",

          padding: "40px",

          marginBottom:
            "30px",
        }}
      >
        <h1
          style={{
            fontSize:
              "48px",

            marginBottom:
              "10px",
          }}
        >
          {trip.name}
        </h1>

        <p
          style={{
            opacity: 0.7,
            fontSize:
              "18px",
          }}
        >
          {trip.location}
        </p>

        <p
          style={{
            opacity: 0.7,
          }}
        >
          {trip.dates}
        </p>

        <div
          style={{
            marginTop:
              "30px",

            display: "flex",

            gap: "20px",

            flexWrap:
              "wrap",
          }}
        >
          <div
            style={{
              background:
                "#1e293b",

              padding:
                "20px",

              borderRadius:
                "16px",

              minWidth:
                "220px",
            }}
          >
            <h3>
              Budget
            </h3>

            <p
              style={{
                fontSize:
                  "28px",
              }}
            >
              {
                trip.currency
              }{" "}
              {Number(
                trip.budget ||
                  0
              ).toLocaleString()}
            </p>
          </div>

          <div
            style={{
              background:
                "#1e293b",

              padding:
                "20px",

              borderRadius:
                "16px",

              minWidth:
                "220px",
            }}
          >
            <h3>
              Expenses
            </h3>

            <p
              style={{
                fontSize:
                  "28px",
              }}
            >
              {
                trip.currency
              }{" "}
              {totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* EXPENSES */}

      <section
        style={{
          marginBottom:
            "40px",
        }}
      >
        <h2>
          Expenses
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap:
              "wrap",
            marginTop:
              "20px",
          }}
        >
          <input
            placeholder="Label"
            value={
              newExpense.label
            }
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                label:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Category"
            value={
              newExpense.category
            }
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                category:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Amount"
            type="number"
            value={
              newExpense.amount
            }
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                amount:
                  e.target.value,
              })
            }
          />

          <button
            onClick={
              addExpense
            }
          >
            Add
          </button>
        </div>

        <div
          style={{
            marginTop:
              "20px",
          }}
        >
          {trip.expenses.map(
            (
              expense: Expense,
              index: number
            ) => (
              <div
                key={index}
                style={{
                  background:
                    "#1e293b",

                  padding:
                    "20px",

                  borderRadius:
                    "14px",

                  marginBottom:
                    "10px",

                  display:
                    "flex",

                  justifyContent:
                    "space-between",
                }}
              >
                <div>
                  <h3>
                    {
                      expense.label
                    }
                  </h3>

                  <p>
                    {
                      expense.category
                    }
                  </p>
                </div>

                <div>
                  <p>
                    {
                      trip.currency
                    }{" "}
                    {
                      expense.amount
                    }
                  </p>

                  <button
                    onClick={() =>
                      deleteExpense(
                        index
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* PHOTOS */}

      <section>
        <h2>Photos</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap:
              "wrap",
            marginTop:
              "20px",
          }}
        >
          <input
            placeholder="Image URL"
            value={
              newPhoto.url
            }
            onChange={(e) =>
              setNewPhoto({
                ...newPhoto,
                url:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Caption"
            value={
              newPhoto.caption
            }
            onChange={(e) =>
              setNewPhoto({
                ...newPhoto,
                caption:
                  e.target.value,
              })
            }
          />

          <button
            onClick={
              addPhoto
            }
          >
            Add
          </button>
        </div>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",

            gap: "20px",

            marginTop:
              "30px",
          }}
        >
          {trip.photos.map(
            (
              photo: Photo,
              index: number
            ) => (
              <div
                key={index}
                style={{
                  background:
                    "#1e293b",

                  borderRadius:
                    "16px",

                  overflow:
                    "hidden",
                }}
              >
                <img
                  src={
                    photo.url
                  }
                  alt={
                    photo.caption
                  }
                  style={{
                    width:
                      "100%",

                    height:
                      "220px",

                    objectFit:
                      "cover",
                  }}
                />

                <div
                  style={{
                    padding:
                      "15px",
                  }}
                >
                  <p>
                    {
                      photo.caption
                    }
                  </p>

                  <button
                    onClick={() =>
                      deletePhoto(
                        index
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ACTIONS */}

      <div
        style={{
          marginTop:
            "50px",

          display: "flex",

          gap: "20px",
        }}
      >
        <button
  onClick={() => saveTrip()}
>
  Save Trip
</button>

        <button
          onClick={
            deleteTrip
          }
        >
          Delete Trip
        </button>
      </div>
    </main>
  );
}
