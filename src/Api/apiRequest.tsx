

 import { base_url } from './index';
import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess } from '../redux/feature/authSlice';
 import { errorToast, successToast } from '../utils/customToast';
 
const LoginCustomer = (
    param: any,
    setLoading: (loading: boolean) => void,
    dispatch: any) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("email", param?.email);
        formdata.append("password", param?.password);
        formdata.append("type", param?.roleType);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = fetch(`${base_url}/Login`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    dispatch(loginSuccess({ userData: response?.result, token: response?.result?.access_token, }));
                    // param.navigation.replace('DrawerNav');
                    param.navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerNav' }],
                      });
                      
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const AcceptScrapperApi = (
    param: any,
    setLoading: (loading: boolean) => void,
    item:any
    ) => {
     try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
          formdata.append("post_id", param?.postId);
        //   formdata.append("status", "Accept");
          formdata.append("status", param?.type);
        //   formdata.append("status", "Accept");
        //   formdata.append("status", "Pickup");
          formdata.append("scraper_id", param?.scraperid);
         const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        console.log("formdata",formdata)
        const respons = fetch(`${base_url}/accept_cancel_post`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response?.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    ); 
                    if(param?.type =="Accept") {
                        param.navigation.navigate(ScreenNameEnum.TrackerMapScreen,{
                            AcceptData:item
                        })
                    } 
                    if(param?.type =="Cancel") {
                        param.navigation.goBack()
                    }
                     // param.navigation.replace('DrawerNav');
                 
                      
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const SinupCustomer = (params: any,
    setLoading: (loading: boolean) => void,) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("user_name", params?.userName);
        formdata.append("password", params?.password);
        formdata.append("email", params?.email);
        formdata.append("type", params?.type);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = fetch(`${base_url}/Register`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response.status == '1') {
                    successToast(
                        response?.message
                    );
                    params.navigation.navigate(ScreenNameEnum.LoginScreen);
                    return response
                } else {
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => console.error(error));
        return respons
    } catch (error) {
        errorToast(
            'Network error',
        );
    }
};


const restEmailOtpScreen = (
    param: any,
    setLoading: (loading: boolean) => void,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("email", param?.email);
        //  formdata.append("type", param?.roleType);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = fetch(`${base_url}/Password-Reset`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.navigate(ScreenNameEnum.OtpScreen, {
                        email: param?.email
                    })
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const otp_Verify = (
    param: any,
    setLoading: (loading: boolean) => void,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("email", param?.email);
        formdata.append("otp", param?.otp);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = fetch(`${base_url}/otpVerify`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.navigate(ScreenNameEnum.CreatePassword, {
                        userId: response?.result?.id
                    })
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const updatePassword = (
    param: any,
    setLoading: (loading: boolean) => void,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("user_id", param?.userId);
        formdata.append("password", param?.confirmPassword);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = fetch(`${base_url}/update_password`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.navigate(ScreenNameEnum.LoginScreen)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const AddPostApi = (
    param: any,
    setLoading: (loading: boolean) => void,
) => {
    console.log("param",param)
    try {
 
         setLoading(true)
        const myHeaders = new Headers();

        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("image", {
            uri: param?.image.path,          // Make sure param.image.path is a valid file URI
            type: 'image/jpeg',
            name: 'image.jpg'
        });
        formData.append("user_id", param?.id ?? '');
        formData.append("title", param?.itemName ?? '');
        formData.append("about", param?.description ?? '');
        formData.append("address", param?.address ?? '');
        formData.append("lat", '22.6990'); 
        formData.append("long", '75.8671');
           formData.append("category_id",param?.category);
        const requestOptions = {
        
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        console.log("formData",formData)
        const respons = fetch(`${base_url}/add_post`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res);
                console.log("---- ----ddv response", response)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    // param.navigation.navigate(ScreenNameEnum.LoginScreen)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};

const Policies_Api = (
    setLoading: (loading: boolean) => void,
) => {
    try {
        setLoading(true)

        const requestOptions = {
            method: "GET",
        };
        const respons = fetch(`${base_url}/get-privacy-policy`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res);
                console.log("----response", response)
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const Get_post_Api = async (
    setLoading: (loading: boolean) => void,
    id: string
) => {
    setLoading(true); // Start loading

    try {
        const requestOptions = {
            method: "GET",
        };

         const response = await fetch(`${base_url}/get_post?user_id=${id}`, requestOptions);
        const resText = await response.text();
        const responseData = JSON.parse(resText);
        setLoading(false);
        // Check API response status
        if (responseData.status === "1") {
         } else {
            errorToast(responseData.error);
        }
        return responseData; // ✅ Return correct response object
    } catch (error) {
         errorToast("Network error");
        return null; // Return null in case of failure
    } finally {
        setLoading(false); // Stop loading regardless of success or failure
    }
};
const Get_post_scraper = async (
    setLoading: (loading: boolean) => void,
    id: string
) => {
    setLoading(true); // Start loading

    try {
        const requestOptions = {
            method: "GET",
        };

         const response = await fetch(`${base_url}/get_post_scraper?scraper_id=${id}`, requestOptions);
        const resText = await response.text();
        const responseData = JSON.parse(resText);
        setLoading(false);
        // Check API response status
        if (responseData.status === "1") {
         } else {
            errorToast(responseData.error);
        }
        return responseData; // ✅ Return correct response object
    } catch (error) {
         errorToast("Network error");
        return null; // Return null in case of failure
    } finally {
        setLoading(false); // Stop loading regardless of success or failure
    }
};


const EditProfile_Api = (
    param: any,
    setLoading: (loading: boolean) => void,
    navigation: any
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        if (param.images) {
            formData.append("image", {
                uri: param.images.path,          // Make sure param.image.path is a valid file URI
                type: 'image/jpeg',
                name: 'image.jpg'
            });
        }
        formData.append("user_name", param?.name ?? '');
        formData.append("user_id", param?.userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = fetch(`${base_url}/update-profile`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res);
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );

                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};


const Get_category = (
 ) => {
    try {
 
        const requestOptions = {
            method: "GET",
        };
        const respons = fetch(`${base_url}/get_category`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res);
                if (response.status == '1') {
                 
                    return response
                } else {
                     errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
         errorToast(
            'Network error',
        );
    }
};

const Support_Api = (
    supportHelp: any,
    setLoading: (loading: boolean) => void,
    id: any,
    navigation: any
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("user_id", id);
        formData.append("message", supportHelp);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = fetch(`${base_url}/create-support-inquiries`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = JSON.parse(res);
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    navigation.goBack();
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) =>
                console.error(error));
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const ChangePass_Api = (
    data:any,
    id: any,
     setLoading: (loading: boolean) => void,
) => {
     try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("old_password", data?.oldpassw);
        formData.append("password", data?.password);
        formData.append("confirm_password",data?.confirmPassword);
        formData.append("user_id", id);
         const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = fetch(`${base_url}change-password`, requestOptions)
        .then((response) => response.text())
        .then((res) => {
            const response = JSON.parse(res)
             if(response?.status ==="0"){
                errorToast(
                    response.error,
                );  
            }
            if (response?.status == '1') {
                setLoading(false)
                successToast(
                    response?.message
                );
                 return response
            } else {
                setLoading(false);
                 errorToast(
                    response.error,
                );
                return response
            }
        })
        .catch((error) =>
            console.error(error));
    return respons
} catch (error) {
    setLoading(false)
    errorToast(
        'Network error',
    );
}
};



const Get_Notification_Api = async (
    setLoading: (loading: boolean) => void,
    id: string
) => {
    setLoading(true); // Start loading

    try {
        const requestOptions = {
            method: "GET",
        };

         const response = await fetch(`${base_url}/get_post?user_id=${id}`, requestOptions);
        const resText = await response.text();
        const responseData = JSON.parse(resText);
        setLoading(false);
        // Check API response status
        if (responseData.status === "1") {
         } else {
            errorToast(responseData.error);
        }
        return responseData; // ✅ Return correct response object
    } catch (error) {
         errorToast("Network error");
        return null; // Return null in case of failure
    } finally {
        setLoading(false); // Stop loading regardless of success or failure
    }
};
export { Get_post_scraper,AddPostApi,Get_post_Api,AcceptScrapperApi, Get_Notification_Api,SinupCustomer, Support_Api,Get_category, Policies_Api, ChangePass_Api, EditProfile_Api, updatePassword, restEmailOtpScreen, LoginCustomer, otp_Verify, }  