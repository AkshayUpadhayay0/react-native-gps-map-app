import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.subtitle}>
          A simple, native GPS toolkit for Android and iOS
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>What It Does</Text>
          <Text style={styles.paragraph}>
            This app reads your device's GPS sensors directly and presents the
            data in a clean, easy-to-read format — no third-party tracking, no
            accounts, nothing sent anywhere you don't control.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Features</Text>

          <View style={styles.featureRow}>
            <View style={styles.bullet} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Home — GPS Details</Text>
              <Text style={styles.featureDesc}>
                Live latitude, longitude, altitude, accuracy, heading, speed,
                and timestamp, refreshed every second straight from your
                device's location hardware.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.bullet} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Explore — Live Map</Text>
              <Text style={styles.featureDesc}>
                A full-screen map that follows your position in real time as
                you move, with a manual recenter option if you'd rather look
                around freely.
              </Text>
            </View>
          </View>

          <View style={[styles.featureRow, styles.featureRowLast]}>
            <View style={styles.bullet} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Reverse Geocoding</Text>
              <Text style={styles.featureDesc}>
                Turn raw coordinates into a readable address with a single
                tap.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Built With</Text>
          <View style={styles.tagRow}>
            {['React Native', 'Expo', 'expo-location', 'react-native-maps'].map(
              (tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Developer</Text>

        <View style={styles.card}>
          <View style={styles.devRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AU</Text>
            </View>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Akshay Upadhayay</Text>
              <Text style={styles.devRole}>Software Development Engineer</Text>
              <Text style={styles.devMeta}>4+ Years of Experience</Text>
            </View>
          </View>

          <Text style={styles.devBio}>
            Built and maintained by Akshay Upadhayay, a Software Development
            Engineer with over 4 years of experience building cross-platform
            mobile and web applications.
          </Text>
        </View>

        <Text style={styles.footer}>Made with React Native & Expo</Text>
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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 21,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureRowLast: {
    marginBottom: 0,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F8EF7',
    marginTop: 6,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 19,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#21262D',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F8EF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  devInfo: {
    flex: 1,
  },
  devName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  devRole: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  devMeta: {
    fontSize: 12,
    color: '#4F8EF7',
    marginTop: 4,
    fontWeight: '600',
  },
  devBio: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});