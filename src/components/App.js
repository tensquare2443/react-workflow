import React, { useEffect } from "react";
import { Header } from "components/Header.js";
import Columns from "components/Columns.js";
import IssueModal from "components/IssueModal.js";
import UserModal from "components/UserModal.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "store/usersSlice";
import { fetchColumns } from "store/columnsSlice";
import { fetchIssues } from "store/issuesSlice";

import * as bootstrap from "bootstrap";

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

    const toastElList = document.querySelectorAll(".toast");
    [...toastElList].map((toastEl) => new bootstrap.Toast(toastEl, {}));
  }, []);

  return (
    <div className="px-2 px-md-3 py-2 pb-md-3 app__container">
      <div
        className="app__toast toast align-items-center text-bg-success border-0"
        id="issueCreateUpdateToast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">
            Issue has been successfully created/updated.
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <div
        className="app__toast toast align-items-center text-bg-success border-0"
        id="issueDeleteToast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">Issue has been successfully deleted.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <div
        className="app__toast toast align-items-center text-bg-success border-0"
        id="userCreateUpdateToast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">
            User has been successfully created/updated.
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <div
        className="app__toast toast align-items-center text-bg-success border-0"
        id="userDeleteToast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">User has been successfully deleted.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <Header />
      {columnsLoaded && issuesLoaded ? <Columns /> : null}
      {issueModal}
      {userModal}
    </div>
  );
};

export default App;
