import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FF3B30",
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom:40,

  },
  greetingText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  headerText: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    alignSelf:'flex-start'
  },
  iconButton: {
    padding: 4,
  },
  notificationIcon: {
    height: 24,
    width: 24,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginVertical: 10,
  },
    flightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  aircraftInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  aircraftName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  seatsInfo: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  priceBreakdown: {
    flexDirection: 'row',
    marginTop: 8,
  },
  basePrice: {
    fontSize: 12,
    color: '#475569',
    marginRight: 8,
  },
  serviceFee: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  selectButton: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
// Time Picker Styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},
timePickerModal: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: '80%',
},
timePickerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
timePickerTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#333',
},
closeButton: {
  fontSize: 24,
  color: '#666',
  padding: 5,
},
selectedTimeDisplay: {
  textAlign: 'center',
  fontSize: 16,
  color: '#666',
  marginBottom: 20,
},
selectedTimeText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#FF3B30',
},
timeSlotsContainer: {
  paddingBottom: 20,
},
timeSlot: {
  flex: 1,
  paddingVertical: 12,
  paddingHorizontal: 8,
  margin: 4,
  borderRadius: 10,
  backgroundColor: '#f5f5f5',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#e0e0e0',
},
selectedTimeSlot: {
  backgroundColor: '#FF3B30',
  borderColor: '#FF3B30',
},
timeSlotText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#333',
},
selectedTimeSlotText: {
  color: 'white',
  fontWeight: '700',
},
timePickerButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
},
timePickerButton: {
  flex: 1,
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginHorizontal: 5,
},
cancelButton: {
  backgroundColor: '#f5f5f5',
},
confirmButton: {
  backgroundColor: '#FF3B30',
},
cancelButtonText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
confirmButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

// Date and Time Container Styles
dateTimeContainer: {
  marginTop: 20,
},
dateTimeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},
dateTimeInput: {
  flex: 0.48,
},
dateTimeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#f27171ff',
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 15,
  marginTop: 5,
 },
dateTimeText: {
  fontSize: 16,
  color: '#333',
   flex: 1,
      textAlign:"center"

},
timeIcon: {
  width: 18,
  height: 18,
 },
datePickerContainer: {
  backgroundColor: 'white',
  borderRadius: 10,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  marginTop: 10,
  marginBottom: 15,
},

// Flight Card Time Badge
preferredTimeBadge: {
  fontSize: 10,
  color: '#FF3B30',
  fontWeight: '600',
  marginTop: 2,
  backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 4,
  alignSelf: 'flex-start',
  padding:2, 
  marginBottom:5
},

// Flight Time Info
flightTimeInfo: {
  fontSize: 14,
  color: '#666',
  marginTop: 2,
},
  tripTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripTypeButtonActive: {
    backgroundColor: 'red',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  tripTypeTextActive: {
    color: 'white',
    fontWeight: '600',
        fontSize: 15,
  },

  profileIcon: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    marginTop: -30,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  searchCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
   },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8, 
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fafafa',
   },
  inputIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
    tintColor: 'red',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlignVertical:'center' ,
    textAlign:"center"
  },
  swapButton: {
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  swapIcon: {
    height: 20,
    width: 20,
    tintColor: 'red',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fafafa',
  },
  dateIcon: {
    height: 20,
    width: 20,
    },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  passengerContainer: {
    marginBottom: 24,
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fafafa',
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
    tintColor: '#666',
  },
  passengerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  editButton: {
    padding: 4,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  searchButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  flightsSection: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  featuredFlightCard: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
    backgroundColor: '#fffafa',
  },
  featuredBadge: {
    position: 'absolute',
    top: -6,
    left: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  airlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  flightClass: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3B30',
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  routeSection: {
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  airportText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  routeMiddle: {
    alignItems: 'center',
    flex: 2,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  flightLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  flightLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  flightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  jetSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowIcon: {
    height: 16,
    width: 16,
    tintColor: '#FF3B30',
  },
  jetList: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  saveButton: {
    padding: 4,
  },
  saveIcon: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 12,
  },
  cardInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    height: 16,
    width: 16,
    marginRight: 8,
    tintColor: '#666',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardPrice: {
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 4,
  },
  perFlight: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataIcon: {
    height: 80,
    width: 80,
    marginBottom: 16,
    opacity: 0.5, 
    tintColor:"red"
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});

export default styles;