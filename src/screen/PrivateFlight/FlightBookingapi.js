const BookingFormScreen = ({ route, navigation }) => {
  const params = route?.params || {};

  // user id (redux > route > 1)
  const featureState = useSelector((state) => state?.feature);
  const userData = featureState?.userGetData;
  const userId = String(userData?.id ?? params?.user_id ?? 1);

  const selectedSeats = params?.jet?.selectedSeats;
  const charterTotal =
    params?.jet?.charter?.price?.total ?? params?.jet?.price?.total;
}