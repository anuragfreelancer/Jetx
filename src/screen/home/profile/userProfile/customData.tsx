    import imageIndex from "../../../../assets/imageIndex";
import ScreenNameEnum from "../../../../routes/screenName.enum";

    const MenuItems = [
        { id: '1', icon: imageIndex.profileu, label: 'Profile', screen: ScreenNameEnum.ProfileEdit },
        { id: '2', icon: imageIndex.boking, label: 'Booking History', screen: ScreenNameEnum.BookingHistory },
        // { id: '3', icon: imageIndex.payment, label: 'Payment Methods', screen: ScreenNameEnum.PaymentMethods },
        // { id: '4', icon: imageIndex.save, label: 'Saved Preferences', screen: ScreenNameEnum.SavedPreferences },
        { id: '5', icon: imageIndex.logouta, label: 'Log Out' },
        { id: '6', icon: imageIndex.delite, label: 'Delete Profile', screen: "" },
    ];


    export default MenuItems