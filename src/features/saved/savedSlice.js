import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "TN_SAVED_SERVICES_V1";

const loadSavedFromStorage = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const savedSlice = createSlice({
    name: "saved",
    initialState: {
        savedItems: loadSavedFromStorage(),
    },
    reducers: {
        toggleSaveService: (state, action) => {
            const service = action.payload;
            const targetId = service._id || service.id;

            const existingIndex = state.savedItems.findIndex(
                (item) => (item._id || item.id) === targetId
            );

            if (existingIndex >= 0) {
                // If already saved, remove it (unsave)
                state.savedItems.splice(existingIndex, 1);
            } else {
                // Otherwise add to saved
                state.savedItems.push(service);
            }

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedItems));
            } catch { }
        },
        removeSavedService: (state, action) => {
            const targetId = action.payload;
            state.savedItems = state.savedItems.filter(
                (item) => (item._id || item.id) !== targetId
            );
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedItems));
            } catch { }
        },
    },
});

export const { toggleSaveService, removeSavedService } = savedSlice.actions;

export const selectSavedItems = (state) => state.saved.savedItems;
export const selectIsServiceSaved = (serviceId) => (state) =>
    state.saved.savedItems.some((item) => (item._id || item.id) === serviceId);

export default savedSlice.reducer;