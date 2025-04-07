import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// State का टाइप डिफाइन करें
interface UserState {
    userGetData: any;     // आप इसको specific type भी दे सकते हो (e.g., userGetData: UserType | null)
    loading: boolean;
    error: string | null;
    isSuccess?: boolean;
    isError?: boolean;
}

// Initial state टाइप के साथ
const initialState: UserState = {
    userGetData: null,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
};

// Payload के लिए टाइप
interface GetSuccessPayload {
    userGetData: any;  // इसे भी ज़रूरत के हिसाब से टाइप कर सकते हो
}

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getSuccess(state, action: PayloadAction<GetSuccessPayload>) {
            state.isSuccess = true;
            state.isError = false;
            state.userGetData = action.payload.userGetData;
        },
    },
});

export const { getSuccess } = userSlice.actions;
export default userSlice.reducer;
