import { getCharterAircraft, calculateCharterPrice, calculateFlightTime, searchCharterAircraft } from '../../Aviapages/api';
import { base_url, constant } from '../../config/constant';

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
const SERVICE_FEE_PERCENTAGE = 10;

// ============================================================
// COMPREHENSIVE AIRPORT DATABASE (500+ airports – fallback)
// ============================================================
const AIRPORT_DATABASE = [
  // ── Middle East ──────────────────────────────────────────
  { id: 'DXB', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', displayName: 'Dubai International Airport (DXB)', timezone: 'Asia/Dubai', hasPrivateTerminal: true },
  { id: 'AUH', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', displayName: 'Abu Dhabi International Airport (AUH)', timezone: 'Asia/Dubai', hasPrivateTerminal: true },
  { id: 'SHJ', iataCode: 'SHJ', city: 'Sharjah', country: 'United Arab Emirates', displayName: 'Sharjah International Airport (SHJ)', timezone: 'Asia/Dubai', hasPrivateTerminal: true },
  { id: 'RKT', iataCode: 'RKT', city: 'Ras Al Khaimah', country: 'United Arab Emirates', displayName: 'Ras Al Khaimah International Airport (RKT)', timezone: 'Asia/Dubai', hasPrivateTerminal: true },
  { id: 'FJR', iataCode: 'FJR', city: 'Fujairah', country: 'United Arab Emirates', displayName: 'Fujairah International Airport (FJR)', timezone: 'Asia/Dubai', hasPrivateTerminal: false },
  { id: 'DOH', iataCode: 'DOH', city: 'Doha', country: 'Qatar', displayName: 'Hamad International Airport (DOH)', timezone: 'Asia/Qatar', hasPrivateTerminal: true },
  { id: 'RUH', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', displayName: 'King Khalid International Airport (RUH)', timezone: 'Asia/Riyadh', hasPrivateTerminal: true },
  { id: 'JED', iataCode: 'JED', city: 'Jeddah', country: 'Saudi Arabia', displayName: 'King Abdulaziz International Airport (JED)', timezone: 'Asia/Riyadh', hasPrivateTerminal: true },
  { id: 'DMM', iataCode: 'DMM', city: 'Dammam', country: 'Saudi Arabia', displayName: 'King Fahd International Airport (DMM)', timezone: 'Asia/Riyadh', hasPrivateTerminal: true },
  { id: 'MED', iataCode: 'MED', city: 'Madinah', country: 'Saudi Arabia', displayName: 'Prince Mohammad Bin Abdulaziz Airport (MED)', timezone: 'Asia/Riyadh', hasPrivateTerminal: false },
  { id: 'ABH', iataCode: 'ABH', city: 'Abha', country: 'Saudi Arabia', displayName: 'Abha International Airport (ABH)', timezone: 'Asia/Riyadh', hasPrivateTerminal: false },
  { id: 'TIF', iataCode: 'TIF', city: 'Taif', country: 'Saudi Arabia', displayName: 'Taif Regional Airport (TIF)', timezone: 'Asia/Riyadh', hasPrivateTerminal: false },
  { id: 'KWI', iataCode: 'KWI', city: 'Kuwait City', country: 'Kuwait', displayName: 'Kuwait International Airport (KWI)', timezone: 'Asia/Kuwait', hasPrivateTerminal: true },
  { id: 'BAH', iataCode: 'BAH', city: 'Manama', country: 'Bahrain', displayName: 'Bahrain International Airport (BAH)', timezone: 'Asia/Bahrain', hasPrivateTerminal: true },
  { id: 'MCT', iataCode: 'MCT', city: 'Muscat', country: 'Oman', displayName: 'Muscat International Airport (MCT)', timezone: 'Asia/Muscat', hasPrivateTerminal: true },
  { id: 'SLL', iataCode: 'SLL', city: 'Salalah', country: 'Oman', displayName: 'Salalah Airport (SLL)', timezone: 'Asia/Muscat', hasPrivateTerminal: false },
  { id: 'AMM', iataCode: 'AMM', city: 'Amman', country: 'Jordan', displayName: 'Queen Alia International Airport (AMM)', timezone: 'Asia/Amman', hasPrivateTerminal: true },
  { id: 'BGW', iataCode: 'BGW', city: 'Baghdad', country: 'Iraq', displayName: 'Baghdad International Airport (BGW)', timezone: 'Asia/Baghdad', hasPrivateTerminal: false },
  { id: 'EBL', iataCode: 'EBL', city: 'Erbil', country: 'Iraq', displayName: 'Erbil International Airport (EBL)', timezone: 'Asia/Baghdad', hasPrivateTerminal: false },
  { id: 'TLV', iataCode: 'TLV', city: 'Tel Aviv', country: 'Israel', displayName: 'Ben Gurion Airport (TLV)', timezone: 'Asia/Jerusalem', hasPrivateTerminal: true },
  { id: 'BEY', iataCode: 'BEY', city: 'Beirut', country: 'Lebanon', displayName: 'Rafic Hariri International Airport (BEY)', timezone: 'Asia/Beirut', hasPrivateTerminal: false },
  { id: 'DAM', iataCode: 'DAM', city: 'Damascus', country: 'Syria', displayName: 'Damascus International Airport (DAM)', timezone: 'Asia/Damascus', hasPrivateTerminal: false },
  { id: 'THR', iataCode: 'IKA', city: 'Tehran', country: 'Iran', displayName: 'Imam Khomeini International Airport (IKA)', timezone: 'Asia/Tehran', hasPrivateTerminal: false },
  { id: 'KBL', iataCode: 'KBL', city: 'Kabul', country: 'Afghanistan', displayName: 'Hamid Karzai International Airport (KBL)', timezone: 'Asia/Kabul', hasPrivateTerminal: false },
  { id: 'CAI', iataCode: 'CAI', city: 'Cairo', country: 'Egypt', displayName: 'Cairo International Airport (CAI)', timezone: 'Africa/Cairo', hasPrivateTerminal: true },
  { id: 'HRG', iataCode: 'HRG', city: 'Hurghada', country: 'Egypt', displayName: 'Hurghada International Airport (HRG)', timezone: 'Africa/Cairo', hasPrivateTerminal: false },
  { id: 'SSH', iataCode: 'SSH', city: 'Sharm El Sheikh', country: 'Egypt', displayName: 'Sharm El Sheikh International Airport (SSH)', timezone: 'Africa/Cairo', hasPrivateTerminal: false },
  { id: 'LXR', iataCode: 'LXR', city: 'Luxor', country: 'Egypt', displayName: 'Luxor International Airport (LXR)', timezone: 'Africa/Cairo', hasPrivateTerminal: false },
  { id: 'ASW', iataCode: 'ASW', city: 'Aswan', country: 'Egypt', displayName: 'Aswan International Airport (ASW)', timezone: 'Africa/Cairo', hasPrivateTerminal: false },
  { id: 'SKT', iataCode: 'SKT', city: 'Sialkot', country: 'Pakistan', displayName: 'Sialkot International Airport (SKT)', timezone: 'Asia/Karachi', hasPrivateTerminal: false },

  // ── Europe ────────────────────────────────────────────────
  { id: 'LHR', iataCode: 'LHR', city: 'London', country: 'United Kingdom', displayName: 'Heathrow Airport (LHR)', timezone: 'Europe/London', hasPrivateTerminal: true },
  { id: 'LGW', iataCode: 'LGW', city: 'London', country: 'United Kingdom', displayName: 'Gatwick Airport (LGW)', timezone: 'Europe/London', hasPrivateTerminal: true },
  { id: 'STN', iataCode: 'STN', city: 'London', country: 'United Kingdom', displayName: 'Stansted Airport (STN)', timezone: 'Europe/London', hasPrivateTerminal: true },
  { id: 'LTN', iataCode: 'LTN', city: 'London', country: 'United Kingdom', displayName: 'Luton Airport (LTN)', timezone: 'Europe/London', hasPrivateTerminal: false },
  { id: 'FAB', iataCode: 'FAB', city: 'London', country: 'United Kingdom', displayName: 'Farnborough Airport (FAB)', timezone: 'Europe/London', hasPrivateTerminal: true },
  { id: 'EDI', iataCode: 'EDI', city: 'Edinburgh', country: 'United Kingdom', displayName: 'Edinburgh Airport (EDI)', timezone: 'Europe/London', hasPrivateTerminal: false },
  { id: 'MAN', iataCode: 'MAN', city: 'Manchester', country: 'United Kingdom', displayName: 'Manchester Airport (MAN)', timezone: 'Europe/London', hasPrivateTerminal: false },
  { id: 'BHX', iataCode: 'BHX', city: 'Birmingham', country: 'United Kingdom', displayName: 'Birmingham Airport (BHX)', timezone: 'Europe/London', hasPrivateTerminal: false },
  { id: 'CDG', iataCode: 'CDG', city: 'Paris', country: 'France', displayName: 'Charles de Gaulle Airport (CDG)', timezone: 'Europe/Paris', hasPrivateTerminal: true },
  { id: 'ORY', iataCode: 'ORY', city: 'Paris', country: 'France', displayName: 'Orly Airport (ORY)', timezone: 'Europe/Paris', hasPrivateTerminal: false },
  { id: 'LBG', iataCode: 'LBG', city: 'Paris', country: 'France', displayName: 'Le Bourget Airport (LBG)', timezone: 'Europe/Paris', hasPrivateTerminal: true },
  { id: 'NCE', iataCode: 'NCE', city: 'Nice', country: 'France', displayName: 'Nice Côte d\'Azur Airport (NCE)', timezone: 'Europe/Paris', hasPrivateTerminal: true },
  { id: 'LYS', iataCode: 'LYS', city: 'Lyon', country: 'France', displayName: 'Lyon-Saint Exupery Airport (LYS)', timezone: 'Europe/Paris', hasPrivateTerminal: false },
  { id: 'MRS', iataCode: 'MRS', city: 'Marseille', country: 'France', displayName: 'Marseille Provence Airport (MRS)', timezone: 'Europe/Paris', hasPrivateTerminal: false },
  { id: 'FRA', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', displayName: 'Frankfurt Airport (FRA)', timezone: 'Europe/Berlin', hasPrivateTerminal: true },
  { id: 'MUC', iataCode: 'MUC', city: 'Munich', country: 'Germany', displayName: 'Munich Airport (MUC)', timezone: 'Europe/Berlin', hasPrivateTerminal: true },
  { id: 'BER', iataCode: 'BER', city: 'Berlin', country: 'Germany', displayName: 'Berlin Brandenburg Airport (BER)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'HAM', iataCode: 'HAM', city: 'Hamburg', country: 'Germany', displayName: 'Hamburg Airport (HAM)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'DUS', iataCode: 'DUS', city: 'Dusseldorf', country: 'Germany', displayName: 'Dusseldorf Airport (DUS)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'CGN', iataCode: 'CGN', city: 'Cologne', country: 'Germany', displayName: 'Cologne Bonn Airport (CGN)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'STR', iataCode: 'STR', city: 'Stuttgart', country: 'Germany', displayName: 'Stuttgart Airport (STR)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'AMS', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', displayName: 'Amsterdam Schiphol Airport (AMS)', timezone: 'Europe/Amsterdam', hasPrivateTerminal: true },
  { id: 'MAD', iataCode: 'MAD', city: 'Madrid', country: 'Spain', displayName: 'Adolfo Suárez Madrid-Barajas Airport (MAD)', timezone: 'Europe/Madrid', hasPrivateTerminal: true },
  { id: 'BCN', iataCode: 'BCN', city: 'Barcelona', country: 'Spain', displayName: 'Barcelona El Prat Airport (BCN)', timezone: 'Europe/Madrid', hasPrivateTerminal: true },
  { id: 'AGP', iataCode: 'AGP', city: 'Malaga', country: 'Spain', displayName: 'Málaga-Costa del Sol Airport (AGP)', timezone: 'Europe/Madrid', hasPrivateTerminal: false },
  { id: 'PMI', iataCode: 'PMI', city: 'Palma de Mallorca', country: 'Spain', displayName: 'Palma de Mallorca Airport (PMI)', timezone: 'Europe/Madrid', hasPrivateTerminal: false },
  { id: 'IBZ', iataCode: 'IBZ', city: 'Ibiza', country: 'Spain', displayName: 'Ibiza Airport (IBZ)', timezone: 'Europe/Madrid', hasPrivateTerminal: false },
  { id: 'FCO', iataCode: 'FCO', city: 'Rome', country: 'Italy', displayName: 'Leonardo da Vinci–Fiumicino Airport (FCO)', timezone: 'Europe/Rome', hasPrivateTerminal: true },
  { id: 'CIA', iataCode: 'CIA', city: 'Rome', country: 'Italy', displayName: 'Ciampino Airport (CIA)', timezone: 'Europe/Rome', hasPrivateTerminal: false },
  { id: 'MXP', iataCode: 'MXP', city: 'Milan', country: 'Italy', displayName: 'Milan Malpensa Airport (MXP)', timezone: 'Europe/Rome', hasPrivateTerminal: true },
  { id: 'LIN', iataCode: 'LIN', city: 'Milan', country: 'Italy', displayName: 'Milan Linate Airport (LIN)', timezone: 'Europe/Rome', hasPrivateTerminal: true },
  { id: 'VCE', iataCode: 'VCE', city: 'Venice', country: 'Italy', displayName: 'Venice Marco Polo Airport (VCE)', timezone: 'Europe/Rome', hasPrivateTerminal: false },
  { id: 'NAP', iataCode: 'NAP', city: 'Naples', country: 'Italy', displayName: 'Naples International Airport (NAP)', timezone: 'Europe/Rome', hasPrivateTerminal: false },
  { id: 'BRU', iataCode: 'BRU', city: 'Brussels', country: 'Belgium', displayName: 'Brussels Airport (BRU)', timezone: 'Europe/Brussels', hasPrivateTerminal: true },
  { id: 'ZRH', iataCode: 'ZRH', city: 'Zurich', country: 'Switzerland', displayName: 'Zurich Airport (ZRH)', timezone: 'Europe/Zurich', hasPrivateTerminal: true },
  { id: 'GVA', iataCode: 'GVA', city: 'Geneva', country: 'Switzerland', displayName: 'Geneva Airport (GVA)', timezone: 'Europe/Zurich', hasPrivateTerminal: true },
  { id: 'BSL', iataCode: 'BSL', city: 'Basel', country: 'Switzerland', displayName: 'EuroAirport Basel Mulhouse Freiburg (BSL)', timezone: 'Europe/Zurich', hasPrivateTerminal: false },
  { id: 'VIE', iataCode: 'VIE', city: 'Vienna', country: 'Austria', displayName: 'Vienna International Airport (VIE)', timezone: 'Europe/Vienna', hasPrivateTerminal: true },
  { id: 'PRG', iataCode: 'PRG', city: 'Prague', country: 'Czech Republic', displayName: 'Václav Havel Airport Prague (PRG)', timezone: 'Europe/Prague', hasPrivateTerminal: false },
  { id: 'WAW', iataCode: 'WAW', city: 'Warsaw', country: 'Poland', displayName: 'Warsaw Chopin Airport (WAW)', timezone: 'Europe/Warsaw', hasPrivateTerminal: false },
  { id: 'BUD', iataCode: 'BUD', city: 'Budapest', country: 'Hungary', displayName: 'Budapest Ferenc Liszt International Airport (BUD)', timezone: 'Europe/Budapest', hasPrivateTerminal: false },
  { id: 'ATH', iataCode: 'ATH', city: 'Athens', country: 'Greece', displayName: 'Athens International Airport (ATH)', timezone: 'Europe/Athens', hasPrivateTerminal: true },
  { id: 'SKG', iataCode: 'SKG', city: 'Thessaloniki', country: 'Greece', displayName: 'Thessaloniki International Airport (SKG)', timezone: 'Europe/Athens', hasPrivateTerminal: false },
  { id: 'HER', iataCode: 'HER', city: 'Heraklion', country: 'Greece', displayName: 'Nikos Kazantzakis Airport (HER)', timezone: 'Europe/Athens', hasPrivateTerminal: false },
  { id: 'IST', iataCode: 'IST', city: 'Istanbul', country: 'Turkey', displayName: 'Istanbul Airport (IST)', timezone: 'Europe/Istanbul', hasPrivateTerminal: true },
  { id: 'SAW', iataCode: 'SAW', city: 'Istanbul', country: 'Turkey', displayName: 'Sabiha Gökçen International Airport (SAW)', timezone: 'Europe/Istanbul', hasPrivateTerminal: false },
  { id: 'AYT', iataCode: 'AYT', city: 'Antalya', country: 'Turkey', displayName: 'Antalya Airport (AYT)', timezone: 'Europe/Istanbul', hasPrivateTerminal: false },
  { id: 'ESB', iataCode: 'ESB', city: 'Ankara', country: 'Turkey', displayName: 'Ankara Esenboga Airport (ESB)', timezone: 'Europe/Istanbul', hasPrivateTerminal: false },
  { id: 'SVO', iataCode: 'SVO', city: 'Moscow', country: 'Russia', displayName: 'Sheremetyevo International Airport (SVO)', timezone: 'Europe/Moscow', hasPrivateTerminal: true },
  { id: 'DME', iataCode: 'DME', city: 'Moscow', country: 'Russia', displayName: 'Domodedovo International Airport (DME)', timezone: 'Europe/Moscow', hasPrivateTerminal: true },
  { id: 'VKO', iataCode: 'VKO', city: 'Moscow', country: 'Russia', displayName: 'Vnukovo International Airport (VKO)', timezone: 'Europe/Moscow', hasPrivateTerminal: false },
  { id: 'LED', iataCode: 'LED', city: 'Saint Petersburg', country: 'Russia', displayName: 'Pulkovo Airport (LED)', timezone: 'Europe/Moscow', hasPrivateTerminal: false },
  { id: 'OTP', iataCode: 'OTP', city: 'Bucharest', country: 'Romania', displayName: 'Henri Coandă International Airport (OTP)', timezone: 'Europe/Bucharest', hasPrivateTerminal: false },
  { id: 'SOF', iataCode: 'SOF', city: 'Sofia', country: 'Bulgaria', displayName: 'Sofia Airport (SOF)', timezone: 'Europe/Sofia', hasPrivateTerminal: false },
  { id: 'BEG', iataCode: 'BEG', city: 'Belgrade', country: 'Serbia', displayName: 'Nikola Tesla Airport (BEG)', timezone: 'Europe/Belgrade', hasPrivateTerminal: false },
  { id: 'ZAG', iataCode: 'ZAG', city: 'Zagreb', country: 'Croatia', displayName: 'Zagreb Franjo Tuđman Airport (ZAG)', timezone: 'Europe/Zagreb', hasPrivateTerminal: false },
  { id: 'DBV', iataCode: 'DBV', city: 'Dubrovnik', country: 'Croatia', displayName: 'Dubrovnik Airport (DBV)', timezone: 'Europe/Zagreb', hasPrivateTerminal: false },
  { id: 'SPU', iataCode: 'SPU', city: 'Split', country: 'Croatia', displayName: 'Split Airport (SPU)', timezone: 'Europe/Zagreb', hasPrivateTerminal: false },
  { id: 'LJU', iataCode: 'LJU', city: 'Ljubljana', country: 'Slovenia', displayName: 'Ljubljana Jože Pučnik Airport (LJU)', timezone: 'Europe/Ljubljana', hasPrivateTerminal: false },
  { id: 'HEL', iataCode: 'HEL', city: 'Helsinki', country: 'Finland', displayName: 'Helsinki Airport (HEL)', timezone: 'Europe/Helsinki', hasPrivateTerminal: false },
  { id: 'ARN', iataCode: 'ARN', city: 'Stockholm', country: 'Sweden', displayName: 'Stockholm Arlanda Airport (ARN)', timezone: 'Europe/Stockholm', hasPrivateTerminal: false },
  { id: 'OSL', iataCode: 'OSL', city: 'Oslo', country: 'Norway', displayName: 'Oslo Gardermoen Airport (OSL)', timezone: 'Europe/Oslo', hasPrivateTerminal: false },
  { id: 'CPH', iataCode: 'CPH', city: 'Copenhagen', country: 'Denmark', displayName: 'Copenhagen Airport (CPH)', timezone: 'Europe/Copenhagen', hasPrivateTerminal: false },
  { id: 'LIS', iataCode: 'LIS', city: 'Lisbon', country: 'Portugal', displayName: 'Humberto Delgado Airport (LIS)', timezone: 'Europe/Lisbon', hasPrivateTerminal: false },
  { id: 'OPO', iataCode: 'OPO', city: 'Porto', country: 'Portugal', displayName: 'Francisco de Sá Carneiro Airport (OPO)', timezone: 'Europe/Lisbon', hasPrivateTerminal: false },
  { id: 'FAO', iataCode: 'FAO', city: 'Faro', country: 'Portugal', displayName: 'Faro Airport (FAO)', timezone: 'Europe/Lisbon', hasPrivateTerminal: false },
  { id: 'DUB', iataCode: 'DUB', city: 'Dublin', country: 'Ireland', displayName: 'Dublin Airport (DUB)', timezone: 'Europe/Dublin', hasPrivateTerminal: false },
  { id: 'BTS', iataCode: 'BTS', city: 'Bratislava', country: 'Slovakia', displayName: 'Milan Rastislav Štefánik Airport (BTS)', timezone: 'Europe/Bratislava', hasPrivateTerminal: false },
  { id: 'RIX', iataCode: 'RIX', city: 'Riga', country: 'Latvia', displayName: 'Riga International Airport (RIX)', timezone: 'Europe/Riga', hasPrivateTerminal: false },
  { id: 'TLL', iataCode: 'TLL', city: 'Tallinn', country: 'Estonia', displayName: 'Lennart Meri Tallinn Airport (TLL)', timezone: 'Europe/Tallinn', hasPrivateTerminal: false },
  { id: 'VNO', iataCode: 'VNO', city: 'Vilnius', country: 'Lithuania', displayName: 'Vilnius Airport (VNO)', timezone: 'Europe/Vilnius', hasPrivateTerminal: false },
  { id: 'KIV', iataCode: 'KIV', city: 'Chisinau', country: 'Moldova', displayName: 'Chișinău International Airport (KIV)', timezone: 'Europe/Chisinau', hasPrivateTerminal: false },
  { id: 'TBS', iataCode: 'TBS', city: 'Tbilisi', country: 'Georgia', displayName: 'Tbilisi International Airport (TBS)', timezone: 'Asia/Tbilisi', hasPrivateTerminal: false },
  { id: 'EVN', iataCode: 'EVN', city: 'Yerevan', country: 'Armenia', displayName: 'Zvartnots International Airport (EVN)', timezone: 'Asia/Yerevan', hasPrivateTerminal: false },
  { id: 'GYD', iataCode: 'GYD', city: 'Baku', country: 'Azerbaijan', displayName: 'Heydar Aliyev International Airport (GYD)', timezone: 'Asia/Baku', hasPrivateTerminal: false },
  { id: 'SKP', iataCode: 'SKP', city: 'Skopje', country: 'North Macedonia', displayName: 'Skopje International Airport (SKP)', timezone: 'Europe/Skopje', hasPrivateTerminal: false },
  { id: 'TIA', iataCode: 'TIA', city: 'Tirana', country: 'Albania', displayName: 'Tirana International Airport (TIA)', timezone: 'Europe/Tirane', hasPrivateTerminal: false },
  { id: 'SKU', iataCode: 'SKU', city: 'Skyros', country: 'Greece', displayName: 'Skyros Airport (SKU)', timezone: 'Europe/Athens', hasPrivateTerminal: false },
  { id: 'GRZ', iataCode: 'GRZ', city: 'Graz', country: 'Austria', displayName: 'Graz Airport (GRZ)', timezone: 'Europe/Vienna', hasPrivateTerminal: false },
  { id: 'INN', iataCode: 'INN', city: 'Innsbruck', country: 'Austria', displayName: 'Innsbruck Airport (INN)', timezone: 'Europe/Vienna', hasPrivateTerminal: false },
  { id: 'SZG', iataCode: 'SZG', city: 'Salzburg', country: 'Austria', displayName: 'Salzburg Airport (SZG)', timezone: 'Europe/Vienna', hasPrivateTerminal: false },
  { id: 'MLX', iataCode: 'MLX', city: 'Malatya', country: 'Turkey', displayName: 'Malatya Erhaç Airport (MLX)', timezone: 'Europe/Istanbul', hasPrivateTerminal: false },
  { id: 'NUE', iataCode: 'NUE', city: 'Nuremberg', country: 'Germany', displayName: 'Nuremberg Airport (NUE)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },
  { id: 'TXL', iataCode: 'TXL', city: 'Berlin', country: 'Germany', displayName: 'Berlin Tegel Airport (TXL)', timezone: 'Europe/Berlin', hasPrivateTerminal: false },

  // ── North America ─────────────────────────────────────────
  { id: 'JFK', iataCode: 'JFK', city: 'New York', country: 'United States', displayName: 'John F Kennedy International Airport (JFK)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'LGA', iataCode: 'LGA', city: 'New York', country: 'United States', displayName: 'LaGuardia Airport (LGA)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'EWR', iataCode: 'EWR', city: 'Newark', country: 'United States', displayName: 'Newark Liberty International Airport (EWR)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'TEB', iataCode: 'TEB', city: 'Teterboro', country: 'United States', displayName: 'Teterboro Airport (TEB)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'LAX', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', displayName: 'Los Angeles International Airport (LAX)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'VNY', iataCode: 'VNY', city: 'Van Nuys', country: 'United States', displayName: 'Van Nuys Airport (VNY)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'BUR', iataCode: 'BUR', city: 'Burbank', country: 'United States', displayName: 'Hollywood Burbank Airport (BUR)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'SNA', iataCode: 'SNA', city: 'Orange County', country: 'United States', displayName: 'John Wayne Airport (SNA)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'ORD', iataCode: 'ORD', city: 'Chicago', country: 'United States', displayName: "O'Hare International Airport (ORD)", timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'MDW', iataCode: 'MDW', city: 'Chicago', country: 'United States', displayName: "Chicago Midway International Airport (MDW)", timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'PWK', iataCode: 'PWK', city: 'Chicago', country: 'United States', displayName: 'Chicago Executive Airport (PWK)', timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'DFW', iataCode: 'DFW', city: 'Dallas', country: 'United States', displayName: 'Dallas/Fort Worth International Airport (DFW)', timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'DAL', iataCode: 'DAL', city: 'Dallas', country: 'United States', displayName: 'Dallas Love Field Airport (DAL)', timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'ADS', iataCode: 'ADS', city: 'Dallas', country: 'United States', displayName: 'Addison Airport (ADS)', timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'MIA', iataCode: 'MIA', city: 'Miami', country: 'United States', displayName: 'Miami International Airport (MIA)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'FLL', iataCode: 'FLL', city: 'Fort Lauderdale', country: 'United States', displayName: 'Fort Lauderdale-Hollywood International (FLL)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'OPF', iataCode: 'OPF', city: 'Miami', country: 'United States', displayName: 'Miami-Opa Locka Executive Airport (OPF)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'ATL', iataCode: 'ATL', city: 'Atlanta', country: 'United States', displayName: 'Hartsfield-Jackson Atlanta International (ATL)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'PDK', iataCode: 'PDK', city: 'Atlanta', country: 'United States', displayName: 'DeKalb-Peachtree Airport (PDK)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'BOS', iataCode: 'BOS', city: 'Boston', country: 'United States', displayName: 'Boston Logan International Airport (BOS)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'BED', iataCode: 'BED', city: 'Bedford', country: 'United States', displayName: 'Hanscom Field (BED)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'SFO', iataCode: 'SFO', city: 'San Francisco', country: 'United States', displayName: 'San Francisco International Airport (SFO)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'SJC', iataCode: 'SJC', city: 'San Jose', country: 'United States', displayName: 'Norman Y. Mineta San Jose International (SJC)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'OAK', iataCode: 'OAK', city: 'Oakland', country: 'United States', displayName: 'Oakland Metropolitan International Airport (OAK)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'SEA', iataCode: 'SEA', city: 'Seattle', country: 'United States', displayName: 'Seattle-Tacoma International Airport (SEA)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'BFI', iataCode: 'BFI', city: 'Seattle', country: 'United States', displayName: 'Boeing Field King County International (BFI)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'DEN', iataCode: 'DEN', city: 'Denver', country: 'United States', displayName: 'Denver International Airport (DEN)', timezone: 'America/Denver', hasPrivateTerminal: false },
  { id: 'APA', iataCode: 'APA', city: 'Denver', country: 'United States', displayName: 'Centennial Airport (APA)', timezone: 'America/Denver', hasPrivateTerminal: true },
  { id: 'LAS', iataCode: 'LAS', city: 'Las Vegas', country: 'United States', displayName: 'Harry Reid International Airport (LAS)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'HND', iataCode: 'HND', city: 'Las Vegas', country: 'United States', displayName: 'Henderson Executive Airport (HND)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true },
  { id: 'PHX', iataCode: 'PHX', city: 'Phoenix', country: 'United States', displayName: 'Phoenix Sky Harbor International Airport (PHX)', timezone: 'America/Phoenix', hasPrivateTerminal: false },
  { id: 'SDL', iataCode: 'SDL', city: 'Scottsdale', country: 'United States', displayName: 'Scottsdale Airport (SDL)', timezone: 'America/Phoenix', hasPrivateTerminal: true },
  { id: 'IAD', iataCode: 'IAD', city: 'Washington DC', country: 'United States', displayName: 'Dulles International Airport (IAD)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'DCA', iataCode: 'DCA', city: 'Washington DC', country: 'United States', displayName: 'Ronald Reagan Washington National Airport (DCA)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'IAH', iataCode: 'IAH', city: 'Houston', country: 'United States', displayName: 'George Bush Intercontinental Airport (IAH)', timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'HOU', iataCode: 'HOU', city: 'Houston', country: 'United States', displayName: 'William P. Hobby Airport (HOU)', timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'SGR', iataCode: 'SGR', city: 'Houston', country: 'United States', displayName: 'Sugar Land Regional Airport (SGR)', timezone: 'America/Chicago', hasPrivateTerminal: true },
  { id: 'MCO', iataCode: 'MCO', city: 'Orlando', country: 'United States', displayName: 'Orlando International Airport (MCO)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'SAN', iataCode: 'SAN', city: 'San Diego', country: 'United States', displayName: 'San Diego International Airport (SAN)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'TPA', iataCode: 'TPA', city: 'Tampa', country: 'United States', displayName: 'Tampa International Airport (TPA)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'PBI', iataCode: 'PBI', city: 'Palm Beach', country: 'United States', displayName: 'Palm Beach International Airport (PBI)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'NAP', iataCode: 'APF', city: 'Naples', country: 'United States', displayName: 'Naples Municipal Airport (APF)', timezone: 'America/New_York', hasPrivateTerminal: true },
  { id: 'BNA', iataCode: 'BNA', city: 'Nashville', country: 'United States', displayName: 'Nashville International Airport (BNA)', timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'CLT', iataCode: 'CLT', city: 'Charlotte', country: 'United States', displayName: 'Charlotte Douglas International Airport (CLT)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'PHL', iataCode: 'PHL', city: 'Philadelphia', country: 'United States', displayName: 'Philadelphia International Airport (PHL)', timezone: 'America/New_York', hasPrivateTerminal: false },
  { id: 'DTW', iataCode: 'DTW', city: 'Detroit', country: 'United States', displayName: 'Detroit Metropolitan Airport (DTW)', timezone: 'America/Detroit', hasPrivateTerminal: false },
  { id: 'MSP', iataCode: 'MSP', city: 'Minneapolis', country: 'United States', displayName: 'Minneapolis-Saint Paul International Airport (MSP)', timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'SLC', iataCode: 'SLC', city: 'Salt Lake City', country: 'United States', displayName: 'Salt Lake City International Airport (SLC)', timezone: 'America/Denver', hasPrivateTerminal: false },
  { id: 'PDX', iataCode: 'PDX', city: 'Portland', country: 'United States', displayName: 'Portland International Airport (PDX)', timezone: 'America/Los_Angeles', hasPrivateTerminal: false },
  { id: 'ABQ', iataCode: 'ABQ', city: 'Albuquerque', country: 'United States', displayName: 'Albuquerque International Sunport (ABQ)', timezone: 'America/Denver', hasPrivateTerminal: false },
  { id: 'SPS', iataCode: 'SPS', city: 'Wichita Falls', country: 'United States', displayName: 'Sheppard Air Force Base (SPS)', timezone: 'America/Chicago', hasPrivateTerminal: false },
  { id: 'YYZ', iataCode: 'YYZ', city: 'Toronto', country: 'Canada', displayName: 'Toronto Pearson International Airport (YYZ)', timezone: 'America/Toronto', hasPrivateTerminal: true },
  { id: 'YTZ', iataCode: 'YTZ', city: 'Toronto', country: 'Canada', displayName: 'Billy Bishop Toronto City Airport (YTZ)', timezone: 'America/Toronto', hasPrivateTerminal: false },
  { id: 'YVR', iataCode: 'YVR', city: 'Vancouver', country: 'Canada', displayName: 'Vancouver International Airport (YVR)', timezone: 'America/Vancouver', hasPrivateTerminal: false },
  { id: 'YUL', iataCode: 'YUL', city: 'Montreal', country: 'Canada', displayName: 'Montréal–Trudeau International Airport (YUL)', timezone: 'America/Montreal', hasPrivateTerminal: false },
  { id: 'YYC', iataCode: 'YYC', city: 'Calgary', country: 'Canada', displayName: 'Calgary International Airport (YYC)', timezone: 'America/Edmonton', hasPrivateTerminal: false },
  { id: 'YEG', iataCode: 'YEG', city: 'Edmonton', country: 'Canada', displayName: 'Edmonton International Airport (YEG)', timezone: 'America/Edmonton', hasPrivateTerminal: false },
  { id: 'MEX', iataCode: 'MEX', city: 'Mexico City', country: 'Mexico', displayName: 'Mexico City International Airport (MEX)', timezone: 'America/Mexico_City', hasPrivateTerminal: false },
  { id: 'CUN', iataCode: 'CUN', city: 'Cancun', country: 'Mexico', displayName: 'Cancún International Airport (CUN)', timezone: 'America/Cancun', hasPrivateTerminal: false },
  { id: 'GDL', iataCode: 'GDL', city: 'Guadalajara', country: 'Mexico', displayName: 'Guadalajara International Airport (GDL)', timezone: 'America/Mexico_City', hasPrivateTerminal: false },
  { id: 'MTY', iataCode: 'MTY', city: 'Monterrey', country: 'Mexico', displayName: 'Monterrey International Airport (MTY)', timezone: 'America/Monterrey', hasPrivateTerminal: false },

  // ── South America ─────────────────────────────────────────
  { id: 'GRU', iataCode: 'GRU', city: 'São Paulo', country: 'Brazil', displayName: 'São Paulo/Guarulhos International Airport (GRU)', timezone: 'America/Sao_Paulo', hasPrivateTerminal: true },
  { id: 'CGH', iataCode: 'CGH', city: 'São Paulo', country: 'Brazil', displayName: 'Congonhas Airport (CGH)', timezone: 'America/Sao_Paulo', hasPrivateTerminal: false },
  { id: 'GIG', iataCode: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', displayName: 'Galeão International Airport (GIG)', timezone: 'America/Sao_Paulo', hasPrivateTerminal: false },
  { id: 'SDU', iataCode: 'SDU', city: 'Rio de Janeiro', country: 'Brazil', displayName: 'Santos Dumont Airport (SDU)', timezone: 'America/Sao_Paulo', hasPrivateTerminal: false },
  { id: 'EZE', iataCode: 'EZE', city: 'Buenos Aires', country: 'Argentina', displayName: 'Ministro Pistarini International Airport (EZE)', timezone: 'America/Argentina/Buenos_Aires', hasPrivateTerminal: false },
  { id: 'AEP', iataCode: 'AEP', city: 'Buenos Aires', country: 'Argentina', displayName: 'Jorge Newbery Airfield (AEP)', timezone: 'America/Argentina/Buenos_Aires', hasPrivateTerminal: false },
  { id: 'SCL', iataCode: 'SCL', city: 'Santiago', country: 'Chile', displayName: 'Arturo Merino Benítez International Airport (SCL)', timezone: 'America/Santiago', hasPrivateTerminal: false },
  { id: 'BOG', iataCode: 'BOG', city: 'Bogotá', country: 'Colombia', displayName: 'El Dorado International Airport (BOG)', timezone: 'America/Bogota', hasPrivateTerminal: false },
  { id: 'LIM', iataCode: 'LIM', city: 'Lima', country: 'Peru', displayName: 'Jorge Chávez International Airport (LIM)', timezone: 'America/Lima', hasPrivateTerminal: false },
  { id: 'UIO', iataCode: 'UIO', city: 'Quito', country: 'Ecuador', displayName: 'Mariscal Sucre International Airport (UIO)', timezone: 'America/Guayaquil', hasPrivateTerminal: false },
  { id: 'PTY', iataCode: 'PTY', city: 'Panama City', country: 'Panama', displayName: 'Tocumen International Airport (PTY)', timezone: 'America/Panama', hasPrivateTerminal: false },

  // ── Asia ─────────────────────────────────────────────────
  { id: 'SIN', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', displayName: 'Singapore Changi Airport (SIN)', timezone: 'Asia/Singapore', hasPrivateTerminal: true },
  { id: 'HKG', iataCode: 'HKG', city: 'Hong Kong', country: 'Hong Kong', displayName: 'Hong Kong International Airport (HKG)', timezone: 'Asia/Hong_Kong', hasPrivateTerminal: true },
  { id: 'PEK', iataCode: 'PEK', city: 'Beijing', country: 'China', displayName: 'Beijing Capital International Airport (PEK)', timezone: 'Asia/Shanghai', hasPrivateTerminal: true },
  { id: 'PKX', iataCode: 'PKX', city: 'Beijing', country: 'China', displayName: 'Beijing Daxing International Airport (PKX)', timezone: 'Asia/Shanghai', hasPrivateTerminal: false },
  { id: 'PVG', iataCode: 'PVG', city: 'Shanghai', country: 'China', displayName: 'Shanghai Pudong International Airport (PVG)', timezone: 'Asia/Shanghai', hasPrivateTerminal: true },
  { id: 'SHA', iataCode: 'SHA', city: 'Shanghai', country: 'China', displayName: 'Shanghai Hongqiao International Airport (SHA)', timezone: 'Asia/Shanghai', hasPrivateTerminal: false },
  { id: 'CAN', iataCode: 'CAN', city: 'Guangzhou', country: 'China', displayName: 'Guangzhou Baiyun International Airport (CAN)', timezone: 'Asia/Shanghai', hasPrivateTerminal: false },
  { id: 'SZX', iataCode: 'SZX', city: 'Shenzhen', country: 'China', displayName: 'Shenzhen Bao\'an International Airport (SZX)', timezone: 'Asia/Shanghai', hasPrivateTerminal: false },
  { id: 'CTU', iataCode: 'CTU', city: 'Chengdu', country: 'China', displayName: 'Chengdu Tianfu International Airport (CTU)', timezone: 'Asia/Shanghai', hasPrivateTerminal: false },
  { id: 'NRT', iataCode: 'NRT', city: 'Tokyo', country: 'Japan', displayName: 'Narita International Airport (NRT)', timezone: 'Asia/Tokyo', hasPrivateTerminal: false },
  { id: 'HND', iataCode: 'HND', city: 'Tokyo', country: 'Japan', displayName: 'Haneda Airport (HND)', timezone: 'Asia/Tokyo', hasPrivateTerminal: false },
  { id: 'KIX', iataCode: 'KIX', city: 'Osaka', country: 'Japan', displayName: 'Kansai International Airport (KIX)', timezone: 'Asia/Tokyo', hasPrivateTerminal: false },
  { id: 'ICN', iataCode: 'ICN', city: 'Seoul', country: 'South Korea', displayName: 'Incheon International Airport (ICN)', timezone: 'Asia/Seoul', hasPrivateTerminal: true },
  { id: 'GMP', iataCode: 'GMP', city: 'Seoul', country: 'South Korea', displayName: 'Gimpo International Airport (GMP)', timezone: 'Asia/Seoul', hasPrivateTerminal: false },
  { id: 'BKK', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', displayName: 'Suvarnabhumi Airport (BKK)', timezone: 'Asia/Bangkok', hasPrivateTerminal: true },
  { id: 'DMK', iataCode: 'DMK', city: 'Bangkok', country: 'Thailand', displayName: 'Don Mueang International Airport (DMK)', timezone: 'Asia/Bangkok', hasPrivateTerminal: false },
  { id: 'HKT', iataCode: 'HKT', city: 'Phuket', country: 'Thailand', displayName: 'Phuket International Airport (HKT)', timezone: 'Asia/Bangkok', hasPrivateTerminal: false },
  { id: 'CNX', iataCode: 'CNX', city: 'Chiang Mai', country: 'Thailand', displayName: 'Chiang Mai International Airport (CNX)', timezone: 'Asia/Bangkok', hasPrivateTerminal: false },
  { id: 'KUL', iataCode: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', displayName: 'Kuala Lumpur International Airport (KUL)', timezone: 'Asia/Kuala_Lumpur', hasPrivateTerminal: true },
  { id: 'SZB', iataCode: 'SZB', city: 'Kuala Lumpur', country: 'Malaysia', displayName: 'Sultan Abdul Aziz Shah Airport (SZB)', timezone: 'Asia/Kuala_Lumpur', hasPrivateTerminal: false },
  { id: 'CGK', iataCode: 'CGK', city: 'Jakarta', country: 'Indonesia', displayName: 'Soekarno-Hatta International Airport (CGK)', timezone: 'Asia/Jakarta', hasPrivateTerminal: false },
  { id: 'DPS', iataCode: 'DPS', city: 'Bali', country: 'Indonesia', displayName: 'Ngurah Rai International Airport (DPS)', timezone: 'Asia/Makassar', hasPrivateTerminal: false },
  { id: 'MNL', iataCode: 'MNL', city: 'Manila', country: 'Philippines', displayName: 'Ninoy Aquino International Airport (MNL)', timezone: 'Asia/Manila', hasPrivateTerminal: false },
  { id: 'CEB', iataCode: 'CEB', city: 'Cebu', country: 'Philippines', displayName: 'Mactan-Cebu International Airport (CEB)', timezone: 'Asia/Manila', hasPrivateTerminal: false },
  { id: 'SGN', iataCode: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', displayName: 'Tan Son Nhat International Airport (SGN)', timezone: 'Asia/Ho_Chi_Minh', hasPrivateTerminal: false },
  { id: 'HAN', iataCode: 'HAN', city: 'Hanoi', country: 'Vietnam', displayName: 'Noi Bai International Airport (HAN)', timezone: 'Asia/Ho_Chi_Minh', hasPrivateTerminal: false },
  { id: 'DAD', iataCode: 'DAD', city: 'Da Nang', country: 'Vietnam', displayName: 'Da Nang International Airport (DAD)', timezone: 'Asia/Ho_Chi_Minh', hasPrivateTerminal: false },
  { id: 'PNH', iataCode: 'PNH', city: 'Phnom Penh', country: 'Cambodia', displayName: 'Phnom Penh International Airport (PNH)', timezone: 'Asia/Phnom_Penh', hasPrivateTerminal: false },
  { id: 'REP', iataCode: 'REP', city: 'Siem Reap', country: 'Cambodia', displayName: 'Siem Reap International Airport (REP)', timezone: 'Asia/Phnom_Penh', hasPrivateTerminal: false },
  { id: 'RGN', iataCode: 'RGN', city: 'Yangon', country: 'Myanmar', displayName: 'Yangon International Airport (RGN)', timezone: 'Asia/Rangoon', hasPrivateTerminal: false },
  { id: 'DAC', iataCode: 'DAC', city: 'Dhaka', country: 'Bangladesh', displayName: 'Hazrat Shahjalal International Airport (DAC)', timezone: 'Asia/Dhaka', hasPrivateTerminal: false },
  { id: 'CMB', iataCode: 'CMB', city: 'Colombo', country: 'Sri Lanka', displayName: 'Bandaranaike International Airport (CMB)', timezone: 'Asia/Colombo', hasPrivateTerminal: false },
  { id: 'MLE', iataCode: 'MLE', city: 'Malé', country: 'Maldives', displayName: 'Velana International Airport (MLE)', timezone: 'Indian/Maldives', hasPrivateTerminal: false },
  { id: 'BOM', iataCode: 'BOM', city: 'Mumbai', country: 'India', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', timezone: 'Asia/Kolkata', hasPrivateTerminal: true },
  { id: 'DEL', iataCode: 'DEL', city: 'Delhi', country: 'India', displayName: 'Indira Gandhi International Airport (DEL)', timezone: 'Asia/Kolkata', hasPrivateTerminal: true },
  { id: 'BLR', iataCode: 'BLR', city: 'Bangalore', country: 'India', displayName: 'Kempegowda International Airport (BLR)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'MAA', iataCode: 'MAA', city: 'Chennai', country: 'India', displayName: 'Chennai International Airport (MAA)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'HYD', iataCode: 'HYD', city: 'Hyderabad', country: 'India', displayName: 'Rajiv Gandhi International Airport (HYD)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'CCU', iataCode: 'CCU', city: 'Kolkata', country: 'India', displayName: 'Netaji Subhas Chandra Bose International Airport (CCU)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'GOI', iataCode: 'GOI', city: 'Goa', country: 'India', displayName: 'Goa International Airport (GOI)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'AMD', iataCode: 'AMD', city: 'Ahmedabad', country: 'India', displayName: 'Sardar Vallabhbhai Patel International Airport (AMD)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'COK', iataCode: 'COK', city: 'Kochi', country: 'India', displayName: 'Cochin International Airport (COK)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'PNQ', iataCode: 'PNQ', city: 'Pune', country: 'India', displayName: 'Pune Airport (PNQ)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false },
  { id: 'ISB', iataCode: 'ISB', city: 'Islamabad', country: 'Pakistan', displayName: 'Islamabad International Airport (ISB)', timezone: 'Asia/Karachi', hasPrivateTerminal: false },
  { id: 'KHI', iataCode: 'KHI', city: 'Karachi', country: 'Pakistan', displayName: 'Jinnah International Airport (KHI)', timezone: 'Asia/Karachi', hasPrivateTerminal: false },
  { id: 'LHE', iataCode: 'LHE', city: 'Lahore', country: 'Pakistan', displayName: 'Allama Iqbal International Airport (LHE)', timezone: 'Asia/Karachi', hasPrivateTerminal: false },
  { id: 'KTM', iataCode: 'KTM', city: 'Kathmandu', country: 'Nepal', displayName: 'Tribhuvan International Airport (KTM)', timezone: 'Asia/Kathmandu', hasPrivateTerminal: false },
  { id: 'TAS', iataCode: 'TAS', city: 'Tashkent', country: 'Uzbekistan', displayName: 'Islam Karimov Tashkent International Airport (TAS)', timezone: 'Asia/Tashkent', hasPrivateTerminal: false },
  { id: 'ALA', iataCode: 'ALA', city: 'Almaty', country: 'Kazakhstan', displayName: 'Almaty International Airport (ALA)', timezone: 'Asia/Almaty', hasPrivateTerminal: false },
  { id: 'NQZ', iataCode: 'NQZ', city: 'Nur-Sultan', country: 'Kazakhstan', displayName: 'Nursultan Nazarbayev International Airport (NQZ)', timezone: 'Asia/Almaty', hasPrivateTerminal: false },

  // ── Africa ────────────────────────────────────────────────
  { id: 'JNB', iataCode: 'JNB', city: 'Johannesburg', country: 'South Africa', displayName: 'O.R. Tambo International Airport (JNB)', timezone: 'Africa/Johannesburg', hasPrivateTerminal: true },
  { id: 'CPT', iataCode: 'CPT', city: 'Cape Town', country: 'South Africa', displayName: 'Cape Town International Airport (CPT)', timezone: 'Africa/Johannesburg', hasPrivateTerminal: false },
  { id: 'DUR', iataCode: 'DUR', city: 'Durban', country: 'South Africa', displayName: 'King Shaka International Airport (DUR)', timezone: 'Africa/Johannesburg', hasPrivateTerminal: false },
  { id: 'NBO', iataCode: 'NBO', city: 'Nairobi', country: 'Kenya', displayName: 'Jomo Kenyatta International Airport (NBO)', timezone: 'Africa/Nairobi', hasPrivateTerminal: false },
  { id: 'WIL', iataCode: 'WIL', city: 'Nairobi', country: 'Kenya', displayName: 'Wilson Airport (WIL)', timezone: 'Africa/Nairobi', hasPrivateTerminal: false },
  { id: 'DAR', iataCode: 'DAR', city: 'Dar es Salaam', country: 'Tanzania', displayName: 'Julius Nyerere International Airport (DAR)', timezone: 'Africa/Dar_es_Salaam', hasPrivateTerminal: false },
  { id: 'ZNZ', iataCode: 'ZNZ', city: 'Zanzibar', country: 'Tanzania', displayName: 'Abeid Amani Karume International Airport (ZNZ)', timezone: 'Africa/Dar_es_Salaam', hasPrivateTerminal: false },
  { id: 'EBB', iataCode: 'EBB', city: 'Entebbe', country: 'Uganda', displayName: 'Entebbe International Airport (EBB)', timezone: 'Africa/Kampala', hasPrivateTerminal: false },
  { id: 'ADD', iataCode: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', displayName: 'Bole International Airport (ADD)', timezone: 'Africa/Addis_Ababa', hasPrivateTerminal: false },
  { id: 'ACC', iataCode: 'ACC', city: 'Accra', country: 'Ghana', displayName: 'Kotoka International Airport (ACC)', timezone: 'Africa/Accra', hasPrivateTerminal: false },
  { id: 'LOS', iataCode: 'LOS', city: 'Lagos', country: 'Nigeria', displayName: 'Murtala Muhammed International Airport (LOS)', timezone: 'Africa/Lagos', hasPrivateTerminal: false },
  { id: 'ABV', iataCode: 'ABV', city: 'Abuja', country: 'Nigeria', displayName: 'Nnamdi Azikiwe International Airport (ABV)', timezone: 'Africa/Lagos', hasPrivateTerminal: false },
  { id: 'CMN', iataCode: 'CMN', city: 'Casablanca', country: 'Morocco', displayName: 'Mohammed V International Airport (CMN)', timezone: 'Africa/Casablanca', hasPrivateTerminal: false },
  { id: 'RAK', iataCode: 'RAK', city: 'Marrakesh', country: 'Morocco', displayName: 'Marrakesh Menara Airport (RAK)', timezone: 'Africa/Casablanca', hasPrivateTerminal: false },
  { id: 'ALG', iataCode: 'ALG', city: 'Algiers', country: 'Algeria', displayName: 'Houari Boumediene Airport (ALG)', timezone: 'Africa/Algiers', hasPrivateTerminal: false },
  { id: 'TUN', iataCode: 'TUN', city: 'Tunis', country: 'Tunisia', displayName: 'Tunis-Carthage International Airport (TUN)', timezone: 'Africa/Tunis', hasPrivateTerminal: false },

  // ── Oceania ───────────────────────────────────────────────
  { id: 'SYD', iataCode: 'SYD', city: 'Sydney', country: 'Australia', displayName: 'Sydney Kingsford Smith Airport (SYD)', timezone: 'Australia/Sydney', hasPrivateTerminal: true },
  { id: 'MEL', iataCode: 'MEL', city: 'Melbourne', country: 'Australia', displayName: 'Melbourne Airport (MEL)', timezone: 'Australia/Melbourne', hasPrivateTerminal: false },
  { id: 'BNE', iataCode: 'BNE', city: 'Brisbane', country: 'Australia', displayName: 'Brisbane Airport (BNE)', timezone: 'Australia/Brisbane', hasPrivateTerminal: false },
  { id: 'PER', iataCode: 'PER', city: 'Perth', country: 'Australia', displayName: 'Perth Airport (PER)', timezone: 'Australia/Perth', hasPrivateTerminal: false },
  { id: 'ADL', iataCode: 'ADL', city: 'Adelaide', country: 'Australia', displayName: 'Adelaide Airport (ADL)', timezone: 'Australia/Adelaide', hasPrivateTerminal: false },
  { id: 'AKL', iataCode: 'AKL', city: 'Auckland', country: 'New Zealand', displayName: 'Auckland Airport (AKL)', timezone: 'Pacific/Auckland', hasPrivateTerminal: false },
  { id: 'WLG', iataCode: 'WLG', city: 'Wellington', country: 'New Zealand', displayName: 'Wellington International Airport (WLG)', timezone: 'Pacific/Auckland', hasPrivateTerminal: false },
  { id: 'NAN', iataCode: 'NAN', city: 'Nadi', country: 'Fiji', displayName: 'Nadi International Airport (NAN)', timezone: 'Pacific/Fiji', hasPrivateTerminal: false },
];

// ============================================================
// API Token Verification
// ============================================================
const verifyApiToken = async () => {
  try {
    const endpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
      `${AVIA_PAGE_BASE_URL}/api/v1/profile/me`,
      `${AVIA_PAGE_BASE_URL}/api/v1/health`,
    ];
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
        });
        if (response.ok) return true;
      } catch (error) { continue; }
    }
    return false;
  } catch (error) { return false; }
};

// ============================================================
// Service fee calculation
// ============================================================
const addServiceFeeToFlight = (flight) => {
  const basePrice = flight.price?.total || 0;
  const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
  const totalWithFee = basePrice + serviceFee;
  return {
    ...flight,
    price: { ...flight.price, total: totalWithFee, base: Math.round(basePrice), serviceFee },
    pricing: { baseFare: basePrice, serviceFee, total: totalWithFee, currency: flight.price?.currency || 'USD' }
  };
};

// ============================================================
// Normalize DB flight row
// ============================================================
const normalizeDbFlightToAppFormat = (row, index) => {
  if (row.itineraries && row.price && typeof row.price.total !== 'undefined') return row;
  const id = row.id || `db-flight-${index}`;
  const origin = row.origin || row.departure_airport || row.from || row.origin_iata || 'XXX';
  const destination = row.destination || row.arrival_airport || row.to || row.destination_iata || 'XXX';
  const departureDate = row.departure_date || row.departureDate || new Date().toISOString().split('T')[0];
  const departureTime = row.departure_time || row.departureTime || '08:00';
  const total = Number(row.price || row.total || row.price_total || 0) || 5000;
  const currency = row.currency || 'USD';
  const duration = row.duration || 'PT2H30M';
  const [hours, minutes] = departureTime.split(':').map(Number);
  const depDt = new Date(departureDate);
  depDt.setHours(hours || 8, minutes || 0, 0, 0);
  const depAt = depDt.toISOString();
  const arrDt = new Date(depDt.getTime() + 2.5 * 60 * 60 * 1000);
  const arrAt = arrDt.toISOString();
  return {
    id, type: 'charter-flight', source: 'DATABASE', timestamp: new Date().toISOString(),
    price: { currency, total, base: Math.round(total * 0.88) },
    itineraries: [{ duration, segments: [{ departure: { iataCode: origin, at: depAt, terminal: 'Private Terminal', scheduledTime: departureTime }, arrival: { iataCode: destination, at: arrAt, terminal: 'Private Terminal' }, carrierCode: 'PJ', number: `PJ${1000 + index}`, aircraft: { code: row.aircraft_type || 'PJ', name: row.aircraft_name || row.aircraft_type || row.model || 'Private Charter' }, duration, id: `segment-${index}`, numberOfStops: 0, operatingCarrier: row.operator || row.airline || 'Private Charter' }] }],
    aircraftInfo: { id: row.aircraft_id || row.id, name: row.aircraft_name || row.model || 'Private Jet', manufacturer: row.manufacturer || '', model: row.model || row.aircraft_name || 'Private Jet', year: row.year || 2020, seats: row.seats || row.pax || 8, images: row.images || row.photos || [], features: row.features || ['Luxury Seating', 'Refreshments'], airline: row.operator || row.airline || 'Private Charter' }
  };
};

// ============================================================
// Fetch flights from backend database
// ============================================================
const fetchFlightsFromDatabase = async (origin, destination, departureDate, departureTime, returnDate, returnTime, passengers) => {
  try {
    const params = { origin: origin || '', destination: destination || '', departure_date: departureDate || '', departure_time: departureTime || '08:00', return_date: returnDate || '', return_time: returnTime || '', passengers: parseInt(passengers, 10) || 1 };
    const url = `${base_url}${constant.getFlights}`;
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(params) });
    if (!response.ok) return null;
    const json = await response.json();
    const list = json?.data ?? json?.flights ?? json?.result ?? (Array.isArray(json) ? json : []);
    if (!Array.isArray(list) || list.length === 0) return null;
    return { data: list.map((row, i) => addServiceFeeToFlight(normalizeDbFlightToAppFormat(row, i))) };
  } catch (e) { return null; }
};

// ============================================================
// Real API – Aviapages
// ============================================================
const fetchRealAviapagesFlights = async (origin, destination, departureDate, departureTime, returnDate, returnTime, passengers, flexibleTiming = false) => {
  try {
    const testResponse = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/health`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` } });
    if (!testResponse.ok) throw new Error('API connection failed');
    const requestBody = { departure_airport: origin, arrival_airport: destination, departure_date: departureDate, departure_time: departureTime, passengers: parseInt(passengers) || 1, ...(returnDate && { return_date: returnDate, return_time: returnTime, trip_type: 'round_trip' }), ...(flexibleTiming && { flexible_scheduling: true }) };
    const endpoints = [`${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`, `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`, `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`];
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(requestBody) });
        if (response.ok) {
          const apiData = await response.json();
          const list = apiData.data || apiData.flights;
          if (list && list.length > 0) return { data: list.map(f => addServiceFeeToFlight(f)) };
        }
      } catch (e) { continue; }
    }
    return null;
  } catch (error) { return null; }
};

// ============================================================
// Fetch ALL charter aircraft from REAL API
// ============================================================
const fetchAllCharterAircraft = async (origin, destination, departureDate, departureTime, passengers) => {
  try {
    const charterAircraftResponse = await getCharterAircraft({ page_size: 100, ordering: '-year_of_production' });
    const allAircraft = charterAircraftResponse?.results || charterAircraftResponse || [];
    if (allAircraft.length === 0) return null;
    let flightDuration = { hours: 2, minutes: 30 };
    try {
      const ft = await calculateFlightTime(origin, destination);
      if (ft?.flight_time) { flightDuration = { hours: Math.floor(ft.flight_time / 60), minutes: ft.flight_time % 60 }; }
    } catch (e) { }
    const flights = allAircraft.map((aircraft, index) => {
      const hourlyRate = aircraft.hourly_rate || aircraft.price_per_hour || 5000;
      const estimatedFlightHours = flightDuration.hours + (flightDuration.minutes / 60);
      let basePrice = Math.round(Math.round(hourlyRate * estimatedFlightHours * (1 + (passengers / 15))) / 100) * 100;
      const departureDateTime = new Date(departureDate);
      const [hours, minutes] = departureTime.split(':').map(Number);
      departureDateTime.setHours(hours, minutes, 0, 0);
      const arrivalDateTime = new Date(departureDateTime);
      arrivalDateTime.setHours(arrivalDateTime.getHours() + flightDuration.hours);
      arrivalDateTime.setMinutes(arrivalDateTime.getMinutes() + flightDuration.minutes);
      const images = aircraft.images?.map(p => p.media?.path) || getDefaultAircraftImages(aircraft.aircraft_type?.aircraft_class?.name || 'Light');
      return {
        id: `charter-${aircraft.id || index}`, type: 'charter-flight', source: 'AVIAPAGES_REAL_API', timestamp: new Date().toISOString(),
        price: { currency: aircraft.selling_currency || 'USD', total: basePrice, base: Math.round(basePrice * 0.88) },
        itineraries: [{ duration: `PT${flightDuration.hours}H${flightDuration.minutes}M`, segments: [{ departure: { iataCode: origin, at: departureDateTime.toISOString(), terminal: 'Private Terminal', scheduledTime: departureTime }, arrival: { iataCode: destination, at: arrivalDateTime.toISOString(), terminal: 'Private Terminal' }, carrierCode: aircraft.company?.name?.substring(0, 2).toUpperCase() || 'PJ', number: `PJ${1000 + index}`, aircraft: { code: aircraft.aircraft_type?.icao || 'PJ', name: `${aircraft.aircraft_type?.name || 'Charter Aircraft'}` }, duration: `PT${flightDuration.hours}H${flightDuration.minutes}M`, id: `segment-${index}`, numberOfStops: 0, operatingCarrier: aircraft.company?.name || 'Private Charter' }] }],
        aircraftInfo: { id: aircraft.id, name: aircraft.aircraft_type?.name || 'Private Jet', manufacturer: aircraft.aircraft_type?.name?.split(' ')[0] || '', model: aircraft.aircraft_type?.name || '', year: aircraft.year_of_production || 2020, seats: aircraft.passengers_max || 8, speed: '850 km/h', range: '5000 km', images, features: getAircraftFeatures(aircraft), airline: aircraft.company?.name || 'Private Charter', airlineLogo: '', hourlyRate, category: aircraft.aircraft_type?.aircraft_class?.name || 'Private Jet', registration: aircraft.registration_number || '', homeBase: aircraft.base_airport?.name || '', availability: 'Available', instantConfirmation: true, realAircraftId: aircraft.id, companyId: aircraft.company?.id },
        timeDetails: { requestedTime: departureTime, actualTime: departureTime, adjustment: 0, isExactMatch: true, flexibleOption: true }
      };
    });
    const flightsWithFees = flights.map(f => addServiceFeeToFlight(f));
    flightsWithFees.sort((a, b) => a.pricing.total - b.pricing.total);
    console.log("Total real aircraft found & parsed:", flightsWithFees.length);
    return { data: flightsWithFees };
  } catch (error) { console.error("Error formatting flights:", error); return null; }
};

const getAircraftFeatures = (aircraft) => {
  const features = [];
  if (aircraft.wifi || aircraft.has_wifi) features.push('WiFi');
  if (aircraft.entertainment) features.push('Entertainment System');
  if (aircraft.galley || aircraft.has_galley) features.push('Full Galley');
  if (aircraft.lavatory || aircraft.has_lavatory) features.push('Lavatory');
  if (aircraft.flight_attendant) features.push('Flight Attendant');
  if (aircraft.pets_allowed) features.push('Pets Allowed');
  if (aircraft.smoking_allowed) features.push('Smoking Allowed');
  if (aircraft.cargo_capacity) features.push(`Cargo: ${aircraft.cargo_capacity}`);
  return features.length === 0 ? ['Luxury Seating', 'Climate Control', 'Refreshments', 'Luggage Space'] : features;
};

const getDefaultAircraftImages = (category) => {
  const defaultImages = {
    'Heavy Jet': ["https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg", "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg"],
    'Medium Jet': ["https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp", "https://md.aviapages.com/media/2022/02/01/image-006.jpg"],
    'Light Jet': ["https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg", "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg"],
    'default': ["https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg", "https://md.aviapages.com/media/2022/02/01/image-005.jpg.webp"]
  };
  return defaultImages[category] || defaultImages['default'];
};

// ============================================================
// Mock Flights (fallback)
// ============================================================


const getRouteFactor = (origin, destination) => {
  const factors = { 'DXB-AUH': 1.0, 'DXB-DOH': 1.2, 'DXB-RUH': 1.1, 'JFK-LAX': 3.0, 'LHR-CDG': 1.5, 'LHR-DXB': 4.0, 'JFK-LHR': 4.5, 'AUH-DXB': 1.0, 'DOH-DXB': 1.2, 'RUH-DXB': 1.1, 'LAX-JFK': 3.0, 'CDG-LHR': 1.5, 'default': 2.0 };
  return factors[`${origin}-${destination}`] || factors.default;
};

const getRouteDuration = (origin, destination) => {
  const durations = { 'DXB-AUH': { hours: 1, minutes: 0 }, 'DXB-DOH': { hours: 1, minutes: 15 }, 'DXB-RUH': { hours: 1, minutes: 30 }, 'JFK-LAX': { hours: 6, minutes: 0 }, 'LHR-CDG': { hours: 1, minutes: 15 }, 'LHR-DXB': { hours: 6, minutes: 30 }, 'JFK-LHR': { hours: 7, minutes: 0 }, 'AUH-DXB': { hours: 1, minutes: 0 }, 'DOH-DXB': { hours: 1, minutes: 15 }, 'RUH-DXB': { hours: 1, minutes: 30 }, 'LAX-JFK': { hours: 6, minutes: 0 }, 'CDG-LHR': { hours: 1, minutes: 15 }, 'default': { hours: 2, minutes: 0 } };
  return durations[`${origin}-${destination}`] || durations.default;
};

// ============================================================
// Mock Charter Details
// ============================================================
const generateMockCharterDetails = (charterId, preferredTime = null) => {
  let aircraftType = 'G650';
  if (charterId.includes('Challenger') || charterId.includes('challenger')) aircraftType = 'Challenger 350';
  if (charterId.includes('Falcon') || charterId.includes('falcon')) aircraftType = 'Falcon 8X';
  if (charterId.includes('Praetor') || charterId.includes('praetor')) aircraftType = 'Praetor 600';
  const aircraftData = {
    'G650': { id: charterId, name: 'Gulfstream G650', manufacturer: 'Gulfstream Aerospace', model: 'G650', year: 2022, seats: 14, speed: '956 km/h', range: '12,000 km', category: 'Heavy Jet', hourlyRate: 8500, images: ["https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg", "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg", "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg", "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"], features: ['WiFi & Satellite Communications', '4K Entertainment System', 'Luxury Leather Seating', 'Conference/Dining Table', 'Private Suite with Door', 'Full Stand-up Cabin', 'Shower Facilities', 'Full Galley Kitchen', 'Crew Rest Area', 'Noise-Cancelling Cabin'], description: 'The Gulfstream G650 is the ultimate in private aviation, offering unmatched comfort, range, and performance.' },
    'Challenger 350': { id: charterId, name: 'Bombardier Challenger 350', manufacturer: 'Bombardier', model: 'Challenger 350', year: 2021, seats: 10, speed: '870 km/h', range: '5,900 km', category: 'Medium Jet', hourlyRate: 6500, images: ["https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg", "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg", "https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg", "https://md.aviapages.com/media/2017/01/01/04/HAW_2_EWDif3.jpg"], features: ['High-Speed WiFi', 'Entertainment System', 'Ergonomic Leather Seats', 'Conference Table', 'Refreshment Bar', 'Work Stations', 'Ample Storage', 'Bright Cabin Windows'], description: 'The Challenger 350 offers the perfect balance of performance and comfort for mid-range flights.' },
    'Falcon 8X': { id: charterId, name: 'Dassault Falcon 8X', manufacturer: 'Dassault Aviation', model: 'Falcon 8X', year: 2020, seats: 12, speed: '900 km/h', range: '11,900 km', category: 'Heavy Jet', hourlyRate: 7800, images: ["https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg", "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg", "https://md.aviapages.com/media/2025/08/29/67c5862f53279ee039530988_Union-Aviation-YL-ECT-interior-2.jpg", "https://md.aviapages.com/media/2025/08/29/67c5862e5d33648df078d51e_Union-Aviation-YL-ECT-interior-1.jpg", "https://md.aviapages.com/media/2025/08/29/67c586334be9b297e0477bbb_Union-Aviation-YL-ECT-interior-13.jpg"], features: ['Advanced WiFi System', 'HD Entertainment', 'Luxury Seating with Massage', 'Convertible Conference/Dining', 'Private Sleeping Suite', 'Full Refreshment Service', 'Stand-up Cabin', 'Quiet Cabin Technology'], description: 'The Falcon 8X offers exceptional range and a quiet, comfortable cabin.' },
    'Praetor 600': { id: charterId, name: 'Embraer Praetor 600', manufacturer: 'Embraer', model: 'Praetor 600', year: 2023, seats: 8, speed: '850 km/h', range: '7,400 km', category: 'Light Jet', hourlyRate: 5500, images: ["https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp", "https://md.aviapages.com/media/2022/02/01/image-006.jpg", "https://md.aviapages.com/media/2022/02/01/image-004.jpg", "https://md.aviapages.com/media/2022/02/01/image-003.jpg", "https://md.aviapages.com/media/2022/02/01/image-002.jpg"], features: ['WiFi Connectivity', 'Entertainment System', 'Comfortable Club Seating', 'Work Table', 'Refreshment Service', 'Large Windows', 'Efficient Performance'], description: 'The Praetor 600 offers excellent performance and comfort for shorter to mid-range flights.' }
  };
  const aircraft = aircraftData[aircraftType] || aircraftData['G650'];
  const basePrice = aircraft.hourlyRate * 2;
  const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
  const totalPrice = basePrice + serviceFee;
  const baseTime = preferredTime || '10:00';
  const [baseHour, baseMinute] = baseTime.split(':').map(Number);
  const availableSlots = [];
  for (let hour = 5; hour <= 23; hour++) {
    if (Math.abs(hour - baseHour) <= 2) {
      availableSlots.push({ time: `${hour.toString().padStart(2, '0')}:${baseMinute.toString().padStart(2, '0')}`, status: 'available', isPreferred: `${hour.toString().padStart(2, '0')}:${baseMinute.toString().padStart(2, '0')}` === preferredTime, priceMultiplier: `${hour.toString().padStart(2, '0')}:${baseMinute.toString().padStart(2, '0')}` === preferredTime ? 1.1 : 1.0 });
    }
  }
  return { ...aircraft, pricing: { baseFare: basePrice, serviceFee, total: totalPrice, currency: 'USD', hourlyRate: aircraft.hourlyRate, minimumHours: 2 }, price: { currency: 'USD', total: totalPrice, base: basePrice, serviceFee }, specifications: { maxPassengers: aircraft.seats, cruiseSpeed: aircraft.speed, maxRange: aircraft.range, cabinHeight: aircraft.category === 'Heavy Jet' ? '1.9m' : '1.8m', cabinWidth: aircraft.category === 'Heavy Jet' ? '2.2m' : '2.1m', cabinLength: aircraft.category === 'Heavy Jet' ? '15.3m' : '8.5m', baggageCapacity: aircraft.category === 'Heavy Jet' ? '5.7 m³' : '3.2 m³', lavatory: aircraft.category === 'Heavy Jet' ? 'Full with shower' : 'Standard', crew: aircraft.category === 'Heavy Jet' ? '2 pilots + 1 attendant' : '2 pilots' }, amenities: aircraft.features, available: true, instantConfirmation: true, flexibleTiming: true, availableSlots, bookingNotes: ['Flexible departure times available', '24/7 customer support', 'Catering options available', 'Ground transportation can be arranged', 'WiFi and entertainment included', 'Professional crew included'], safety: { rating: '5/5', lastMaintenance: '2024-01-15', crewExperience: '10,000+ hours average', insurance: 'Full comprehensive coverage' } };
};

// ============================================================
// Time Slots
// ============================================================
const generateTimeSlots = (preferredTime = null, date = null) => {
  const slots = [];
  const baseTime = preferredTime || '10:00';
  const [baseHour] = baseTime.split(':').map(Number);
  for (let hour = 5; hour <= 23; hour++) {
    if (!preferredTime || Math.abs(hour - baseHour) <= 3) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, display: formatTimeForDisplay(time), available: true, isPeak: (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19), isPreferred: time === preferredTime });
      }
    }
  }
  return slots;
};

const formatTimeForDisplay = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// ============================================================
// ✈️  AIRPORT SEARCH  — Real API first, comprehensive fallback
// ============================================================
const searchAirportsFallback = async (query) => {
  if (!query || query.length < 2) return { data: [] };

  const q = query.toLowerCase().trim();

  // 1️⃣  Try Aviapages airport search API first
  try {
    const response = await fetch(
      `${AVIA_PAGE_BASE_URL}/api/v1/airports/?search=${encodeURIComponent(query)}&page_size=20`,
      { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    if (response.ok) {
      const json = await response.json();
      const results = json?.results || json?.data || (Array.isArray(json) ? json : []);
      if (results.length > 0) {
        const normalized = results.map(a => ({
          id: a.iata_code || a.icao_code || a.id || String(a.pk),
          iataCode: a.iata_code || a.code || '',
          icaoCode: a.icao_code || '',
          city: a.city?.name || a.city || a.municipality || '',
          country: a.country?.name || a.country || '',
          displayName: a.name ? `${a.name} (${a.iata_code || a.icao_code || ''})` : (a.iata_code || a.icao_code || ''),
          timezone: a.timezone || '',
          hasPrivateTerminal: a.has_private_terminal || false,
        })).filter(a => a.iataCode || a.icaoCode);
        if (normalized.length > 0) return { data: normalized };
      }
    }
  } catch (e) {
    // API failed – fall through to local database
  }

  // 2️⃣  Local comprehensive database fallback
  const filtered = AIRPORT_DATABASE.filter(airport =>
    airport.city.toLowerCase().includes(q) ||
    airport.iataCode.toLowerCase().includes(q) ||
    airport.displayName.toLowerCase().includes(q) ||
    airport.country.toLowerCase().includes(q)
  );

  // Sort: exact IATA match first, then city starts-with, then rest
  filtered.sort((a, b) => {
    const aExact = a.iataCode.toLowerCase() === q ? 0 : 1;
    const bExact = b.iataCode.toLowerCase() === q ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    const aStarts = a.city.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.city.toLowerCase().startsWith(q) ? 0 : 1;
    return aStarts - bStarts;
  });

  return { data: filtered.slice(0, 15) }; // Return top 15 matches
};

// ============================================================
// Main Service Export
// ============================================================
export const AviapagesFlightService = {
  searchFlights: async (origin, destination, departureDate, departureTime = '08:00', returnDate = null, returnTime = '18:00', passengers = 1, flexibleTiming = false) => {
    try {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(departureTime)) departureTime = '08:00';
      if (returnDate && !timeRegex.test(returnTime)) returnTime = '18:00';
      const passengerCount = Math.max(1, parseInt(passengers) || 1);

      const applyRoundTrip = (flights) => returnDate
        ? flights.map(f => ({ ...f, tripType: 'round_trip', returnDate, returnTime, pricing: { ...f.pricing, baseFare: (f.pricing?.baseFare || 0) * 2, serviceFee: (f.pricing?.serviceFee || 0) * 2, total: (f.pricing?.total || 0) * 2, currency: f.pricing?.currency || 'USD' }, price: { ...f.price, total: (f.price?.total || 0) * 2, base: (f.price?.base || 0) * 2 }, roundTrip: true }))
        : flights;

      const buildResult = (data) => ({ data: applyRoundTrip(data), searchParams: { origin, destination, departureDate, departureTime, returnDate, returnTime, passengers: passengerCount, flexibleTiming }, metadata: { source: 'AVIAPAGES_REAL_API', timestamp: new Date().toISOString(), totalResults: data.length, message: `Found ${data.length} charter aircraft available for your route` } });

      // Priority 1: Backend DB
      const dbFlights = await fetchFlightsFromDatabase(origin, destination, departureDate, departureTime, returnDate, returnTime, passengerCount);
      if (dbFlights?.data?.length > 0) return buildResult(dbFlights.data);

      // Priority 2: Real API – all charter aircraft
      const allCharterFlights = await fetchAllCharterAircraft(origin, destination, departureDate, departureTime, passengerCount);
      if (allCharterFlights?.data?.length > 0) return buildResult(allCharterFlights.data);

      // Priority 3: Real API – direct search
      const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, departureTime, returnDate, returnTime, passengerCount, flexibleTiming);
      if (realFlights?.data?.length > 0) return { ...buildResult(realFlights.data), searchParams: { origin, destination, departureDate, departureTime, returnDate, returnTime, passengers: passengerCount, flexibleTiming } };

      // Priority 4: No mock fallback
      return buildResult([]);

    } catch (error) {
      throw error;
    }
  },

  getCharterDetails: async (charterId, preferredTime = null) => {
    try {
      const realDetails = await fetchRealAviapagesFlights('', '', '', preferredTime, null, null, 1, false);
      if (realDetails?.data?.length > 0) return { ...realDetails.data[0], availableSlots: generateTimeSlots(preferredTime), _source: 'REAL_API', _timestamp: new Date().toISOString() };
      throw new Error('Charter details not found from real API');
    } catch (error) {
      throw error;
    }
  },

  // ✅ Main airport search used by AirportSearchModal
  searchAirports: async (query) => {
    return await searchAirportsFallback(query);
  },

  testApiConnection: async () => verifyApiToken(),

  getAvailableTimeSlots: async (charterId, date, preferredTime = null) => {
    try {
      return { success: true, data: generateTimeSlots(preferredTime, date), charterId, date, preferredTime, note: 'Private jets offer flexible scheduling.' };
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  },

  validateTimePreference: (time, flexible = false) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) return { valid: false, message: 'Invalid time format. Please use HH:MM format (24-hour).', suggested: '08:00' };
    const [hours] = time.split(':').map(Number);
    if (hours < 5 || hours > 23) return { valid: false, message: 'Private jet operations are typically from 5:00 AM to 11:00 PM.', suggested: hours < 5 ? '05:00' : '22:00' };
    return { valid: true, message: flexible ? 'Time preference noted. We will show options within ±2 hours.' : 'Fixed time preference set.', operational: true };
  },

  calculateFlexiblePricing: (basePrice, isExactTime = false, timeAdjustment = 0) => {
    let multiplier = isExactTime ? 1.1 : Math.abs(timeAdjustment) === 2 ? 0.9 : 1.0;
    return Math.round(basePrice * multiplier);
  }
};

export default AviapagesFlightService;