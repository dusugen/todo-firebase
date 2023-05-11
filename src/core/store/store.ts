import {
  combineReducers,
  configureStore
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import todosReducer from "./slices/todosSlice";

const combinedReducer = combineReducers({
  todos: todosReducer,
});

export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof combinedReducer>;

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();
