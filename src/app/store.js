import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import serviceReducer from "../features/services/serviceSlice";
import savedReducer from "../features/saved/savedSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        services: serviceReducer,
        saved: savedReducer,
    },
});