export type Expense = {
  label: string
  amount: number
  category: string
}

export type MemoryEntry = {
  date: string
  title: string
  note: string
}

export type Trip = {
  id: string
  name: string
  location: string
  dates: string
  image: string
  budget: number
  coords: [number, number]
  expenses: Expense[]
  memories: MemoryEntry[]
}

export const trips: Trip[] = [
  {
    id: "kyoto",
    name: "Kyoto Spring Escape",
    location: "Kyoto, Japan",
    dates: "Apr 4 – Apr 12",
    image: "/trip-kyoto.png",
    budget: 3200,
    coords: [35.0116, 135.7681],
    expenses: [
      { label: "Flights", amount: 980, category: "Travel" },
      { label: "Ryokan stay", amount: 760, category: "Lodging" },
      { label: "Rail pass", amount: 220, category: "Transport" },
      { label: "Food & tea houses", amount: 410, category: "Food" },
    ],
    memories: [
      {
        date: "Apr 5",
        title: "Cherry blossoms at Maruyama",
        note: "Walked the philosopher's path at dawn before the crowds arrived. The petals fell like snow.",
      },
      {
        date: "Apr 8",
        title: "Fushimi Inari at golden hour",
        note: "Climbed through thousands of torii gates. Quiet, glowing, unforgettable.",
      },
    ],
  },
  {
    id: "santorini",
    name: "Santorini Summer",
    location: "Santorini, Greece",
    dates: "Jun 18 – Jun 25",
    image: "/trip-santorini.png",
    budget: 4100,
    coords: [36.4618, 25.3753],
    expenses: [
      { label: "Flights", amount: 1120, category: "Travel" },
      { label: "Cliffside villa", amount: 1450, category: "Lodging" },
      { label: "Catamaran tour", amount: 300, category: "Activities" },
      { label: "Dining", amount: 520, category: "Food" },
    ],
    memories: [
      {
        date: "Jun 19",
        title: "Sunset in Oia",
        note: "Found a quiet rooftop away from the main square. The whole caldera turned amber.",
      },
    ],
  },
  {
    id: "banff",
    name: "Banff Mountain Retreat",
    location: "Banff, Canada",
    dates: "Sep 9 – Sep 16",
    image: "/trip-banff.png",
    budget: 2800,
    coords: [51.1784, -115.5708],
    expenses: [
      { label: "Flights", amount: 640, category: "Travel" },
      { label: "Lodge cabin", amount: 900, category: "Lodging" },
      { label: "Car rental", amount: 380, category: "Transport" },
      { label: "Park passes", amount: 120, category: "Activities" },
    ],
    memories: [
      {
        date: "Sep 11",
        title: "Canoe on Lake Louise",
        note: "Paddled across glassy turquoise water with the glacier ahead. Cold air, warm sun.",
      },
    ],
  },
]

export function getTrip(id: string) {
  return trips.find((trip) => trip.id === id)
}
