import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import firebase from "../firebase";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    value: [],
    status: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      });
  },
});

const getUsers = async (db) => {
  const usersData = await getDocs(collection(db, "users"));
  const users = usersData.docs.map((doc) => {
    const id = doc.id;

    return { id, ...doc.data() };
  });

  return users;
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const db = getFirestore(firebase);
  const users = await getUsers(db);

  return users
    .sort((user1, user2) => {
      if (user1.first_name > user2.first_name) {
        return 1;
      }
      if (user1.first_name < user2.first_name) {
        return -1;
      }
      return 0;
    });
});

export default usersSlice.reducer;
