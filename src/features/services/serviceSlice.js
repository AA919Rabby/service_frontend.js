import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getServiceDetailsApi } from "../../api/servicesApi";

// 🌟 Thunk: Fetch full service details from GET /v1/api/services/details/:id
export const fetchServiceDetails = createAsyncThunk(
    "services/fetchDetails",
    async (serviceId, { rejectWithValue }) => {
        try {
            const response = await getServiceDetailsApi(serviceId);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to load service details"
            );
        }
    }
);

const serviceSlice = createSlice({
    name: "services",
    initialState: {
        selectedService: null,
        isModalOpen: false,
        loadingDetails: false,
        error: null,
    },
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.selectedService = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServiceDetails.pending, (state) => {
                state.loadingDetails = true;
                state.isModalOpen = true;
                state.error = null;
            })
            .addCase(fetchServiceDetails.fulfilled, (state, action) => {
                state.loadingDetails = false;
                state.selectedService = action.payload;
            })
            .addCase(fetchServiceDetails.rejected, (state, action) => {
                state.loadingDetails = false;
                state.error = action.payload;
            });
    },
});

export const { openModal, closeModal } = serviceSlice.actions;
export default serviceSlice.reducer;