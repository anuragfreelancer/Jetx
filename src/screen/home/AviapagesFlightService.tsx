// ─────────────────────────────────────────────────────────────────
//  aviapagesService.js
//  Aviapages 3 APIs → Real Price Extractor (Paid Account)
//  FIXED: apiKey properly passed through all API calls
// ─────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// ─── HELPER: Raw API call ─────────────────────────────────────────
async function apiCall(apiKey, method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey ? `Token ${apiKey}` : API_TOKEN,
    },
  };
  if (body) options.body = JSON.stringify(body);

  const url = `${BASE_URL}${path}`;
  console.log(`\n[Aviapages] ${method} ${url}`);
  if (body) console.log('[Aviapages] Request body:', JSON.stringify(body, null, 2));

  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  console.log(`[Aviapages] Status: ${res.status}`);
  console.log('[Aviapages] Full response:', JSON.stringify(data, null, 2));

  if (!res.ok) {
    const msg = data?.detail || data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ─── PRICE EXTRACTOR ─────────────────────────────────────────────
function extractRealPrice(response) {
  if (!response) return null;

  const directFields = [
    'price', 'total_price', 'charter_price', 'cost', 'total_cost',
    'amount', 'total_amount', 'estimated_price', 'price_total',
    'flight_price', 'charter_cost',
  ];

  for (const field of directFields) {
    if (response[field] && Number(response[field]) > 0) {
      return {
        amount: Number(response[field]),
        currency: response.currency || response.price_currency || 'USD',
        source: field,
        breakdown: response.price_breakdown || response.breakdown || null,
      };
    }
  }

  const nested = response.result || response.data || response.calculation || null;
  if (nested) {
    for (const field of directFields) {
      if (nested[field] && Number(nested[field]) > 0) {
        return {
          amount: Number(nested[field]),
          currency: nested.currency || response.currency || 'USD',
          source: `result.${field}`,
          breakdown: nested.price_breakdown || null,
        };
      }
    }
  }

  const legs = response.flights || response.legs || [];
  if (legs.length > 0) {
    const legPrices = legs.map((l) => l.price || l.cost || l.amount || 0).filter((p) => p > 0);
    if (legPrices.length > 0) {
      return {
        amount: legPrices.reduce((a, b) => a + b, 0),
        currency: legs[0]?.currency || 'USD',
        source: 'legs[].price (sum)',
        breakdown: legs,
      };
    }
  }

  return null;
}

// ─── FORMATTERS ──────────────────────────────────────────────────
export function formatCurrency(amount, currency = 'USD') {
  if (!amount) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

export function formatINR(amountUSD) {
  if (!amountUSD) return null;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountUSD * 84);
}

export function formatMinutes(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─────────────────────────────────────────────────────────────────
//  API 1 — GET /v3/charter_aircraft/
// ─────────────────────────────────────────────────────────────────
export async function fetchCharterAircraft(apiKey, { departure, arrival, category, passengers }) {
  const q = new URLSearchParams();
  if (departure)  q.append('departure',     departure.toUpperCase());
  if (arrival)    q.append('arrival',        arrival.toUpperCase());
  if (category)   q.append('category',       category);
  if (passengers) q.append('passengers_min', String(passengers));
  q.append('is_for_charter', 'true');
  q.append('page_size', '20');
  return apiCall(apiKey, 'GET', `/v3/charter_aircraft/?${q.toString()}`);
}

// ─── Airport object helper ────────────────────────────────────────
function airportObj(code) {
  const c = (code || '').toUpperCase().trim();
  return c.length === 4 ? { icao: c } : { iata: c };
}

// ─── Aircraft class normalizer ────────────────────────────────────
function normalizeAcClass(cls) {
  if (!cls) return null;
  const map = {
    'light jet': 'Light', 'light': 'Light',
    'midsize jet': 'Midsize', 'midsize': 'Midsize',
    'super midsize': 'Super midsize', 'super_midsize': 'Super midsize',
    'heavy jet': 'Heavy', 'heavy': 'Heavy',
    'turboprop': 'Turboprop', 'piston': 'Piston',
    'helicopter': 'Helicopter', 'vip airliner': 'VIP Airliner',
    'ultra long range': 'Ultra long range',
  };
  return map[cls.toLowerCase().trim()] || cls;
}

// ─────────────────────────────────────────────────────────────────
//  STEP 0 — POST /v3/charter_prices/
// ─────────────────────────────────────────────────────────────────
async function fetchCharterPrices(apiKey, { departure, arrival, passengers, date, aircraftClass }) {
  const body = {
    legs: [{
      departure_airport:  airportObj(departure),
      arrival_airport:    airportObj(arrival),
      pax:                parseInt(passengers, 10) || 2,
      departure_datetime: date
        ? `${date}T00:00`
        : `${new Date().toISOString().slice(0, 10)}T00:00`,
    }],
    currency_code: 'USD',
  };
  const normalizedClass = normalizeAcClass(aircraftClass);
  if (normalizedClass) body.aircraft = [{ ac_class: normalizedClass }];
  return apiCall(apiKey, 'POST', '/v3/charter_prices/', body);
}

// ─────────────────────────────────────────────────────────────────
//  API 2 — POST /v3/flight_calculator/
// ─────────────────────────────────────────────────────────────────
export async function fetchFlightCalculator(apiKey, { departure, arrival, aircraft, date }:any) {
  const body = {
    departure_airport: departure.toUpperCase(),
    arrival_airport:   arrival.toUpperCase(),
  };
  if (aircraft) body.aircraft = aircraft;
  if (date)     body.date     = date;
  return apiCall(apiKey, 'POST', '/v3/flight_calculator/', body);
}

// ─────────────────────────────────────────────────────────────────
//  API 3 — POST /v3/price_calculator/
// ─────────────────────────────────────────────────────────────────
export async function fetchPriceCalculator(apiKey, { departure, arrival, aircraft, date, passengers, profile }) {
  const body = {
    departure_airport: departure.toUpperCase(),
    arrival_airport:   arrival.toUpperCase(),
  };
  if (aircraft)   body.aircraft        = aircraft;
  if (date)       body.date            = date;
  if (passengers) body.pax             = parseInt(passengers, 10);
  if (passengers) body.passengers      = parseInt(passengers, 10);
  if (profile)    body.profile         = profile;
  if (profile)    body.pricing_profile = profile;
  return apiCall(apiKey, 'POST', '/v3/price_calculator/', body);
}

// ─────────────────────────────────────────────────────────────────
//  MASTER FUNCTION
// ─────────────────────────────────────────────────────────────────
export async function fetchCompleteFlightData(apiKey, searchParams) {
  const { departure, arrival, date, passengers, category, profile } = searchParams;

  console.log('\n════ STEP 1: Charter Aircraft ════');
  const aircraftData = await fetchCharterAircraft(apiKey, { departure, arrival, category, passengers });
  
  
  console.log("aircraftData",aircraftData)
  const aircraftList = aircraftData.results || [];
  if (aircraftList.length === 0) return { enrichedList: [], total: 0 };

  const enrichedList = await Promise.allSettled(
    aircraftList.slice(0, 15).map(async (ac) => {
      const aircraftName  = ac.aircraft_type?.name || 'Charter Aircraft';
      const aircraftClass = ac.aircraft_type?.aircraft_class?.name || '';

      // ── STEP 2: Flight Calculator ──────────────────────────────
      console.log(`\n════ STEP 2: Flight Calc — ${aircraftName} ════`);
      let flightTimeMinutes = null;
      try {
        const fc = await fetchFlightCalculator(apiKey, { departure, arrival, aircraft: aircraftName, date });
        flightTimeMinutes = fc?.time?.airway ?? null;
      } catch (err) {
        console.warn(`[FlightCalc] ${aircraftName}:`, err.message);
      }

      // ── STEP 3: Price Calculator ───────────────────────────────
      console.log(`\n════ STEP 3: Price Calc — ${aircraftName} ════`);
      let priceRawResponse = null;
      let priceResult      = null;
      let legTotalMinutes  = null;
      let legs             = [];
      try {
        const pc = await fetchPriceCalculator(apiKey, {
          departure, arrival, aircraft: aircraftName, date, passengers, profile,
        });
        priceRawResponse = pc;
        priceResult      = extractRealPrice(pc);
        legs = pc?.flights || pc?.legs || [];
        if (legs.length > 0) legTotalMinutes = legs.reduce((s, l) => s + (l.flight_time || 0), 0);
        if (priceResult) {
                    console.log(`[Price]` ,`${priceResult.amount} ${priceResult.currency}`);

          console.log(`[Price] ✅ ${priceResult.amount} ${priceResult.currency} (via "${priceResult.source}")`);
        } else {
          console.warn(`[Price] ⚠️ No price for ${aircraftName}. Keys:`, Object.keys(pc || {}));
        }
      } catch (err) {
        console.warn(`[PriceCalc] ${aircraftName}:`, err.message);
      }

      const bestFlightTime = flightTimeMinutes || legTotalMinutes;

      // ── STEP 0: Charter Prices ─────────────────────────────────
      console.log(`\n════ STEP 0: Charter Price — ${aircraftClass || 'Any'} ════`);
      let classPrice = null;
      try {
        const cp = await fetchCharterPrices(apiKey, {
          departure, arrival, passengers, date, aircraftClass: aircraftClass || undefined,
        });
        console.log(`[CharterPrices][${aircraftClass}] Response:`, JSON.stringify(cp, null, 2));
        const min      = Number(cp?.price_min || 0) || null;
        const max      = Number(cp?.price_max || 0) || null;
        const mid      = Number(cp?.price     || 0) || (min && max ? Math.round((min + max) / 2) : null);
        const currency = cp?.currency_code || cp?.currency || 'USD';
        if (mid || min || max) {
          classPrice = { min, max, mid, currency };
          console.log(`[CharterPrices] ✅ ${aircraftClass}: ${mid} ${currency}`);
        } else {
          console.warn(`[CharterPrices] ⚠️ No price for class ${aircraftClass}`);
        }
      } catch (err) {
        console.warn(`[CharterPrices][${aircraftClass}] Failed:`, err.message);
      }

      // ── Merge prices ───────────────────────────────────────────
      const hasExactPrice         = !!(priceResult?.amount);
      const hasRangePrice         = !!(classPrice?.min || classPrice?.max || classPrice?.mid);
      const hasRealPrice          = hasExactPrice || hasRangePrice;
      const realPriceCurrency     = priceResult?.currency || classPrice?.currency || 'USD';
      const realPriceMin          = !hasExactPrice ? (classPrice?.min || null) : null;
      const realPriceMax          = !hasExactPrice ? (classPrice?.max || null) : null;
      const realPriceMid          = priceResult?.amount || classPrice?.mid || null;
      const isRangePrice          = !hasExactPrice && !!(classPrice?.min && classPrice?.max);
      const realPriceMidFormatted = realPriceMid ? formatCurrency(realPriceMid, realPriceCurrency) : null;
      const realPriceINR          = realPriceMid && realPriceCurrency === 'USD' ? formatINR(realPriceMid) : null;

      return {
        id:              ac.id,
        aircraftName,
        aircraftClass,
        icao:            ac.aircraft_type?.icao          || '',
        registration:    ac.registration_number           || '',
        year:            ac.year_of_production            || '',
        passengersMax:   ac.passengers_max                || 0,
        serialNumber:    ac.serial_number                 || '',
        isForCharter:    ac.is_for_charter,
        image:           ac.images?.[0]?.media?.path      || null,
        baseAirport:     ac.base_airport?.icao            || '',
        baseCity:        ac.base_airport?.city?.name      || '',
        company:         ac.company?.name                 || '',
        companyPhone:    ac.company?.phone                || '',
        companyWebsite:  ac.company?.website              || '',
        companyCity:     ac.company?.city?.name           || '',
        companyCountry:  ac.company?.city?.country?.name  || '',
        isOperator:      ac.company?.is_operator          || false,
        lavatory:        ac.aircraft_extension?.lavatory,
        wifi:            ac.aircraft_extension?.wireless_internet,
        pets:            ac.aircraft_extension?.pets_allowed,
        flightTimeMinutes,
        flightTimeFormatted: formatMinutes(flightTimeMinutes),
        legs,
        legTotalMinutes,
        priceRawResponse,
        hasRealPrice,
        isRangePrice,
        realPriceMin,
        realPriceMax,
        realPriceMid,
        realPriceMidFormatted,
        realPriceCurrency,
        realPriceINR,
        realPriceAmount:  realPriceMid,
        realPriceSource:  priceResult?.source || (hasRangePrice ? 'charter_prices' : null),
        priceBreakdown:   priceResult?.breakdown || null,
        bestFlightTime,
        bestFlightTimeFormatted: formatMinutes(bestFlightTime),
      };
    })
  );

  const finalList = enrichedList
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => (a.realPriceAmount || 999999) - (b.realPriceAmount || 999999));
console.log("enrichedList. ---=  --- ",enrichedList)
  const withPrice    = finalList.filter((f) => f.hasRealPrice).length;
  const withoutPrice = finalList.filter((f) => !f.hasRealPrice).length;

  console.log(`\n════ SUMMARY ════`);
  console.log(`Total aircraft:  ${finalList.length}`);
  console.log(`With real price: ${withPrice}`);
  console.log(`Without price:   ${withoutPrice}`);

  return {
    enrichedList: finalList,
    total:    aircraftData.count    || 0,
    nextPage: aircraftData.next     || null,
    prevPage: aircraftData.previous || null,
  };
}