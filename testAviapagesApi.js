/**
 * AviaPages API Test Script
 * Run this to verify real data is coming from the API
 * 
 * Usage: node testAviapagesApi.js
 */

const API_BASE_URL = 'https://api.aviapages.com/v3';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

const getHeaders = () => ({
  'Authorization': `Token ${API_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

async function testAPI() {
  console.log('\n========================================');
  console.log('🚀 AVIAPAGES API TEST');
  console.log('========================================\n');

  // Test 1: Airport Search
  console.log('📍 TEST 1: Airport Search (Dubai)');
  console.log('─────────────────────────────────');
  try {
    const airportRes = await fetch(`${API_BASE_URL}/airports/?search=Dubai`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Status:', airportRes.status);
    
    if (airportRes.ok) {
      const data = await airportRes.json();
      console.log('✅ SUCCESS! Found', data.count || data.results?.length, 'airports');
      if (data.results && data.results.length > 0) {
        const airport = data.results[0];
        console.log('Sample Airport:', {
          name: airport.name,
          icao: airport.icao,
          iata: airport.iata,
          city: airport.city?.name,
        });
      }
    } else {
      const error = await airportRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 2: Charter Aircraft List
  console.log('\n📍 TEST 2: Charter Aircraft List');
  console.log('─────────────────────────────────');
  try {
    const aircraftRes = await fetch(`${API_BASE_URL}/charter_aircraft/?ordering=-year_of_production`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Status:', aircraftRes.status);
    
    if (aircraftRes.ok) {
      const data = await aircraftRes.json();
      console.log('✅ SUCCESS! Found', data.count || data.results?.length, 'aircraft');
      if (data.results && data.results.length > 0) {
        const aircraft = data.results[0];
        console.log('Sample Aircraft:', {
          id: aircraft.id,
          registration: aircraft.registration_number,
          type: aircraft.aircraft_type?.name,
          class: aircraft.aircraft_type?.aircraft_class?.name,
          year: aircraft.year_of_production,
          passengers: aircraft.passengers_max,
          company: aircraft.company?.name,
        });
      }
    } else {
      const error = await aircraftRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 3: Aircraft Classes
  console.log('\n📍 TEST 3: Aircraft Classes');
  console.log('─────────────────────────────────');
  try {
    const classesRes = await fetch(`${API_BASE_URL}/aircraft_classes/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Status:', classesRes.status);
    
    if (classesRes.ok) {
      const data = await classesRes.json();
      console.log('✅ SUCCESS! Found', data.count || data.results?.length, 'classes');
      if (data.results) {
        console.log('Classes:', data.results.map(c => c.name).join(', '));
      }
    } else {
      const error = await classesRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 4: Flight Time Calculator
  console.log('\n📍 TEST 4: Flight Time Calculator (Dubai → Abu Dhabi)');
  console.log('─────────────────────────────────');
  try {
    const flightTimeRes = await fetch(`${API_BASE_URL}/flight_calculator/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        departure_airport: { icao: 'OMDB' },
        arrival_airport: { icao: 'OMAA' },
      }),
    });
    
    console.log('Status:', flightTimeRes.status);
    
    if (flightTimeRes.ok) {
      const data = await flightTimeRes.json();
      console.log('✅ SUCCESS! Flight time calculated');
      console.log('Flight Time:', data.flight_time || data);
    } else {
      const error = await flightTimeRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 5: Charter Price Calculator
  console.log('\n📍 TEST 5: Price Calculator (Dubai → London)');
  console.log('─────────────────────────────────');
  try {
    const priceRes = await fetch(`${API_BASE_URL}/charter_prices/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        legs: [{
          departure_airport: { icao: 'OMDB' },
          arrival_airport: { icao: 'EGLL' },
          pax: 4,
          departure_datetime: '2026-03-01T10:00',
        }],
        aircraft: [{ ac_class: 'Heavy' }],
        currency_code: 'USD',
      }),
    });
    
    console.log('Status:', priceRes.status);
    
    if (priceRes.ok) {
      const data = await priceRes.json();
      console.log('✅ SUCCESS! Price calculated');
      console.log('Price:', data.price, data.currency_code || 'USD');
    } else {
      const error = await priceRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 6: Charter Search
  console.log('\n📍 TEST 6: Charter Search (Dubai → London)');
  console.log('─────────────────────────────────');
  try {
    const searchRes = await fetch(`${API_BASE_URL}/charter_search_aircraft/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        legs: [{
          departure_airport: { icao: 'OMDB' },
          arrival_airport: { icao: 'EGLL' },
          pax: 4,
        }],
      }),
    });
    
    console.log('Status:', searchRes.status);
    
    if (searchRes.ok) {
      const data = await searchRes.json();
      console.log('✅ SUCCESS! Found', data.aircraft?.length || 0, 'aircraft for route');
      if (data.aircraft && data.aircraft.length > 0) {
        console.log('Sample Result:', {
          id: data.aircraft[0].id,
          type: data.aircraft[0].aircraft_type,
          passengers: data.aircraft[0].passengers_max,
          company: data.aircraft[0].company?.name,
        });
      }
    } else {
      const error = await searchRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  // Test 7: Empty Legs / Availabilities
  console.log('\n📍 TEST 7: Empty Legs / Availabilities');
  console.log('─────────────────────────────────');
  try {
    const emptyLegsRes = await fetch(`${API_BASE_URL}/availabilities/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Status:', emptyLegsRes.status);
    
    if (emptyLegsRes.ok) {
      const data = await emptyLegsRes.json();
      console.log('✅ SUCCESS! Found', data.count || data.results?.length, 'empty legs');
      if (data.results && data.results.length > 0) {
        const leg = data.results[0];
        console.log('Sample Empty Leg:', {
          id: leg.id,
          from: leg.dep_airport?.icao,
          to: leg.arr_airport?.icao,
          aircraft: leg.aircraft_type,
          price: leg.price,
        });
      }
    } else {
      const error = await emptyLegsRes.text();
      console.log('❌ FAILED:', error);
    }
  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }

  console.log('\n========================================');
  console.log('🏁 TEST COMPLETE');
  console.log('========================================\n');
}

// Run the test
testAPI();
