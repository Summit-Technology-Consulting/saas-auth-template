import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types/user.types";

const initialState: User = {
  id: null,
  username: "",
  creditBalance: 0,
  email: "",
  plan: { name: "", subscription_id: null, expires_at: null },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<User>>) {
      Object.assign(state, action.payload);
    },
    updateCreditBalance(state, action: PayloadAction<number>) {
      state.creditBalance = action.payload;
    },
    updatePlan(state, action: PayloadAction<Partial<User["plan"]>>) {
      Object.assign(state.plan, action.payload);
    },
    clearUser(state) {
      state.id = null;
      state.username = "";
      state.creditBalance = 0;
      state.email = "";
      state.plan = { name: "", subscription_id: null, expires_at: null };
    },
    resetToInitialState() {},
  },
});

export const {
  setUser,
  updateCreditBalance,
  updatePlan,
  clearUser,
  resetToInitialState,
} = userSlice.actions;

export default userSlice.reducer;
