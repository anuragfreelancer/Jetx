// ResultsScreen.js — Charter Prices Display (price range from /v3/charter_prices/)

import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, ScrollView, Platform,
} from 'react-native';

// ─── Flight Card ──────────────────────────────────────────────────
function FlightCard({ item, departure, arrival }) {
  const [open, setOpen] = useState(false);

  const hasPrice = item.hasRealPrice && item.realPriceAmount > 0;
  const hasTime  = !!item.bestFlightTimeFormatted;

  return (
    <TouchableOpacity style={S.card} onPress={() => setOpen(v => !v)} activeOpacity={0.92}>

      {/* ── TOP: image + name + pills ── */}
      <View style={S.cardTop}>
        <View style={S.imgWrap}>
          {item.image
            ? <Image source={{ uri: item.image }} style={S.img} resizeMode="cover" />
            : <View style={S.imgFallback}><Text style={S.imgIcon}>✈</Text></View>
          }
        </View>
        <View style={S.info}>
          <Text style={S.acName} numberOfLines={1}>{item.aircraftName}</Text>
          <Text style={S.acMeta}>{item.aircraftClass}  ·  {item.registration || 'N/A'}  ·  {item.year || '—'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={S.pills}>
              {item.isForCharter && <Pill text="Charter" color="green" />}
              <Pill text={`${item.passengersMax} pax`} color="blue" />
              {item.lavatory && <Pill text="Lavatory" />}
              {item.wifi     && <Pill text="WiFi" />}
              {item.pets     && <Pill text="Pets OK" />}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ── ROUTE + PRICE ROW ── */}
      <View style={S.routeRow}>

        {/* Route */}
        <View style={S.routeLeft}>
          <Text style={S.iata}>{departure}</Text>
          <View style={S.routeMid}>
            <View style={S.dash} />
            <Text style={S.dur}>{hasTime ? item.bestFlightTimeFormatted : '—'}</Text>
            <View style={S.dash} />
          </View>
          <Text style={S.iata}>{arrival}</Text>
        </View>

        {/* ── PRICE SECTION ── */}
        <View style={S.priceBox}>
          <Text style={S.priceLabel}>EST. CHARTER</Text>

          {hasPrice ? (
            <>
              {/* Range: show min–max, or single price */}
              {item.isRangePrice ? (
                <>
                  <Text style={S.priceFrom}>
                    from {item.realPriceMin
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: item.realPriceCurrency, maximumFractionDigits: 0 }).format(item.realPriceMin)
                      : '—'}
                  </Text>
                  <Text style={S.priceTo}>
                    to {item.realPriceMax
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: item.realPriceCurrency, maximumFractionDigits: 0 }).format(item.realPriceMax)
                      : '—'}
                  </Text>
                </>
              ) : (
                <Text style={S.priceReal}>{item.realPriceMidFormatted}</Text>
              )}

              {/* INR */}
              {item.realPriceINR && (
                <Text style={S.priceINR}>{item.realPriceINR}</Text>
              )}

              <View style={S.rangeBadge}>
                <Text style={S.rangeBadgeTxt}>
                  {item.isRangePrice ? '〜 Est. range' : '✓ Est. price'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={S.noPrice}>Contact</Text>
              <Text style={S.noPriceNote}>operator for price</Text>
            </>
          )}
        </View>
      </View>

      {/* ── EXPANDED DETAIL PANEL ── */}
      {open && (
        <View style={S.panel}>

          {/* Price detail */}
          {hasPrice && (
            <>
              <SectionTitle text="Price Detail" />
              <InfoCard>
                {item.isRangePrice && (
                  <>
                    <InfoRow label="Price from" value={
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: item.realPriceCurrency, maximumFractionDigits: 0 }).format(item.realPriceMin)
                    } highlight />
                    <InfoRow label="Price to" value={
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: item.realPriceCurrency, maximumFractionDigits: 0 }).format(item.realPriceMax)
                    } highlight />
                    <InfoRow label="Midpoint" value={item.realPriceMidFormatted} />
                  </>
                )}
                {!item.isRangePrice && (
                  <InfoRow label="Estimated price" value={item.realPriceMidFormatted} highlight />
                )}
                {item.realPriceINR && (
                  <InfoRow label="In INR" value={item.realPriceINR} highlight />
                )}
                <InfoRow label="Currency" value={item.realPriceCurrency} />
                <InfoRow label="Source" value="charter_prices API" />
              </InfoCard>
            </>
          )}

          {/* Aircraft info */}
          <SectionTitle text="Aircraft" />
          <InfoCard>
            <InfoRow label="Name"         value={item.aircraftName} />
            <InfoRow label="ICAO type"    value={item.icao} />
            <InfoRow label="Class"        value={item.aircraftClass} />
            <InfoRow label="Registration" value={item.registration} />
            <InfoRow label="Year"         value={String(item.year || '—')} />
            <InfoRow label="Serial no."   value={item.serialNumber || '—'} />
            <InfoRow label="Max pax"      value={String(item.passengersMax)} />
            <InfoRow label="Base"         value={`${item.baseAirport} · ${item.baseCity}`} />
          </InfoCard>

          {/* Flight time */}
          <SectionTitle text="Flight Time" />
          <InfoCard>
            <InfoRow label="Route" value={`${departure} → ${arrival}`} />
            <InfoRow
              label="Airway time"
              value={item.flightTimeMinutes
                ? `${item.flightTimeMinutes} min  (${item.flightTimeFormatted})`
                : '—'}
            />
          </InfoCard>

          {/* Operator */}
          <SectionTitle text="Operator" />
          <View style={S.opRow}>
            <View style={S.opLogo}>
              <Text style={S.opLogoTxt}>{(item.company || 'OP').slice(0, 2).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.opName}>{item.company || '—'}</Text>
              <Text style={S.opDetail}>{[item.companyCity, item.companyCountry].filter(Boolean).join(', ')}</Text>
              {!!item.companyPhone   && <Text style={S.opDetail}>{item.companyPhone}</Text>}
              {!!item.companyWebsite && <Text style={S.opLink}>{item.companyWebsite}</Text>}
            </View>
          </View>

        </View>
      )}

      {/* Expand hint */}
      <View style={S.expandRow}>
        <Text style={S.expandTxt}>{open ? '▲ Less' : '▼ Details'}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Small Components ─────────────────────────────────────────────
function Pill({ text, color }) {
  const styles = {
    green: { bg: '#f0fdf4', border: '#bbf7d0', txt: '#16a34a' },
    blue:  { bg: '#eff6ff', border: '#bfdbfe', txt: '#2563eb' },
    gray:  { bg: '#f8fafc', border: '#e2e8f0', txt: '#475569' },
  };
  const c = styles[color] || styles.gray;
  return (
    <View style={{ backgroundColor: c.bg, borderColor: c.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11, color: c.txt, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

function SectionTitle({ text }) {
  return <Text style={S.secTitle}>{text}</Text>;
}

function InfoCard({ children }) {
  return <View style={S.infoCard}>{children}</View>;
}

function InfoRow({ label, value, highlight }) {
  return (
    <View style={S.infoRow}>
      <Text style={S.infoLabel}>{label}</Text>
      <Text style={[S.infoValue, highlight && S.infoHighlight]}>{value || '—'}</Text>
    </View>
  );
}

// ─── Results Screen ───────────────────────────────────────────────
export default function ResultsScreen({ route, navigation }) {
  const { flights, total, departure, arrival, date, passengers } = route.params;

  const withPrice    = flights.filter(f => f.hasRealPrice).length;
  const withoutPrice = flights.filter(f => !f.hasRealPrice).length;

  return (
    <View style={S.screen}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Text style={S.backTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={S.headerTitle}>{departure} → {arrival}</Text>
          <Text style={S.headerSub}>{date}  ·  {passengers} pax  ·  {total} total</Text>
        </View>
      </View>

      {/* Stats bar */}
      <View style={S.statsBar}>
        <View style={S.statItem}>
          <Text style={S.statNum}>{flights.length}</Text>
          <Text style={S.statLbl}>shown</Text>
        </View>
        <View style={S.statDivider} />
        <View style={S.statItem}>
          <Text style={[S.statNum, { color: '#16a34a' }]}>{withPrice}</Text>
          <Text style={S.statLbl}>with price</Text>
        </View>
        <View style={S.statDivider} />
        <View style={S.statItem}>
          <Text style={[S.statNum, { color: '#f59e0b' }]}>{withoutPrice}</Text>
          <Text style={S.statLbl}>contact op.</Text>
        </View>
      </View>

      <FlatList
        data={flights}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={({ item }) => (
          <FlightCard item={item} departure={departure} arrival={arrival} />
        )}
        contentContainerStyle={S.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={S.empty}>
            <Text style={S.emptyIcon}>✈</Text>
            <Text style={S.emptyTitle}>No flights found</Text>
            <Text style={S.emptyTxt}>Try changing the route or aircraft class.</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 16,
  },
  backBtn:     { padding: 4 },
  backTxt:     { color: '#bfdbfe', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub:   { color: '#93c5fd', fontSize: 12, marginTop: 2 },

  statsBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#e2e8f0' },
  statNum:     { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  statLbl:     { fontSize: 11, color: '#64748b', marginTop: 1 },

  list: { padding: 12, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', gap: 12, padding: 14, alignItems: 'flex-start' },
  imgWrap: { flexShrink: 0 },
  img:     { width: 68, height: 68, borderRadius: 12, backgroundColor: '#f1f5f9' },
  imgFallback: {
    width: 68, height: 68, borderRadius: 12,
    backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  imgIcon: { fontSize: 28, color: '#94a3b8' },
  info:    { flex: 1 },
  acName:  { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 3 },
  acMeta:  { fontSize: 12, color: '#64748b', marginBottom: 8 },
  pills:   { flexDirection: 'row', gap: 6 },

  // Route + price
  routeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
    paddingHorizontal: 14, paddingVertical: 14,
  },
  routeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  iata:      { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: 1 },
  routeMid:  { flex: 1, alignItems: 'center', gap: 3 },
  dash:      { width: '100%', height: 1, backgroundColor: '#e2e8f0' },
  dur:       { fontSize: 10, color: '#94a3b8', letterSpacing: 0.3 },

  priceBox:   { alignItems: 'flex-end', minWidth: 120 },
  priceLabel: { fontSize: 9, color: '#94a3b8', letterSpacing: 1.2, fontWeight: '700', marginBottom: 3 },

  // Range price styles
  priceFrom: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  priceTo:   { fontSize: 13, fontWeight: '600', color: '#475569' },

  // Single price
  priceReal: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  priceINR:  { fontSize: 12, fontWeight: '700', color: '#2563eb', marginTop: 2 },

  rangeBadge: {
    backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1,
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4,
  },
  rangeBadgeTxt: { fontSize: 10, color: '#16a34a', fontWeight: '700' },

  // No price
  noPrice:     { fontSize: 16, fontWeight: '700', color: '#94a3b8' },
  noPriceNote: { fontSize: 10, color: '#94a3b8', marginTop: 2 },

  // Expand
  expandRow: {
    alignItems: 'center', paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: '#f8fafc',
  },
  expandTxt: { fontSize: 11, color: '#94a3b8' },

  // Detail panel
  panel: {
    backgroundColor: '#f8fafc', borderTopWidth: 1,
    borderTopColor: '#e2e8f0', padding: 14,
  },
  secTitle: {
    fontSize: 11, fontWeight: '700', color: '#3b82f6',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginTop: 14, marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  infoLabel:     { fontSize: 12, color: '#64748b', flex: 1 },
  infoValue:     { fontSize: 12, color: '#0f172a', fontWeight: '500', flex: 1, textAlign: 'right' },
  infoHighlight: { color: '#2563eb', fontWeight: '800', fontSize: 13 },

  opRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', padding: 12,
  },
  opLogo: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center',
  },
  opLogoTxt: { fontSize: 13, fontWeight: '800', color: '#2563eb' },
  opName:    { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 3 },
  opDetail:  { fontSize: 12, color: '#64748b', lineHeight: 18 },
  opLink:    { fontSize: 12, color: '#2563eb', marginTop: 2 },

  empty:      { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:  { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptyTxt:   { fontSize: 14, color: '#64748b', textAlign: 'center' },
});