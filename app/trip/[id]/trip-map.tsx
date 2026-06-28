"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// Fix default marker icon paths for bundlers
const DefaultIcon = L.icon({
  iconRetinaUrl: (markerIcon2x as unknown as { src: string }).src ?? (markerIcon2x as unknown as string),
  iconUrl: (markerIcon as unknown as { src: string }).src ?? (markerIcon as unknown as string),
  shadowUrl: (markerShadow as unknown as { src: string }).src ?? (markerShadow as unknown as string),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

export default function TripMap({
  coords,
  name,
  location,
}: {
  coords: [number, number]
  name: string
  location: string
}) {
  return (
    <MapContainer
      center={coords}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}>
        <Popup>
          <strong>{name}</strong>
          <br />
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
