"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],
});

function LocationMarker({
  coords,
  setCoords,
}: any) {
  useMapEvents({
    click(e) {
      setCoords([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return coords.length === 2 ? (
    <Marker
      position={coords}
      icon={icon}
    />
  ) : null;
}

export default function MapPicker({
  coords,
  setCoords,
}: any) {
  return (
    <MapContainer
      center={
        coords.length === 2
          ? coords
          : [-1.286389, 36.817223]
      }
      zoom={6}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        coords={coords}
        setCoords={setCoords}
      />
    </MapContainer>
  );
}