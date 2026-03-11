import { base_url, constant } from "../../config/constant";
import ScreenNameEnum from "../../routes/screenName.enum";
import { errorToast, successToast } from "../../utils/customToast";
import { loginSuccess } from "../feature/authSlice";
import { getSuccess } from "../feature/authGetSlice";

/**
 * Safely parse JSON from server. Prevents "Unexpected character: <" when server returns HTML.
 * Throws a proper Error so Error.stack works correctly.
 */
function safeParseJson(text, context = "Response") {
    const raw = typeof text === "string" ? text.trim() : "";
    if (!raw) {
        throw new Error(`${context}: Empty response`);
    }
    const first = raw.charAt(0);
    if (first !== "{" && first !== "[") {
        throw new Error(`${context}: Server returned non-JSON (check URL and server).`);
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`${context}: Invalid JSON - ${msg}`);
    }
}

const LoginUserApi = async (
    param,
    setLoading,
     ) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("email", param?.email);
        formdata.append("password", param?.password);
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = await fetch(`${base_url}${constant.Login}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "Login");
                console.log("response", response);
                if (response?.status == '1') {
                    setLoading(false);
                    successToast(response?.message);
                    param.dispatch(loginSuccess({ userData: response?.result, token: response?.result?.access_token }));
                    param.navigation.reset({
                        index: 0,
                        routes: [{ name: ScreenNameEnum.HomeScreen }],
                    });
                    return response;
                } else {
                    setLoading(false);
                    errorToast(response?.message || "Login failed");
                    return response;
                }
            })
            .catch((error) => {
                setLoading(false);
                const message = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(message);
                console.error("Login error:", message);
                console.error("error error:", error);
            });
        return respons;
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const SinupUserApi = async (param, setLoading) => {
    try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("mobile", param?.mobile);
        formData.append("user_name", param?.fullName);
        formData.append("email", param?.email);
        formData.append("password", param?.password);
        formData.append("country", param?.county);
        formData.append("city", param?.city);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };

        const response = await fetch(`${base_url}${constant.SignUp}`, requestOptions);
        const res = await response.text();
        const jsonResponse = safeParseJson(res, "SignUp");

        setLoading(false);
        if (jsonResponse?.status == "1") {
            successToast(jsonResponse?.message);
            param?.navigation.navigate(ScreenNameEnum.LoginScreen);
            return jsonResponse;
        } else {
            errorToast(jsonResponse?.message || "Sign up failed");
            return jsonResponse;
        }
    } catch (error) {
        setLoading(false);
        const message = error instanceof Error ? error.message : "Invalid response from server";
        errorToast(message);
    }
};

const ForgotPassUserApi = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("email", param?.email);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = await fetch(`${base_url}${constant.ForgetPassword}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword")
                if (response?.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    if (param?.type == "Resend") {

                    }
                    else {
                        param?.navigation.navigate(ScreenNameEnum.OtpScreen, {
                            email: param?.email
                        });
                    }

                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};

const OtpUserApi = async (
    param,
    setLoading,
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
        const respons = await fetch(`${base_url}${constant.OtpVerify}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword")
                if (response?.status == '1') {
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
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};

const UpdatePassUserApi = async (
    param,
    setLoading,
) => {

    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("user_id", param?.userId);
        formdata.append("password", param?.confirm_password);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const respons = await fetch(`${base_url}${constant.UpdatePassword}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword")
                if (response?.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.navigate(ScreenNameEnum.LoginScreen)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.message,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};

const UpdateProfile_Api = async (param, setLoading) => {
    try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        
        const formData = new FormData();
        
        // Append image if exists
        if (param?.images && param.images.uri) {
            formData.append("image", {
                uri: param.images.uri,
                type: param.images.mime || 'image/jpeg',
                name: 'profile_image.jpg'
            });
        }
        
        // Append other form data
        formData.append("user_id", param?.userId);
        formData.append("user_name", param?.name);
        formData.append("mobile", param?.mobile);
        formData.append("email", param?.email);
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };

        const response = await fetch(`${base_url}${constant.updateProfile}`, requestOptions);
        const responseText = await response.text();
        const result = safeParseJson(responseText, "API");
        
        if (result.status == '1') {
            successToast(result?.message);
            param.navigation.goBack();
            return result;
        } else {
            errorToast(result?.message || result?.error);
            return result;
        }
    } catch (error) {
        console.error('API Error:', error);
        errorToast('Network error');
    } finally {
        setLoading(false);
    }
};


const GetProfile = async (userId, dispatch) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formdata = new FormData();
        formdata.append("user_id", userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };
        const response = await fetch(`${base_url}${constant.getrofile}`, requestOptions)
        const resText = await response.text(); // Ensure text is received before parsing
        const responseData = safeParseJson(resText, "API");
        if (responseData.status == '1') {
            console.log("responseData.status",responseData.result)
            dispatch(
                getSuccess({
                    userGetData: responseData.result,
                })
            );
            return { userGetData: responseData.result };
        } else {
            errorToast(responseData.message);
        }
    } catch (error) {
        errorToast('Network error');
    }
};

const GetaboutusePolicyApi = async (
    setLoading,
) => {
    try {
        setLoading(true)

        const requestOptions = {
            method: "GET",
        };
        const respons = await fetch(`${base_url}${constant.getAboutUs}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};
const PrivacyPolicyApi = async (
    setLoading,
) => {
    try {
        setLoading(true)

        const requestOptions = {
            method: "GET",
        };
        const respons = await fetch(`${base_url}${constant.getPrivacy}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};


const AddContactUs = async (
    data,
    setLoading,
    id,
) => {

    try {
        setLoading(true)
        const formData = new FormData();
        const myHeaders = new Headers();
        formData.append("user_id", id);
        formData.append("name", data?.name);
        formData.append("email", data?.email);
        formData.append("mobile", data?.mobile);
        formData.append("message", data?.message);
        console.log("formData", formData)
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.AddContact_us}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false);
                    successToast(
                        response?.message
                    );
                    data.navigation.navigate(ScreenNameEnum.BOTTOM_TAB)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};




const ChangePasswordApi = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("user_id", param?.userId);
        formData.append("password", param?.password);
        formData.append("confirm_password", param?.confirm_password);
        formData.append("old_password", param?.currentPass);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.changePassword}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.goBack()
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};




const PlayerPostApi = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        const formattedDate = param?.dob ? param?.dob?.toLocaleDateString() : '';

        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        if (param?.addImage) {
            formData.append("image", {
                uri: param?.addImage?.path,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
        }
        formData.append("coach_id", param?.userId);
        formData.append("email", param?.email);
        formData.append("password", param?.pass);
        formData.append("player_id", param?.playerId);
        formData.append("position_id", param?.posttion);
        formData.append("load_type_id", param?.traing);
        formData.append("team_id", param?.team);
        formData.append("user_name", param?.fullName ?? '');
        formData.append("player_details", param?.notes ?? '');
        formData.append("dob", formattedDate ?? '');
        formData.append("injury", param?.injury ?? '');
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.addPlayer}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                console.log("res", res);
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.goBack()
                    // param.navigation.navigate(ScreenNameEnum.TabNavigator)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};



const PlayerPostEditApi = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        const formattedDate = param?.dob ? param?.dob?.toLocaleDateString() : param?.newDate;
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        if (param?.addImage) {
            formData.append("image", {
                uri: param?.addImage?.path,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
        }
        formData.append("user_id", param?.userId);
        formData.append("player_id", param?.player_id);
        formData.append("user_name", param?.fullName);
        if (param?.posttion) {
            formData.append("position_id", param?.posttion);
        }
        if (param?.traing) {
            formData.append("load_type_id", param?.traing);
        }
        if (param?.team) {
            formData.append("team_id", param?.team);
        }
        formData.append("dob", formattedDate ?? '');
        formData.append("player_details", param?.notes ?? '');
        formData.append("injury", param?.injury ?? '');
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.updatePlayer}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                 const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.navigate(ScreenNameEnum.TabNavigator)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        console.log("error", error)

        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};


const Teamcategory = async (
    setisLoading
) => {
    try {
        setisLoading(true)
        const requestOptions = {
            method: "GET",
        };
        const respons = await fetch(`${base_url}${constant.GettTeam}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setisLoading(false)

                    return response
                } else {
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        errorToast(
            'Network error',
        );
    }
};


const PositioncCategory = async (
) => {
    try {
        const requestOptions = {
            method: "GET",
        };
        const respons = await fetch(`${base_url}${constant.getPosition}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {

                    return response
                } else {
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        errorToast(
            'Network error',
        );
    }
};

const TrainingCategory = async (
) => {
    try {
        const requestOptions = {
            method: "GET",
        };
        const respons = await fetch(`${base_url}${constant.getLoadType}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {

                    return response
                } else {
                    errorToast(
                        response.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        errorToast(
            'Network error',
        );
    }
};


const Getplayer = async (userId, setLoading) => {
    try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        const response = await fetch(`${base_url}${constant.getPlayer}?user_id=${userId}`, requestOptions);
        // const response = await fetch(`${base_url}${constant.getPlayer}?coach_id=${userId}`, requestOptions);
        const resText = await response.text();
        const responseData = safeParseJson(resText, "API");
        if (responseData.status === '1') {
            successToast(responseData.message);
            return { userGetData: responseData.result };
        } else {
            errorToast(responseData.message);
            return null;
        }
    } catch (error) {
        errorToast('Network error');
        return null;
    } finally {
        setLoading(false);
    }
};

const GetNotifications = async (userId, setLoading) => {
    console.log("userId",userId)
    try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };
        const response = await fetch(`${base_url}${constant.getNotifications}?user_id=${userId}`, requestOptions);
          const resText = await response.text();
        const responseData = safeParseJson(resText, "API");
         if (responseData.status === '1') {
            successToast(responseData.message);
            return { userGetData: responseData.result };
        } else {
            errorToast(responseData.message);
            return null;
        }
    } catch (error) {
        errorToast('Network error');
        return null;
    } finally {
        setLoading(false);
    }
};

const SumitRpfFrom = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("user_id", param?.userId);
        formData.append("rpf_session", param?.session);
        formData.append("rpf_date", param?.date);
        formData.append("rate_efforts", param?.effort);
        formData.append("comment", param?.comments);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.addubmitRPF}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                console.log("res", res)
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.goBack()
                    // param.navigation.navigate(ScreenNameEnum.TabNavigator)
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};


const GetSubmitRPF = async (userId, setLoading) => {
    try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        const response = await fetch(`${base_url}${constant.getSubmit_RPF}?user_id=${userId}`, requestOptions);
        const resText = await response.text();
        const responseData = safeParseJson(resText, "API");
        if (responseData.status === '1') {
            successToast(responseData.message);
            return { userGetData: responseData.result };
        } else {
            // errorToast(responseData.message);
            return null;
        }
    } catch (error) {
        errorToast('Network error');
        return null;
    } finally {
        setLoading(false);
    }
};


// const GetAllChatMessage = async (setLoading, userId) => {
//     try {
//         setLoading(true);

//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");

//         const formData = new FormData();
//         formData.append("receiver_id", "2");

//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders, // No need to set `Content-Type` for FormData
//             body: formData
//         };

//         const response = await fetch(`${base_url}${constant.getConversation}`, requestOptions);
//         const resText = await response.text();
//         const responseData = safeParseJson(resText, "API");
//         console.log("ddddd",responseData)
//         if (responseData.status === '1') {
//             successToast(responseData.message);
//             return { userGetData: responseData.result };
//         } else {
//              return null;
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         errorToast('Network error');
//         return null;
//     } finally {
//         setLoading(false);
//     }
// };

const GetAllChatMessage = async (setLoading, userId) => {
    try {
        setLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");

        const formData = new FormData();
        formData.append("receiver_id", userId); // Pass dynamic userId instead of static "2"

        const requestOptions = {
            method: "POST",
            headers: myHeaders, // No need to set `Content-Type` for FormData
            body: formData
        };

        const response = await fetch(`${base_url}${constant.getConversation}`, requestOptions);
        const resText = await response.text();

        try {
            const responseData = safeParseJson(resText, "API");
            console.log("API Response:", responseData);

            // ✅ FIXED: Check for both number 1 and string "1"
            if (responseData.status == 1) {
                return { userGetData: responseData.result };
            } else {
                console.error("API returned error status:", responseData);
                return null;
            }
        } catch (jsonError) {
            console.error("JSON Parsing Error:", jsonError, resText);
            return null;
        }
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    } finally {
        setLoading(false);
    }
};



const SendMessage = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("sender_id", param?.senderId);
        formData.append("receiver_id", param?.receiverId);
        formData.append("chat_message", param?.chatMessage);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.sendChat}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                 const response = safeParseJson(res, "ForgotPassword");
                if (response.result.chat_message) {
                    setLoading(false)
                   
                    
                    // param.navigation.navigate(ScreenNameEnum.TabNavigator)
                    return response
                } else {
                    setLoading(false)

                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};

const FeedbackApicall = async (
    param,
    setLoading,
) => {
    try {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("user_id", param?.userID);
        formData.append("feedback", param?.feedbackText);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        console.log("-------", formData)
        const respons = await fetch(`${base_url}${constant.addFeedback}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                console.log("-ol", res)
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    setLoading(false)
                    successToast(
                        response?.message
                    );
                    param.navigation.goBack()
                    return response
                } else {
                    setLoading(false)
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};




const GetChat = async (
    params,
) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const formData = new FormData();
        formData.append("sender_id", params?.senderId);
        formData.append("receiver_id", params?.receiverId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };
        const respons = await fetch(`${base_url}${constant.getChat}`, requestOptions)
            .then((response) => response.text())
            .then((res) => {
                const response = safeParseJson(res, "ForgotPassword");
                if (response.status == '1') {
                    return response
                } else {
                    errorToast(
                        response?.message || response?.error,
                    );
                    return response
                }
            })
            .catch((error) => {
                setLoading(false);
                const msg = error instanceof Error ? error.message : "Invalid response from server";
                errorToast(msg);
                console.error(msg);
            });
        return respons
    } catch (error) {
        setLoading(false)
        errorToast(
            'Network error',
        );
    }
};





 const BookingApi = async (param, setLoading) => {
  try {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const formData = new FormData();
    formData.append("user_id", param?.user_id);
    formData.append("flight_name", param?.flight_name);
    formData.append("source_airport_name", param?.source_airport_name);
    formData.append("destination_airport_name", param?.destination_airport_name);
    formData.append("journey_date", param?.journey_date);
    formData.append("total_passengers", param?.total_passengers);
    formData.append("total_amount", param?.total_amount);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
    };

    const response = await fetch(
      `${base_url}add_booking`,
      requestOptions
    );

    const responseText = await response.text();
    const result = safeParseJson(responseText, "API");

    if (result.status == "1") {
      successToast(result?.message);
      return result;
    } else {
      errorToast(result?.message || result?.error);
      return result;
    }
  } catch (error) {
    console.error("API Error:", error);
    errorToast("Network error");
  } finally {
    setLoading(false);
  }
};
  const GetBookingsByUserApi = async (userId, setLoading) => {
  try {
    setLoading(true);

    const response = await fetch(
      `${base_url}get_bookings_by_user?user_id=${userId}`
    );

    const responseText = await response.text();
    const result = safeParseJson(responseText, "API");
    console.log("responseq",response)

    if (result.status == "1") {
      return result?.result || [];
    } else {
      errorToast(result?.message || "No bookings found");
      return [];
    }
  } catch (error) {
    console.error("Get booking API error:", error);
    errorToast("Network error");
    return [];
  } finally {
    setLoading(false);
  }
};

/** Fetch all bookings (for admin). Backend should expose get_all_bookings and restrict by role. */
const GetAllBookingsApi = async (setLoading) => {
  try {
    setLoading(true);
    const response = await fetch(`${base_url}get_all_bookings`);
    const responseText = await response.text();
    const result = safeParseJson(responseText, "API");
    if (result.status == "1") {
      return result?.result || result?.data || [];
    }
    errorToast(result?.message || "No bookings found");
    return [];
  } catch (error) {
    console.error("Get all bookings API error:", error);
    errorToast("Network error");
    return [];
  } finally {
    setLoading(false);
  }
};

export { BookingApi , GetChat, GetBookingsByUserApi, GetAllBookingsApi, FeedbackApicall, PrivacyPolicyApi, GetAllChatMessage, GetSubmitRPF, SumitRpfFrom, PlayerPostEditApi, Getplayer, TrainingCategory, PositioncCategory, Teamcategory, PlayerPostApi, GetaboutusePolicyApi, AddContactUs, ChangePasswordApi, LoginUserApi, UpdateProfile_Api, GetProfile, SinupUserApi, ForgotPassUserApi, OtpUserApi, UpdatePassUserApi }  