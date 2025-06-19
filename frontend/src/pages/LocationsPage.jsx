import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ApiService from "../service/ApiService";
import Layout from "../layout/Layout";

// Marker icon setup
const setupLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
};

setupLeafletIcons();

const extractLatLng = (url) => {
  try {
    const [lat, lng] = new URL(url).searchParams.get('q').split(',').map(Number);
    return { lat, lng };
  } catch {
    return null;
  }
};

const DEFAULT_CENTER = { lat: 6.7570, lng: 80.7700 };

export default function LocationMap() {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { transactions } = await ApiService.getAllTransactionLocations();
        const coords = (transactions || [])
          .map(tx => extractLatLng(tx.location))
          .filter(Boolean);
        setLocations(coords);
      } catch (err) {
        console.error('Error loading locations:', err);
      }
    };

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setCenter({ lat: coords.latitude, lng: coords.longitude }),
        () => console.warn('Using default center location')
      );
    };

    fetchData();
    getCurrentPosition();
  }, []);

  return (
    <Layout>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: 'calc(100vh - 64px)', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((pos, idx) => (
          <Marker key={`${pos.lat}-${pos.lng}-${idx}`} position={pos}>
            <Popup>{`Location: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Layout>
  );
}