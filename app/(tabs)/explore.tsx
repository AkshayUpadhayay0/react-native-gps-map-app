import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_DELTA = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export default function ExploreScreen() {
  const mapRef = useRef<MapView>(null);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [heading, setHeading] = useState(0);
  const [following, setFollowing] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      setPermissionStatus(status);

      if (status !== 'granted') {
        setErrorMsg('Location permission was denied.');
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      if (!isMounted) return;

      const initialRegion: Region = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        ...DEFAULT_DELTA,
      };
      setRegion(initialRegion);
      setHeading(current.coords.heading ?? 0);
      setLoading(false);

      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          if (!isMounted) return;
          const nextRegion: Region = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            ...DEFAULT_DELTA,
          };
          setRegion(nextRegion);
          setHeading(loc.coords.heading ?? 0);

          if (following && mapRef.current) {
            mapRef.current.animateToRegion(nextRegion, 500);
          }
        }
      );
    })();

    return () => {
      isMounted = false;
      watchSubscription.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recenter = () => {
    if (region && mapRef.current) {
      mapRef.current.animateToRegion(region, 500);
    }
    setFollowing(true);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F8EF7" />
        <Text style={styles.loadingText}>Locating you…</Text>
      </View>
    );
  }

  if (permissionStatus !== 'granted' || !region) {
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        rotateEnabled
        onPanDrag={() => setFollowing(false)}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          rotation={heading}
        >
          <View style={styles.markerDot}>
            <View style={styles.markerDotInner} />
          </View>
        </Marker>
      </MapView>

      <Pressable style={styles.recenterButton} onPress={recenter}>
        <Text style={styles.recenterText}>{following ? '◎' : '⊙'}</Text>
      </Pressable>

      <View style={[styles.coordBar, { top: insets.top + 12 }]}>
        <Text style={styles.coordText}>
          {region.latitude.toFixed(5)}, {region.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  map: {
    flex: 1,
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
  markerDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(79, 142, 247, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4F8EF7',
    borderWidth: 2,
    borderColor: '#fff',
  },
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterText: {
    fontSize: 20,
    color: '#4F8EF7',
  },
  coordBar: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(22, 27, 34, 0.9)',
    borderWidth: 1,
    borderColor: '#21262D',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  coordText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
});