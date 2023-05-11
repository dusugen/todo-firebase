import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { todosCollection } from "../../../firebase";
import { StatusOfRequestEnum } from "../../types/enums/statusOfRequestEnum";
import { PatchTodo } from "../../types/patchTodo";
import { Todo } from "../../types/todo";
import { RootState } from "./../store";

interface InitialState {
  singleTodo: {
    data: Todo | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  fetchTodo: {
    data: Todo[];
    status: StatusOfRequestEnum;
    error: string | null;
  };
  postTodo: {
    status: StatusOfRequestEnum;
    error: string | null;
  };
}

const initialState: InitialState = {
  fetchTodo: {
    data: [],
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
  postTodo: {
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
  singleTodo: {
    data: null,
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
};

export const fetchSingleTodo = createAsyncThunk<
  Todo | null,
  string,
  { rejectValue: string }
>("todos/fetchSingleTodo", async (id, { rejectWithValue }) => {
  try {
    const docItem = doc(todosCollection, id);
    const data = await getDoc(docItem);
    const result = data.data();

    return result ? { ...result } : null;
  } catch (error) {
    return rejectWithValue(String(error) || "Unknown Error !");
  }
});
export const postTodo = createAsyncThunk<
  void,
  { title: string; deadline: Dayjs },
  { rejectValue: string }
>("todos/postTodo", async (data, { rejectWithValue }) => {
  try {
    const customObj = doc(todosCollection);
    await addDoc(todosCollection, {
      title: data.title,
      isDone: false,
      id: customObj.id,
      created: serverTimestamp(),
      deadline: data.deadline.format("YYYY-MM-DD"),
    });
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const deleteTodo = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("todos/deleteTodo", async (id, { rejectWithValue }) => {
  try {
    const removeTodoDoc = doc(todosCollection, id);
    await deleteDoc(removeTodoDoc);
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const updateTodo = createAsyncThunk<
  void,
  {
    id: string;
    isDone?: boolean;
    title?: string;
    deadline?: Dayjs;
  },
  { rejectValue: string }
>(
  "todos/updateTodo",
  async ({ id, isDone, title, deadline }, { rejectWithValue }) => {
    try {
      const updateItem = doc(todosCollection, id);
      if (title && deadline) {
        await updateDoc(updateItem, {
          title: title,
          deadline: deadline.format("YYYY-MM-DD"),
          created: serverTimestamp(),
        });
      } else {
        await updateDoc(updateItem, {
          isDone,
        });
      }
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const dragTodo = createAsyncThunk<
  void,
  PatchTodo,
  { rejectValue: string }
>("todos/dragTodo", async (item, { rejectWithValue }) => {
  try {
    const itemDoc = doc(todosCollection, item.id);
    await updateDoc(itemDoc, item);
  } catch (error) {
    return rejectWithValue(String(error) || "Unknown Error !");
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    saveTodos: (state, action: PayloadAction<Todo[]>) => {
      state.fetchTodo.data = action.payload;
    },
    resetField: (state) => {
      state.singleTodo.data = null;
      state.singleTodo.status = StatusOfRequestEnum.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postTodo.pending, (state) => {
        state.postTodo.status = StatusOfRequestEnum.LOADING;
      })
      .addCase(postTodo.fulfilled, (state) => {
        state.postTodo.status = StatusOfRequestEnum.SUCCESS;
      })
      .addCase(postTodo.rejected, (state, action) => {
        state.postTodo.status = StatusOfRequestEnum.ERROR;
        state.postTodo.error = action.payload || "Error !";
      })
      .addCase(fetchSingleTodo.pending, (state) => {
        state.singleTodo.status = StatusOfRequestEnum.LOADING;
        state.singleTodo.error = null;
      })
      .addCase(fetchSingleTodo.fulfilled, (state, action) => {
        state.singleTodo.status = StatusOfRequestEnum.SUCCESS;
        state.singleTodo.data = action.payload;
      })
      .addCase(fetchSingleTodo.rejected, (state, action) => {
        state.singleTodo.status = StatusOfRequestEnum.ERROR;
        state.singleTodo.error = action.payload || "Unknown Error !";
      });
  },
});
export const { saveTodos, resetField } = todosSlice.actions;
export const selfSelector = (state: RootState) => state.todos;

export const selectTodos = createSelector(
  selfSelector,
  (state) => state.fetchTodo
);

export const selectSingleTodo = createSelector(
  selfSelector,
  (state) => state.singleTodo
);

export const selectFiltredTodo = createSelector(
  selectTodos,
  ({ data, ...other }) => {
    const withDate: Todo[] = [];
    const withoutDate: Todo[] = [];
    data.forEach((item) => {
      if (item.deadline !== "Invalid Date") {
        withDate.push(item);
      } else {
        withoutDate.push(item);
      }
    });
    return { ...other, withDate, withoutDate };
  }
);

export const selectPostTodo = createSelector(
  selfSelector,
  (state) => state.postTodo
);

export default todosSlice.reducer;
