import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export type LocationData = {
  latitude: number;
  longitude: number;
  locationName?: string;
};

// Timeout helper
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Location request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
};

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    if (hasPermission === false) {
      setError('Location permission denied');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add 10 second timeout to prevent hanging
      const position = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        10000
      );

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Try to get location name via reverse geocoding (with timeout)
      try {
        const [place] = await withTimeout(
          Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          5000
        );
        if (place) {
          const parts = [place.name, place.city, place.region].filter(Boolean);
          locationData.locationName = parts.join(', ') || undefined;
        }
      } catch {
        // Reverse geocoding failed, continue without location name
      }

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission]);

  return {
    location,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
  };
}
