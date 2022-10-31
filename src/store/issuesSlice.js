import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import firebase from "../firebase";

export const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    value: [],
    status: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      });
  },
});

const getIssues = async (db) => {
  const issuesData = await getDocs(collection(db, "issues"));
  const issues = issuesData.docs.map((doc) => {
    const id = doc.id;

    return { id, ...doc.data() };
  });

  return issues;
};

export const fetchIssues = createAsyncThunk("issues/fetchIssues", async () => {
  const db = getFirestore(firebase);
  const issues = await getIssues(db);

  issues.forEach((issue) => {
    /**
     * we already have users and columns, so can reduce these keys to
     * just their ids (which also avoids the thunk error)
     */
    if (issue.assigned_to) {
      const assignedToSegments = issue.assigned_to._key.path.segments;
      issue.assigned_to = assignedToSegments[assignedToSegments.length - 1];
    }

    const columnsSegments = issue.column._key.path.segments;
    issue.column = columnsSegments[columnsSegments.length - 1];
    /**
     * end
     */
  });

  return issues;
});

export default issuesSlice.reducer;
