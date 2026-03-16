import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  ScrollView, ActivityIndicator, Modal, FlatList,
  Platform, StatusBar, KeyboardAvoidingView, SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CALC_URL          = "https://api.aviapages.com/v3/flight_calculator/";
const AIRCRAFT_TYPE_URL = "https://api.aviapages.com/v3/aircraft-types/";   // ✅ correct endpoint
const AIRPORT_URL       = "https://api.aviapages.com/v3/airports/";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
};

const PRICING_POLICIES = ["General", "Economy", "Business", "First Class", "Charter"];

const blankFlight = () => ({
  departure:      null,
  arrival:        null,
  passengers:     "1",
  date:           new Date(),
  time:           new Date(),
  aircraft:       null,          // { id, label, value, meta }
  pricingPolicy:  "General",
  avoidCountries: "",
});

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const pad   = (n) => String(n).padStart(2, "0");
const fmtD  = (d) => `${pad(d.getDate())} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
const fmtT  = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtHM = (mins) => { const h = Math.floor(mins / 60), m = mins % 60; return h ? `${h}h ${m}m` : `${m}m`; };
const fmtCcy = (n, cur = "USD") =>
  `${cur} ${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

// ─────────────────────────────────────────────────────────────
// AIRPORT SEARCH MODAL
// ─────────────────────────────────────────────────────────────
function AirportModal({ visible, title, onClose, onSelect }) {
  const [q,    setQ]    = useState("");
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState(false);
  const timer           = useRef(null);

  const doSearch = async (txt) => {
    if (!txt) { setList([]); return; }
    setBusy(true);
    try {
      const r  = await fetch(
        `${AIRPORT_URL}?search=${encodeURIComponent(txt)}&search_city_name=${encodeURIComponent(txt)}`,
        { headers: HEADERS }
      );
      const js = await r.json();
      setList((js.results || []).map(a => ({
        id:   a.icao || a.iata || String(a.id),
        iata: a.iata || a.icao || "???",
        name: a.name || "",
        city: a.city?.name || (typeof a.city === "string" ? a.city : "") || a.country || "",
      })));
    } catch { setList([]); }
    finally  { setBusy(false); }
  };

  const onChange = (txt) => {
    setQ(txt);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(txt), 380);
  };

  const close = () => { setQ(""); setList([]); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={M.overlay}>
        <View style={M.sheet}>
          <View style={M.handle} />
          <Text style={M.title}>{title}</Text>
          <View style={M.searchWrap}>
            <Text style={M.searchIcon}>🔍</Text>
            <TextInput
              style={M.searchInput}
              placeholder="Airport name, city or IATA code…"
              placeholderTextColor="#4a5a6a"
              value={q}
              onChangeText={onChange}
              autoFocus
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => { setQ(""); setList([]); }}>
                <Text style={M.clear}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {busy && <ActivityIndicator color="#c9a84c" style={{ marginVertical: 14 }} />}
          <FlatList
            data={list}
            keyExtractor={i => i.id}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 340 }}
            ListEmptyComponent={
              !busy && q.length > 0
                ? <Text style={M.empty}>No airports found for "{q}"</Text>
                : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={M.row} onPress={() => { onSelect(item); close(); }}>
                <View style={M.iataBox}>
                  <Text style={M.iataCode}>{item.iata}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={M.rowName} numberOfLines={1}>{item.name}</Text>
                  <Text style={M.rowCity}>{item.city}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={M.cancelBtn} onPress={close}>
            <Text style={M.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// AIRCRAFT PICKER MODAL  — grouped by manufacturer (like website)
// ─────────────────────────────────────────────────────────────
function AircraftModal({ visible, groups, selected, onSelect, onClose }) {
  const [q,        setQ]        = useState("");
  const [expanded, setExpanded] = useState({});

  // flat filtered list when searching
  const filtered = q.trim()
    ? groups.flatMap(g => g.types.filter(t =>
        t.label.toLowerCase().includes(q.toLowerCase()) ||
        g.manufacturer.toLowerCase().includes(q.toLowerCase())
      ).map(t => ({ ...t, manufacturer: g.manufacturer }))
    )
    : null;

  const toggle = (mfr) => setExpanded(p => ({ ...p, [mfr]: !p[mfr] }));

  const close = () => { setQ(""); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={M.overlay}>
        <View style={[M.sheet, { maxHeight: "85%" }]}>
          <View style={M.handle} />
          <Text style={M.title}>Select Aircraft Type</Text>

          {/* Search */}
          <View style={M.searchWrap}>
            <Text style={M.searchIcon}>🔍</Text>
            <TextInput
              style={M.searchInput}
              placeholder="Search aircraft type…"
              placeholderTextColor="#4a5a6a"
              value={q}
              onChangeText={setQ}
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQ("")}>
                <Text style={M.clear}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            {/* ── Flat search results ── */}
            {filtered
              ? filtered.length === 0
                ? <Text style={M.empty}>No aircraft found</Text>
                : filtered.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[M.row, item.id === selected?.id && M.rowActive]}
                    onPress={() => { onSelect(item); close(); }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[M.rowName, item.id === selected?.id && { color: "#c9a84c" }]}>
                        {item.label}
                      </Text>
                      <Text style={M.rowCity}>{item.manufacturer}  ·  {item.meta}</Text>
                    </View>
                    {item.id === selected?.id && <Text style={{ color: "#c9a84c", fontSize: 18 }}>✓</Text>}
                  </TouchableOpacity>
                ))
              /* ── Grouped by manufacturer ── */
              : groups.map(g => (
                <View key={g.manufacturer}>
                  {/* Manufacturer header */}
                  <TouchableOpacity
                    style={M.groupHeader}
                    onPress={() => toggle(g.manufacturer)}
                  >
                    <Text style={M.groupArrow}>{expanded[g.manufacturer] ? "▾" : "▸"}</Text>
                    <Text style={M.groupName}>{g.manufacturer}</Text>
                    <Text style={M.groupCount}>{g.types.length}</Text>
                  </TouchableOpacity>

                  {/* Aircraft types under this manufacturer */}
                  {expanded[g.manufacturer] && g.types.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={[M.row, M.rowIndent, item.id === selected?.id && M.rowActive]}
                      onPress={() => { onSelect(item); close(); }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[M.rowName, item.id === selected?.id && { color: "#c9a84c" }]}>
                          {item.label}
                        </Text>
                        {item.meta ? <Text style={M.rowCity}>{item.meta}</Text> : null}
                      </View>
                      {item.id === selected?.id && <Text style={{ color: "#c9a84c", fontSize: 18 }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            }
          </ScrollView>

          <TouchableOpacity style={M.cancelBtn} onPress={close}>
            <Text style={M.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// PRICING PICKER MODAL
// ─────────────────────────────────────────────────────────────
function PickerModal({ visible, title, items, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={M.overlay}>
        <View style={M.sheet}>
          <View style={M.handle} />
          <Text style={M.title}>{title}</Text>
          <FlatList
            data={items}
            keyExtractor={i => String(i.id)}
            style={{ maxHeight: 400 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const active = item.id === selected?.id;
              return (
                <TouchableOpacity
                  style={[M.row, active && M.rowActive]}
                  onPress={() => { onSelect(item); onClose(); }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[M.rowName, active && { color: "#c9a84c" }]}>{item.label}</Text>
                  </View>
                  {active && <Text style={{ color: "#c9a84c", fontSize: 18 }}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={M.cancelBtn} onPress={onClose}>
            <Text style={M.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// UI ATOMS
// ─────────────────────────────────────────────────────────────
function FieldLabel({ text, required, optional }) {
  return (
    <Text style={F.label}>
      {text}
      {required && <Text style={{ color: "#c9a84c" }}> *</Text>}
      {optional && <Text style={{ color: "#3a4a5a", fontWeight: "400" }}> (optional)</Text>}
    </Text>
  );
}

function Selector({ icon, value, placeholder, onPress, hasError }) {
  return (
    <TouchableOpacity
      style={[F.selector, hasError && F.selectorErr]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon ? <Text style={F.sIcon}>{icon}</Text> : null}
      <Text style={[F.sTxt, !value && F.sPlaceholder]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Text style={F.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <Text style={F.errMsg}>⚠  {msg}</Text>;
}

// ─────────────────────────────────────────────────────────────
// FLIGHT CARD
// ─────────────────────────────────────────────────────────────
function FlightCard({ index, flight, onChange, onRemove, aircraftGroups, errors }) {
  const [showDep,   setShowDep]   = useState(false);
  const [showArr,   setShowArr]   = useState(false);
  const [showAC,    setShowAC]    = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showDate,  setShowDate]  = useState(false);
  const [showTime,  setShowTime]  = useState(false);

  const set = (field, val) => onChange({ ...flight, [field]: val });

  const priceItems = PRICING_POLICIES.map(p => ({ id: p, label: p, value: p }));

  const depLabel = flight.departure
    ? `${flight.departure.iata}  ·  ${flight.departure.name}${flight.departure.city ? `, ${flight.departure.city}` : ""}`
    : "";

  const arrLabel = flight.arrival
    ? `${flight.arrival.iata}  ·  ${flight.arrival.name}${flight.arrival.city ? `, ${flight.arrival.city}` : ""}`
    : "";

  return (
    <View style={F.card}>
      {/* Header */}
      <View style={F.cardHead}>
        <View style={F.badge}><Text style={F.badgeNum}>{index + 1}</Text></View>
        <Text style={F.cardTitle}>FLIGHT SEGMENT {index + 1}</Text>
        {index > 0 && (
          <TouchableOpacity style={F.removeBtn} onPress={onRemove}>
            <Text style={F.removeTxt}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Departure */}
      <FieldLabel text="Departure Airport" required />
      <Selector icon="🛫" value={depLabel} placeholder="Tap to search airport" onPress={() => setShowDep(true)} hasError={!!errors.departure} />
      <ErrMsg msg={errors.departure} />

      {/* Arrival */}
      <View style={F.fieldGap}>
        <FieldLabel text="Arrival Airport" required />
        <Selector icon="🛬" value={arrLabel} placeholder="Tap to search airport" onPress={() => setShowArr(true)} hasError={!!errors.arrival} />
        <ErrMsg msg={errors.arrival} />
      </View>

      {/* Date + Time */}
      <View style={F.row2}>
        <View style={{ flex: 1 }}>
          <FieldLabel text="Date" required />
          <Selector icon="📅" value={fmtD(flight.date)} onPress={() => setShowDate(true)} />
        </View>
        <View style={{ flex: 1 }}>
          <FieldLabel text="Time (Local)" required />
          <Selector icon="🕐" value={fmtT(flight.time)} onPress={() => setShowTime(true)} />
        </View>
      </View>

      {showDate && (
        <DateTimePicker
          value={flight.date}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, d) => { setShowDate(false); if (d) set("date", d); }}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={flight.time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, t) => { setShowTime(false); if (t) set("time", t); }}
        />
      )}

      {/* Passengers */}
      <View style={F.fieldGap}>
        <FieldLabel text="Passengers" required />
        <View style={F.counter}>
          <TouchableOpacity
            style={F.cBtn}
            onPress={() => set("passengers", String(Math.max(1, parseInt(flight.passengers || "1") - 1)))}
          >
            <Text style={F.cBtnTxt}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={F.cVal}
            keyboardType="numeric"
            value={flight.passengers}
            onChangeText={t => set("passengers", t.replace(/\D/g, "") || "1")}
          />
          <TouchableOpacity
            style={F.cBtn}
            onPress={() => set("passengers", String(parseInt(flight.passengers || "0") + 1))}
          >
            <Text style={F.cBtnTxt}>+</Text>
          </TouchableOpacity>
          <Text style={F.cLabel}>passengers</Text>
        </View>
        <ErrMsg msg={errors.passengers} />
      </View>

      {/* Aircraft — grouped dropdown */}
      <View style={F.fieldGap}>
        <FieldLabel text="Aircraft Type" required />
        <Selector
          icon="✈️"
          value={flight.aircraft?.label || ""}
          placeholder="Select aircraft type"
          onPress={() => setShowAC(true)}
          hasError={!!errors.aircraft}
        />
        {flight.aircraft?.meta ? (
          <Text style={F.acMeta}>{flight.aircraft.meta}</Text>
        ) : null}
        <ErrMsg msg={errors.aircraft} />
      </View>

      {/* Pricing Policy */}
      <View style={F.fieldGap}>
        <FieldLabel text="Pricing Policy" required />
        <Selector icon="💼" value={flight.pricingPolicy} onPress={() => setShowPrice(true)} />
      </View>

      {/* Avoid Countries */}
      <View style={F.fieldGap}>
        <FieldLabel text="Avoid Countries / FIRs" optional />
        <TextInput
          style={F.textInput}
          placeholder="e.g. Israel, Iran  (comma-separated)"
          placeholderTextColor="#3a4a5a"
          value={flight.avoidCountries}
          onChangeText={t => set("avoidCountries", t)}
        />
      </View>

      {/* Modals */}
      <AirportModal visible={showDep} title="Departure Airport" onClose={() => setShowDep(false)} onSelect={a => set("departure", a)} />
      <AirportModal visible={showArr} title="Arrival Airport"   onClose={() => setShowArr(false)} onSelect={a => set("arrival",   a)} />
      <AircraftModal
        visible={showAC}
        groups={aircraftGroups}
        selected={flight.aircraft}
        onSelect={a => set("aircraft", a)}
        onClose={() => setShowAC(false)}
      />
      <PickerModal
        visible={showPrice}
        title="Pricing Policy"
        items={priceItems}
        selected={{ id: flight.pricingPolicy }}
        onSelect={p => set("pricingPolicy", p.value)}
        onClose={() => setShowPrice(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────────────────────
function ResultCard({ index, flight, result }) {
  const r = result || {};

  const apiErrors  = Array.isArray(r.errors) ? r.errors : [];
  const distance   = r.distance_nm    ?? r.distance          ?? r.great_circle_distance ?? r.gc_distance      ?? null;
  const flightTime = r.flight_time    ?? r.airway_time        ?? r.duration             ?? r.flight_time_min  ?? null;
  const price      = r.price          ?? r.total_price        ?? r.cost                 ?? r.charter_price     ?? null;
  const currency   = r.currency       ?? "USD";
  const fuel       = r.fuel_burn      ?? r.fuel               ?? r.fuel_required        ?? null;
  const route      = r.route          ?? r.waypoints          ?? null;

  const statsData = [
    distance   != null && { val: `${Math.round(distance)} nm`,                                       key: "Distance" },
    flightTime != null && { val: typeof flightTime === "number" ? fmtHM(flightTime) : flightTime,    key: "Flight Time" },
    fuel       != null && { val: `${Math.round(fuel)} kg`,                                           key: "Fuel" },
    { val: flight.passengers, key: "Pax" },
  ].filter(Boolean);

  const details = [
    flight.aircraft?.label   && { icon: "✈️",  key: "Aircraft",        val: flight.aircraft.label },
    flight.aircraft?.meta    && { icon: "📋",  key: "Class / Range",   val: flight.aircraft.meta },
    flight.pricingPolicy     && { icon: "💼",  key: "Pricing",         val: flight.pricingPolicy },
    { icon: "📅",  key: "Date",            val: fmtD(new Date(flight.date)) },
    { icon: "🕐",  key: "Departure Time",  val: fmtT(new Date(flight.time)) },
    route                    && { icon: "🗺️", key: "Route",            val: typeof route === "string" ? route : JSON.stringify(route) },
    flight.avoidCountries    && { icon: "🚫",  key: "Avoided",         val: flight.avoidCountries },
  ].filter(Boolean);

  return (
    <View style={R.card}>
      {/* Route header */}
      <View style={R.routeBar}>
        <View style={R.num}><Text style={R.numTxt}>{index + 1}</Text></View>
        <View style={R.airports}>
          <View>
            <Text style={R.code}>{flight.departure?.iata ?? "—"}</Text>
            <Text style={R.city} numberOfLines={1}>{flight.departure?.city ?? ""}</Text>
          </View>
          <View style={R.line}>
            <View style={R.dot} />
            <View style={R.track} />
            <Text style={R.planeTxt}>✈</Text>
            <View style={R.track} />
            <View style={R.dot} />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={R.code}>{flight.arrival?.iata ?? "—"}</Text>
            <Text style={R.city} numberOfLines={1}>{flight.arrival?.city ?? ""}</Text>
          </View>
        </View>
      </View>

      {/* Price */}
      {price != null && (
        <View style={R.priceBox}>
          <Text style={R.priceLbl}>ESTIMATED COST</Text>
          <Text style={R.priceVal}>{fmtCcy(price, currency)}</Text>
        </View>
      )}

      {/* Stats */}
      {statsData.length > 0 && (
        <View style={R.stats}>
          {statsData.map(s => (
            <View key={s.key} style={R.stat}>
              <Text style={R.statVal}>{s.val}</Text>
              <Text style={R.statKey}>{s.key}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={R.sep} />

      {/* Details */}
      {details.map(d => (
        <View key={d.key} style={R.detRow}>
          <Text style={R.detIcon}>{d.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={R.detKey}>{d.key}</Text>
            <Text style={R.detVal}>{d.val}</Text>
          </View>
        </View>
      ))}

      {/* API Errors */}
      {apiErrors.length > 0 && (
        <View style={R.errBox}>
          <Text style={R.errBoxTitle}>⚠  Calculation Issues</Text>
          {apiErrors.map((e, i) => (
            <View key={i} style={R.errItem}>
              <Text style={R.errScope}>{e.scope ?? e.field ?? "Error"}</Text>
              <Text style={R.errMessage}>{e.message ?? e.detail ?? JSON.stringify(e)}</Text>
            </View>
          ))}
          <Text style={R.errHint}>Try a shorter route or a different aircraft type</Text>
        </View>
      )}

      {/* Raw fallback */}
      {price == null && distance == null && flightTime == null && apiErrors.length === 0 && (
        <View style={R.rawBox}>
          <Text style={R.rawLbl}>API RESPONSE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={R.rawTxt}>{JSON.stringify(r, null, 2)}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function FlightCalculator() {
  const [flights,       setFlights]       = useState([blankFlight()]);
  const [aircraftGroups, setAircraftGroups] = useState([]);   // [{ manufacturer, types:[{id,label,value,meta}] }]
  const [acLoading,     setAcLoading]     = useState(true);
  const [errors,        setErrors]        = useState([{}]);
  const [loading,       setLoading]       = useState(false);
  const [results,       setResults]       = useState(null);

  // ── Fetch aircraft TYPES (grouped by manufacturer) ───────────
  useEffect(() => {
    (async () => {
      try {
        setAcLoading(true);
        // Fetch up to 500 types in one call
        const r  = await fetch(`${AIRCRAFT_TYPE_URL}?limit=500`, { headers: HEADERS });
        const js = await r.json();

        console.log("Aircraft types sample:", JSON.stringify((js.results || [])[0], null, 2));

        const grouped = {};
        (js.results || []).forEach(a => {
          // Manufacturer / make name
          const mfr = a.manufacturer?.name
            || a.make
            || a.manufacturer
            || (typeof a.manufacturer === "string" ? a.manufacturer : null)
            || "Other";

          // Display label  e.g. "BBJ2 / Boeing 737-800"
          const label = a.name || a.model || a.type_name || a.aircraft_type_name || String(a.id);

          // Value sent to calculator API — use the exact "name" field the API expects
          const value = a.name || label;

          // Meta info
          const meta = [
            a.aircraft_class?.name || a.class_name || a.category || "",
            a.max_range_km ? `Range ${a.max_range_km} km` : (a.max_range ? `Range ${a.max_range}` : ""),
            a.max_passengers ? `Max ${a.max_passengers} pax` : "",
          ].filter(Boolean).join("  ·  ");

          if (!grouped[mfr]) grouped[mfr] = [];
          grouped[mfr].push({
            id:    String(a.id || value),
            label,
            value,   // ← this is what we send to the calculator API as "aircraft"
            meta,
            manufacturer: mfr,
          });
        });

        // Sort manufacturers alphabetically, sort types within each group
        const sorted = Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([manufacturer, types]) => ({
            manufacturer,
            types: types.sort((a, b) => a.label.localeCompare(b.label)),
          }));

        setAircraftGroups(sorted);
      } catch (e) {
        console.warn("Aircraft types load failed:", e);
      } finally {
        setAcLoading(false);
      }
    })();
  }, []);

  const updateFlight = (i, val) => {
    const fs = [...flights]; fs[i] = val; setFlights(fs);
    const es = [...errors];  es[i] = {};  setErrors(es);
  };

  const addFlight    = () => { setFlights([...flights, blankFlight()]); setErrors([...errors, {}]); };
  const removeFlight = (i) => {
    setFlights(flights.filter((_, x) => x !== i));
    setErrors(errors.filter((_, x) => x !== i));
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    let ok = true;
    const es = flights.map(f => {
      const e = {};
      if (!f.departure)                                  { e.departure  = "Please select a departure airport";  ok = false; }
      if (!f.arrival)                                    { e.arrival    = "Please select an arrival airport";   ok = false; }
      if (!f.aircraft)                                   { e.aircraft   = "Please select an aircraft type";     ok = false; }
      if (!f.passengers || parseInt(f.passengers) < 1)   { e.passengers = "Minimum 1 passenger required";       ok = false; }
      return e;
    });
    setErrors(es);
    return ok;
  };

  // ── Calculate ────────────────────────────────────────────────
  const handleCalculate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const combined = [];
      for (const f of flights) {
        const avoid = (typeof f.avoidCountries === "string" && f.avoidCountries.trim())
          ? f.avoidCountries.split(",").map(c => c.trim()).filter(c => c.length > 1 && /[a-zA-Z]/.test(c))
          : [];

        const body = {
          departure_airport:            f.departure.iata,
          arrival_airport:              f.arrival.iata,
          aircraft:                     f.aircraft.value,   // ✅ correct aircraft type name
          pax:                          parseInt(f.passengers),
          flight_date:                  f.date.toISOString().split("T")[0],
          local_time:                   `${pad(f.time.getHours())}:${pad(f.time.getMinutes())}:00`,
          pricing_policy:               f.pricingPolicy,
          avoid_countries:              avoid,
          airway_time_weather_impacted: true,
        };

        console.log("→ Sending:", JSON.stringify(body, null, 2));
        const res  = await fetch(CALC_URL, { method: "POST", headers: HEADERS, body: JSON.stringify(body) });
        const data = await res.json();
        console.log("← Received:", JSON.stringify(data, null, 2));

        combined.push({ flight: f, result: data });
      }
      setResults(combined);
    } catch (e) {
      console.error(e);
      const es = [...errors];
      es[0] = { ...es[0], _api: "Calculation failed. Check your connection." };
      setErrors(es);
    } finally { setLoading(false); }
  };

  // ── RESULTS SCREEN ───────────────────────────────────────────
  if (results) {
    return (
      <SafeAreaView style={G.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={G.page} showsVerticalScrollIndicator={false}>
          <View style={G.header}>
            <Text style={G.logo}>✈ AviaPlan</Text>
            <View style={G.pill}><Text style={G.pillTxt}>RESULTS</Text></View>
          </View>
          <Text style={G.heading}>{results.length > 1 ? `${results.length} Flights` : "Flight"} Calculated</Text>
          <Text style={G.sub}>{results.length} route{results.length > 1 ? "s" : ""} analysed · {fmtD(new Date())}</Text>
          <View style={G.divider} />

          {results.map((item, i) => (
            <ResultCard key={i} index={i} flight={item.flight} result={item.result} />
          ))}

          <TouchableOpacity style={G.backBtn} onPress={() => setResults(null)} activeOpacity={0.8}>
            <Text style={G.backBtnTxt}>← Back to Calculator</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── FORM SCREEN ──────────────────────────────────────────────
  return (
    <SafeAreaView style={G.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={G.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={G.header}>
            <Text style={G.logo}>✈ AviaPlan</Text>
            <View style={G.pill}><Text style={G.pillTxt}>FLIGHT CALCULATOR</Text></View>
          </View>
          <Text style={G.heading}>Book Your{"\n"}Charter Flight</Text>
          <Text style={G.sub}>Professional aviation booking</Text>
          <View style={G.divider} />

          {acLoading && (
            <View style={G.acLoadingBanner}>
              <ActivityIndicator color="#c9a84c" size="small" />
              <Text style={G.acLoadingTxt}>Loading aircraft types…</Text>
            </View>
          )}

          {flights.map((f, i) => (
            <FlightCard
              key={i}
              index={i}
              flight={f}
              onChange={val => updateFlight(i, val)}
              onRemove={() => removeFlight(i)}
              aircraftGroups={aircraftGroups}
              errors={errors[i] || {}}
            />
          ))}

          {errors[0]?._api && (
            <View style={G.apiErr}>
              <Text style={G.apiErrTxt}>⚠  {errors[0]._api}</Text>
            </View>
          )}

          <TouchableOpacity style={G.addBtn} onPress={addFlight} activeOpacity={0.7}>
            <Text style={G.addBtnTxt}>＋  Add Flight Segment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[G.calcBtn, (loading || acLoading) && G.calcDisabled]}
            onPress={handleCalculate}
            disabled={loading || acLoading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#080d16" />
              : <Text style={G.calcBtnTxt}>✈  Calculate {flights.length > 1 ? `${flights.length} Flights` : "Flight"}</Text>
            }
          </TouchableOpacity>

          <Text style={G.footer}>Fields marked * are required</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const BG   = "#080d16";
const GOLD = "#c9a84c";
const CARD = "rgba(255,255,255,0.035)";
const BORD = "rgba(255,255,255,0.09)";
const TEXT = "#e8dcc8";
const MUTED = "#4a5a6a";

const M = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "flex-end" },
  sheet:       { backgroundColor: "#0d1520", borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 18, paddingBottom: Platform.OS === "ios" ? 36 : 20, borderTopWidth: 1, borderColor: "rgba(201,168,76,0.18)" },
  handle:      { width: 38, height: 4, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 14 },
  title:       { color: TEXT, fontSize: 17, fontWeight: "700", textAlign: "center", marginBottom: 14 },
  searchWrap:  { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: BORD, borderRadius: 12, paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  searchIcon:  { fontSize: 15 },
  searchInput: { flex: 1, color: TEXT, fontSize: 15, paddingVertical: 11 },
  clear:       { color: MUTED, fontSize: 16, paddingHorizontal: 4 },
  // rows
  row:         { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  rowIndent:   { paddingLeft: 28 },
  rowActive:   { backgroundColor: "rgba(201,168,76,0.07)", borderRadius: 10, paddingHorizontal: 8 },
  rowName:     { color: TEXT, fontSize: 14, fontWeight: "500" },
  rowCity:     { color: MUTED, fontSize: 12, marginTop: 2 },
  // airport iata badge
  iataBox:     { width: 50, paddingVertical: 5, backgroundColor: "rgba(201,168,76,0.14)", borderRadius: 7, alignItems: "center" },
  iataCode:    { color: GOLD, fontWeight: "800", fontSize: 13 },
  // grouped manufacturer header
  groupHeader: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(201,168,76,0.05)" },
  groupArrow:  { color: GOLD, fontSize: 13, width: 16 },
  groupName:   { flex: 1, color: GOLD, fontSize: 14, fontWeight: "700" },
  groupCount:  { color: MUTED, fontSize: 12, backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  // misc
  empty:       { color: MUTED, textAlign: "center", paddingVertical: 24, fontSize: 14 },
  cancelBtn:   { marginTop: 10, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelTxt:   { color: "#7a8b9a", fontSize: 15, fontWeight: "600" },
});

const F = StyleSheet.create({
  card:        { backgroundColor: CARD, borderWidth: 1, borderColor: "rgba(201,168,76,0.16)", borderRadius: 16, padding: 16, marginBottom: 14 },
  cardHead:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  badge:       { width: 28, height: 28, borderRadius: 14, backgroundColor: GOLD, alignItems: "center", justifyContent: "center" },
  badgeNum:    { color: BG, fontWeight: "800", fontSize: 13 },
  cardTitle:   { flex: 1, color: GOLD, fontWeight: "700", fontSize: 11, letterSpacing: 0.9 },
  removeBtn:   { borderWidth: 1, borderColor: "rgba(239,68,68,0.4)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  removeTxt:   { color: "#f87171", fontSize: 12, fontWeight: "500" },
  label:       { fontSize: 11, fontWeight: "600", color: "#7a8b9a", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 7 },
  selector:    { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: BORD, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 13, gap: 9 },
  selectorErr: { borderColor: "rgba(239,68,68,0.5)", backgroundColor: "rgba(239,68,68,0.05)" },
  sIcon:       { fontSize: 15 },
  sTxt:        { flex: 1, color: TEXT, fontSize: 14 },
  sPlaceholder:{ color: MUTED },
  chevron:     { color: GOLD, fontSize: 22, fontWeight: "300" },
  errMsg:      { color: "#f87171", fontSize: 12, marginTop: 5, fontWeight: "500" },
  acMeta:      { color: MUTED, fontSize: 11, marginTop: 4, paddingLeft: 4 },
  fieldGap:    { marginTop: 14 },
  row2:        { flexDirection: "row", gap: 10, marginTop: 14 },
  counter:     { flexDirection: "row", alignItems: "center", gap: 10 },
  cBtn:        { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "rgba(201,168,76,0.4)", alignItems: "center", justifyContent: "center" },
  cBtnTxt:     { color: GOLD, fontSize: 22, lineHeight: 24 },
  cVal:        { width: 58, textAlign: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: BORD, borderRadius: 9, paddingVertical: 8, color: TEXT, fontSize: 16, fontWeight: "700" },
  cLabel:      { color: MUTED, fontSize: 13 },
  textInput:   { backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: BORD, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 12, color: TEXT, fontSize: 14 },
});

const R = StyleSheet.create({
  card:        { backgroundColor: CARD, borderWidth: 1, borderColor: "rgba(201,168,76,0.18)", borderRadius: 16, padding: 16, marginBottom: 14 },
  routeBar:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  num:         { width: 26, height: 26, borderRadius: 13, backgroundColor: GOLD, alignItems: "center", justifyContent: "center" },
  numTxt:      { color: BG, fontWeight: "800", fontSize: 12 },
  airports:    { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  code:        { color: TEXT, fontSize: 22, fontWeight: "800" },
  city:        { color: MUTED, fontSize: 11 },
  line:        { flex: 1, flexDirection: "row", alignItems: "center", gap: 3 },
  dot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD },
  track:       { flex: 1, height: 1, backgroundColor: "rgba(201,168,76,0.28)" },
  planeTxt:    { fontSize: 13, color: GOLD },
  priceBox:    { backgroundColor: "rgba(201,168,76,0.09)", borderWidth: 1, borderColor: "rgba(201,168,76,0.2)", borderRadius: 12, paddingVertical: 13, alignItems: "center", marginBottom: 14 },
  priceLbl:    { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 3 },
  priceVal:    { color: GOLD, fontSize: 26, fontWeight: "800" },
  stats:       { flexDirection: "row", gap: 8, marginBottom: 12 },
  stat:        { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  statVal:     { color: TEXT, fontSize: 15, fontWeight: "700" },
  statKey:     { color: MUTED, fontSize: 10, marginTop: 2, textAlign: "center" },
  sep:         { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginVertical: 12 },
  detRow:      { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" },
  detIcon:     { fontSize: 14, width: 20, textAlign: "center", marginTop: 2 },
  detKey:      { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  detVal:      { color: TEXT, fontSize: 13, fontWeight: "500", marginTop: 2 },
  rawBox:      { backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 12, marginTop: 10 },
  rawLbl:      { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  rawTxt:      { color: "#7a8b9a", fontSize: 11, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  errBox:      { backgroundColor: "rgba(239,68,68,0.08)", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)", borderRadius: 12, padding: 14, marginTop: 8 },
  errBoxTitle: { color: "#fca5a5", fontSize: 13, fontWeight: "700", marginBottom: 10 },
  errItem:     { marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "rgba(239,68,68,0.15)" },
  errScope:    { color: "#c9a84c", fontSize: 10, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 },
  errMessage:  { color: "#fca5a5", fontSize: 13 },
  errHint:     { color: "#7a8b9a", fontSize: 11, marginTop: 6, fontStyle: "italic" },
});

const G = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: BG },
  page:           { padding: 18, paddingBottom: 50 },
  header:         { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  logo:           { fontSize: 19, fontWeight: "800", color: GOLD, letterSpacing: 0.4 },
  pill:           { backgroundColor: "rgba(201,168,76,0.11)", borderWidth: 1, borderColor: "rgba(201,168,76,0.28)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  pillTxt:        { color: GOLD, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  heading:        { fontSize: 30, fontWeight: "800", color: TEXT, lineHeight: 36, marginBottom: 5 },
  sub:            { fontSize: 13, color: MUTED, marginBottom: 2 },
  divider:        { height: 1, backgroundColor: "rgba(201,168,76,0.1)", marginVertical: 18 },
  acLoadingBanner:{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(201,168,76,0.07)", borderRadius: 10, padding: 12, marginBottom: 12 },
  acLoadingTxt:   { color: MUTED, fontSize: 13 },
  apiErr:         { backgroundColor: "rgba(239,68,68,0.09)", borderWidth: 1, borderColor: "rgba(239,68,68,0.38)", borderRadius: 10, padding: 12, marginBottom: 12 },
  apiErrTxt:      { color: "#f87171", fontSize: 13, fontWeight: "500" },
  addBtn:         { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(201,168,76,0.35)", borderRadius: 12, padding: 13, marginBottom: 12 },
  addBtnTxt:      { color: GOLD, fontSize: 15, fontWeight: "600" },
  calcBtn:        { backgroundColor: GOLD, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginBottom: 16, shadowColor: GOLD, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 7 },
  calcDisabled:   { opacity: 0.6 },
  calcBtnTxt:     { color: BG, fontSize: 16, fontWeight: "800", letterSpacing: 0.4 },
  backBtn:        { borderWidth: 1, borderColor: "rgba(201,168,76,0.3)", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  backBtnTxt:     { color: GOLD, fontSize: 15, fontWeight: "600" },
  footer:         { textAlign: "center", color: "#2a3b4f", fontSize: 11, letterSpacing: 0.3 },
});