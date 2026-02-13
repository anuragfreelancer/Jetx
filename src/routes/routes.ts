  import CreateNewPassword from "../screen/auth/createNewPassword/CreateNewPassword";
import Login from "../screen/auth/login/Login";
 import OtpScreen from "../screen/auth/otpScreen/OtpScreen";
import PasswordReset from "../screen/auth/passwordReset/PasswordReset";
import SignUp from "../screen/auth/signUp/SignUp";
import Splash from "../screen/auth/splash/Splash";
 import { useSelector } from "react-redux";
 import ScreenNameEnum from "./screenName.enum";
import OnboardingScreen from "../screen/auth/onboarding/Onboarding";
import AddProfilePicture from "../screen/auth/addProfilePicture/ProfilePicture";
import AddLocation from "../screen/auth/addLocation/AddLocation";
import ChangeLocation from "../screen/auth/changeLocation/ChangeLocation";
import HomeScreen from "../screen/home/homeScreen/HomeScreen";
import SearchFlight from "../screen/home/searchFlight/SearchFlight";
import JetDetails from "../screen/home/jetDetails/JetDetails";
import BookNow from "../screen/home/bookNow/BookNow";
import BookPayment from "../screen/home/bookPayment/BookPayment";
import PaymentVerify from "../screen/home/paymentverify/Paymentverify";
import ProfileScreen from "../screen/home/profile/userProfile/ProfileScreen";
import ProfileEdit from "../screen/home/profile/profileEdit/ProfileEdit";
import BookingHistory from "../screen/home/profile/bookingHistory/BookingHistory";
import AdminBookingsScreen from "../screen/home/profile/bookingHistory/AdminBookingsScreen";
import SavedPreferences from "../screen/home/savedPreferences/SavedPreferences";
import PaymentMethods from "../screen/home/paymentMethods/PaymentMethods";
import Notification from "../screen/home/notification/Notification";
import FlightOffersScreen from "../screen/home/homeScreen/FlightOffersScreen";
import PrivateJetBoking from "../screen/home/PrivateJetBoking/PrivateJetBoking";
import FlightBookingForm from "../compoent/FlightBookingForm";
import PrivateJetScreen from "../screen/PrivateJets/PrivateJets";
 import SearchFlightsScreen from '../Aviapages/SearchFlightsScreen.js'  ; 
 import PrivateJetsScreen from '../screen/PrivateFlight/PrivateJetsScreen';
 import JetDetailScreen from '../screen/PrivateFlight/JetDetailScreen';
 import BookingFormScreen from '../screen/PrivateFlight/BookingFormScreen';
 import PaymentScreen from '../screen/PrivateFlight/PaymentScreen';
 import ConfirmationScreen from '../screen/PrivateFlight/ConfirmationScreen';
import CharterDetailsScreen from "../screen/home/CharterDetailsScreen.js";
 const useAuth = () => {
  return useSelector((state: any) => state?.auth);
};

const _routes = () => {
  const isLogin = useAuth(); // Hook function inside component/function
   return {
    REGISTRATION_ROUTE: [
            { name: ScreenNameEnum.SPLASH_SCREEN, Component: Splash },
       

      { name: ScreenNameEnum.OnboardingScreen, Component: OnboardingScreen },
      { name: ScreenNameEnum.SignUpScreen, Component: SignUp },
      { name: ScreenNameEnum.LoginScreen, Component: Login },
        { name: ScreenNameEnum.PasswordReset, Component: PasswordReset },
      { name: ScreenNameEnum.OtpScreen, Component: OtpScreen },
      { name: ScreenNameEnum.CreatePassword, Component: CreateNewPassword },
        { name: ScreenNameEnum.AddProfilePicture, Component: AddProfilePicture },
       { name: ScreenNameEnum.AddLocation, Component: AddLocation },
       { name: ScreenNameEnum.ChangeLocation, Component: ChangeLocation },
       { name: ScreenNameEnum.HomeScreen, Component: HomeScreen },
       { name: ScreenNameEnum.SearchFlight, Component: SearchFlight },
       { name: ScreenNameEnum.JetDetails, Component: JetDetails },
       { name: ScreenNameEnum.BookNow, Component: BookNow },
       { name: ScreenNameEnum.BookPayment, Component: BookPayment },
       { name: ScreenNameEnum.PaymentVerify, Component: PaymentVerify },
       { name: ScreenNameEnum.ProfileScreen, Component: ProfileScreen },
       { name: ScreenNameEnum.ProfileEdit, Component: ProfileEdit },
       { name: ScreenNameEnum.BookingHistory, Component: BookingHistory },
       { name: ScreenNameEnum.AdminBookings, Component: AdminBookingsScreen },
       { name: ScreenNameEnum.SavedPreferences, Component: SavedPreferences },
       { name: ScreenNameEnum.PaymentMethods, Component: PaymentMethods },
       { name: ScreenNameEnum.Notifications, Component: Notification },
       { name: "CharterDetailsScreen", Component: CharterDetailsScreen },



       { name: "FlightOffersScreen", Component: FlightOffersScreen },
       { name: ScreenNameEnum.PrivateJetScreen, Component: PrivateJetScreen },
       { name: "FlightBookingFormScreen", Component: FlightBookingForm },
       { name: "PrivateJetBoking", Component: PrivateJetBoking },





            { name: "PrivateJetsScreen", Component: PrivateJetsScreen },
            { name: "JetDetail", Component: JetDetailScreen },
            { name: "BookingFormScreen", Component: BookingFormScreen },
            // { name: "PaymentScreen", Component: PaymentScreen },
            { name: "ConfirmationScreen", Component: ConfirmationScreen },

            //  { name: "SearchFlightsScreen", Component: SearchFlightsScreen },
      ],

  
  };
};

export default _routes;
