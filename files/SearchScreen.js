// SearchScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator, Alert,
} from 'react-native';
import { fetchCompleteFlightData } from './aviapagesService';

const CLASSES = [
  { label: 'All',          value: '' },
  { label: 'Piston',       value: 'piston' },
  { label: 'Turboprop',    value: 'turboprop' },
  { label: 'Light Jet',    value: 'light' },
  { label: 'Midsize',      value: 'midsize' },
  { label: 'Super Midsize',value: 'super_midsize' },
  { label: 'Heavy',        value: 'heavy' },
  { label: 'Helicopter',   value: 'helicopter' },
];

export default function SearchScreen({ navigation }) {
  const [apiKey,     setApiKey]     = useState('');
  const [profile,    setProfile]    = useState(''); // pricing profile ID (optional)
  const [departure,  setDeparture]  = useState('');
  const [arrival,    setArrival]    = useState('');
  const [date,       setDate]       = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState('2');
  const [category,   setCategory]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = async () => {
    if (!apiKey.trim()) {
      Alert.alert('API Key Required', 'Apna Aviapages API key enter karo.');
      return;
    }
    if (!departure.trim() || !arrival.trim()) {
      Alert.alert('Airport Required', 'Departure aur Arrival code bharo.');
      return;
    }
    setLoading(true);
    try {
      const result = await fetchCompleteFlightData(apiKey.trim(), {
        departure:  departure.trim(),
        arrival:    arrival.trim(),
        date:       date.trim(),
        passengers: passengers.trim(),
        category,
        profile:    profile.trim() || undefined,
      });
      console.log("result",result)
      console.log("profile",profile)

      if (!result.enrichedList.length) {
        Alert.alert('Koi flight nahi mili', 'Is route par aircraft available nahi.');
        return;
      }

      navigation.navigate('Results', {
        flights:    result.enrichedList,
        total:      result.total,
        departure:  departure.trim().toUpperCase(),
        arrival:    arrival.trim().toUpperCase(),
        date:       date.trim(),
        passengers: passengers.trim(),
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'API call fail ho gayi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={S.scroll} contentContainerStyle={S.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={S.header}>
          <Text style={S.title}>Charter Flight Search</Text>
          <Text style={S.subtitle}>Aviapages Paid API · Real Prices</Text>
        </View>

        {/* API Key */}
        <View style={S.card}>
          <Text style={S.cardLabel}>🔑  API Key</Text>
          <View style={S.row}>
            <TextInput
              style={[S.input, { flex: 1 }]}
              placeholder="Aviapages API key"
              placeholderTextColor="#9ca3af"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry={!keyVisible}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={S.eyeBtn} onPress={() => setKeyVisible(v => !v)}>
              <Text style={S.eyeTxt}>{keyVisible ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Advanced toggle */}
          <TouchableOpacity onPress={() => setShowAdvanced(v => !v)} style={S.advToggle}>
            <Text style={S.advToggleTxt}>
              {showAdvanced ? '▲ Hide' : '▼ Show'} Pricing Profile (optional)
            </Text>
          </TouchableOpacity>

          {showAdvanced && (
            <>
              <Text style={S.fieldLabel}>Pricing Profile ID</Text>
              <TextInput
                style={S.input}
                placeholder="Dashboard → Settings → Pricing Profile ID"
                placeholderTextColor="#9ca3af"
                value={profile}
                onChangeText={setProfile}
                autoCapitalize="none"
              />
              <Text style={S.hint}>
                Aviapages dashboard mein apna profile ID dekho. Yeh real price ke liye zaroori hai.
              </Text>
            </>
          )}
        </View>

        {/* Route */}
        <View style={S.card}>
          <Text style={S.cardLabel}>✈  Route</Text>
          <View style={S.routeRow}>
            <View style={S.halfField}>
              <Text style={S.fieldLabel}>From</Text>
              <TextInput
                style={S.input}
                placeholder="IDR"
                placeholderTextColor="#9ca3af"
                value={departure}
                onChangeText={t => setDeparture(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={4}
              />
            </View>
            <Text style={S.arrow}>→</Text>
            <View style={S.halfField}>
              <Text style={S.fieldLabel}>To</Text>
              <TextInput
                style={S.input}
                placeholder="BHO"
                placeholderTextColor="#9ca3af"
                value={arrival}
                onChangeText={t => setArrival(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={4}
              />
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={S.card}>
          <Text style={S.cardLabel}>📋  Details</Text>
          <Text style={S.fieldLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={S.input}
            placeholder="2026-03-19"
            placeholderTextColor="#9ca3af"
            value={date}
            onChangeText={setDate}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
          <Text style={[S.fieldLabel, { marginTop: 12 }]}>Passengers</Text>
          <TextInput
            style={S.input}
            placeholder="2"
            placeholderTextColor="#9ca3af"
            value={passengers}
            onChangeText={setPassengers}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Class chips */}
        <View style={S.card}>
          <Text style={S.cardLabel}>🛩  Aircraft Class</Text>
          <View style={S.chips}>
            {CLASSES.map(c => (
              <TouchableOpacity
                key={c.value}
                style={[S.chip, category === c.value && S.chipOn]}
                onPress={() => setCategory(c.value)}
              >
                <Text style={[S.chipTxt, category === c.value && S.chipTxtOn]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search button */}
        <TouchableOpacity
          style={[S.btn, loading && S.btnOff]}
          onPress={handleSearch}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <View style={S.row}><ActivityIndicator color="#fff" size="small" /><Text style={S.btnTxt}>  Fetching real prices...</Text></View>
            : <Text style={S.btnTxt}>Search Charter Flights →</Text>
          }
        </TouchableOpacity>

        {/* Info */}
        <View style={S.infoBox}>
          <Text style={S.infoTitle}>API Flow:</Text>
          <Text style={S.infoLine}>1. GET  /v3/charter_aircraft/   → aircraft list</Text>
          <Text style={S.infoLine}>2. POST /v3/flight_calculator/  → flight time (minutes)</Text>
          <Text style={S.infoLine}>3. POST /v3/price_calculator/   → real charter price (paid)</Text>
          <Text style={S.infoLine} />
          <Text style={S.infoLine}>💡 Full API response console mein print hoga — Metro terminal mein dekho.</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: '#f1f5f9' },
  scroll:    { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  header:    { marginBottom: 24, paddingTop: Platform.OS === 'ios' ? 14 : 8 },
  title:     { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  subtitle:  { fontSize: 13, color: '#64748b' },

  card: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  cardLabel: {
    fontSize: 11, fontWeight: '700', color: '#3b82f6',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11, fontWeight: '600', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  input: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10,
    padding: 12, fontSize: 15, color: '#0f172a',
    backgroundColor: '#f8fafc', marginBottom: 2,
  },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 16 },

  row:       { flexDirection: 'row', alignItems: 'center' },
  eyeBtn:    { padding: 10, marginLeft: 6 },
  eyeTxt:    { fontSize: 18 },

  advToggle: { marginTop: 10 },
  advToggleTxt: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },

  routeRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  halfField: { flex: 1 },
  arrow:     { fontSize: 20, color: '#94a3b8', paddingBottom: 14, paddingHorizontal: 4 },

  chips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  chipOn:    { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  chipTxt:   { fontSize: 12, color: '#64748b', fontWeight: '500' },
  chipTxtOn: { color: '#2563eb', fontWeight: '700' },

  btn: {
    backgroundColor: '#2563eb', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  btnOff:  { backgroundColor: '#93c5fd' },
  btnTxt:  { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  infoBox: {
    backgroundColor: '#f0f9ff', borderRadius: 10,
    padding: 14, borderWidth: 1, borderColor: '#bae6fd',
  },
  infoTitle: { fontSize: 12, fontWeight: '700', color: '#0369a1', marginBottom: 6 },
  infoLine:  { fontSize: 11, color: '#0369a1', lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
});
