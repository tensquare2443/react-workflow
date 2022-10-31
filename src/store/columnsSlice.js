import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import firebase from "../firebase";

export const columnsSlice = createSlice({
  name: "columns",
  initialState: {
    value: [],
    status: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchColumns.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      });
  },
});

const getColumns = async (db) => {
  const columnsData = await getDocs(collection(db, "columns"));
  const columns = columnsData.docs.map((doc) => {
    const id = doc.id;

    return { id, ...doc.data() };
  });

  return columns;
};

export const fetchColumns = createAsyncThunk(
  "columns/fetchColumns",
  async () => {
    const db = getFirestore(firebase);
    const columns = await getColumns(db);

    return columns.sort((col1, col2) => {
      if (col1.order > col2.order) {
        return 1;
      }
      if (col1.order < col2.order) {
        return -1;
      }
      return 0;
    });
  }
);

export default columnsSlice.reducer;
