import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type GPSData = Location.LocationObject | null;

function DetailRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {value}
        {unit ? <Text style={styles.rowUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);
  const [location, setLocation] = useState<GPSData>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      setPermissionStatus(status);

      if (status !== 'granted') {
        setErrorMsg('Location permission was denied.');
        setLoading(false);
        return;
      }

      const fetchLocation = async () => {
        try {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          if (isMounted) setLocation(current);
        } catch {
          // keep last known location on a transient read failure
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      await fetchLocation(); // immediate first fix
      intervalId = setInterval(fetchLocation, 1000); // poll every second
    })();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const reverseGeocode = async () => {
    if (!location) return;
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (results.length > 0) {
        const r = results[0];
        setAddress(
          [r.name, r.street, r.city, r.region, r.postalCode, r.country]
            .filter(Boolean)
            .join(', ')
        );
      } else {
        setAddress('No address found for this location.');
      }
    } catch {
      setAddress('Reverse geocoding failed.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F8EF7" />
        <Text style={styles.loadingText}>Acquiring GPS signal…</Text>
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Location Access Needed</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Pressable
          style={styles.button}
          onPress={() => Location.requestForegroundPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const coords = location?.coords;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>GPS Details</Text>
        <Text style={styles.subtitle}>
          Live location data from your device sensors
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Position</Text>
          <DetailRow
            label="Latitude"
            value={coords ? coords.latitude.toFixed(6) : '—'}
            unit="°"
          />
          <DetailRow
            label="Longitude"
            value={coords ? coords.longitude.toFixed(6) : '—'}
            unit="°"
          />
          <DetailRow
            label="Altitude"
            value={coords?.altitude != null ? coords.altitude.toFixed(1) : '—'}
            unit="m"
          />
          <DetailRow
            label="Altitude Accuracy"
            value={
              coords?.altitudeAccuracy != null
                ? coords.altitudeAccuracy.toFixed(1)
                : '—'
            }
            unit="m"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Accuracy & Motion</Text>
          <DetailRow
            label="Horizontal Accuracy"
            value={coords?.accuracy != null ? coords.accuracy.toFixed(1) : '—'}
            unit="m"
          />
          <DetailRow
            label="Heading"
            value={
              coords?.heading != null && coords.heading >= 0
                ? coords.heading.toFixed(1)
                : '—'
            }
            unit="°"
          />
          <DetailRow
            label="Speed"
            value={
              coords?.speed != null && coords.speed >= 0
                ? (coords.speed * 3.6).toFixed(1)
                : '—'
            }
            unit="km/h"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Metadata</Text>
          <DetailRow
            label="Timestamp"
            value={
              location ? new Date(location.timestamp).toLocaleTimeString() : '—'
            }
          />
          <DetailRow label="Platform" value={Platform.OS === 'ios' ? 'iOS' : 'Android'} />
          <DetailRow
            label="Mocked Location"
            value={
              'mocked' in (coords ?? {})
                ? String((coords as any).mocked)
                : 'N/A'
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Address</Text>
          <Text style={styles.addressText}>
            {address ?? 'Tap below to look up the address for this location.'}
          </Text>
          <Pressable style={styles.buttonSecondary} onPress={reverseGeocode}>
            <Text style={styles.buttonSecondaryText}>Reverse Geocode</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1117',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#21262D',
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F8EF7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#21262D',
  },
  rowLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  rowValue: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  rowUnit: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  addressText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 12,
    lineHeight: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  errorText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonSecondary: {
    backgroundColor: '#21262D',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#4F8EF7',
    fontWeight: '600',
    fontSize: 14,
  },
});