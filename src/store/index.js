import { configureStore } from "@reduxjs/toolkit";

import issueModalReducer from "store/modals/issueModalSlice";
import userModalReducer from "store/modals/userModalSlice";
import usersReducer from "store/usersSlice";
import columnsReducer from "store/columnsSlice";
import issuesReducer from "store/issuesSlice";

export default configureStore({
  reducer: {
    issueModal: issueModalReducer,
    userModal: userModalReducer,
    users: usersReducer,
    columns: columnsReducer,
    issues: issuesReducer,
  },
});
