import React, { useEffect } from "react";
import { Header } from "components/Header.js";
import { Footer } from "components/Footer.js";
import { Toasts } from "components/Toasts.js";
import Columns from "components/Columns.js";
import IssueModal from "components/IssueModal.js";
import UserModal from "components/UserModal.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "store/usersSlice";
import { fetchColumns } from "store/columnsSlice";
import { fetchIssues } from "store/issuesSlice";


import "css/app.scss";
import "css/header.scss";
import "css/columns.scss";
import "css/issue-modal.scss";
import "css/user-modal.scss";

const App = function () {
  const dispatch = useDispatch();

  const columnsLoaded = useSelector((state) => state.columns.status);
  const issuesLoaded = useSelector((state) => state.issues.status);

  const issueModalStore = useSelector((state) => state.issueModal.value);
  const issueModal = issueModalStore ? <IssueModal /> : null;

  const userModalStore = useSelector((state) => state.userModal.value);
  const userModal = userModalStore ? <UserModal /> : null;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchColumns());
    dispatch(fetchIssues());
  }, []);

  return (
    <div className="px-2 px-md-3 py-2 pb-md-0 app__container">
      <Toasts />
      <Header />
      {columnsLoaded && issuesLoaded ? <Columns /> : null}
      {issueModal}
      {userModal}
      <Footer />
    </div>
  );
};

export default App;
