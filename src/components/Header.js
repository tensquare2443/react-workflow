import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import firebase from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setIssueModalData } from "store/modals/issueModalSlice";
import { setUserModalData } from "store/modals/userModalSlice";

import { getUserInitials } from "global";

export function Header() {
  const db = getFirestore(firebase);

  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [projectNameStatus, setProjectNameStatus] = useState("view");

  const users = useSelector((state) => state.users.value);

  const projectNameInputRef = useRef();

  useEffect(() => {
    const getProjectName = async (db) => {
      const projectsCol = collection(db, "projects");
      const projectSnapshot = await getDocs(projectsCol);
      const projectList = projectSnapshot.docs.map((doc) => {
        const id = doc.id;

        return { id, ...doc.data() };
      });
      const projectName = projectList[0].name;
      const projectId = projectList[0].id;

      setProjectName(projectName);
      setProjectId(projectId);
    };

    getProjectName(db);
  }, []);

  useEffect(() => {
    if (projectNameInputRef.current && projectNameStatus === "edit") {
      projectNameInputRef.current.focus();
    }
  }, [projectNameStatus]);

  const handleProjectNameClick = () => {
    const newStatus = projectNameStatus === "view" ? "edit" : "view";

    setProjectNameStatus(newStatus);
  };
  const handleProjectNameInputChange = (e) => {
    const newValue = e.target.value;

    setProjectName(newValue);
  };
  const endProjectNameEdit = async () => {
    setProjectNameStatus("view");

    await setDoc(doc(db, "projects", projectId), {
      name: projectName,
    });
  };

  const dispatch = useDispatch();

  const usersList = users.map((user, userI) => {
    const userInitials = getUserInitials(user);

    return (
      <div
        onClick={() => dispatch(setUserModalData({ user }))}
        role="button"
        className="user-icon__container clickable-icon"
        key={userI}
        title={`${user.first_name} ${user.last_name}`}
      >
        {userInitials}
      </div>
    );
  });

  return (
    <div>
      <div className="app__nav d-flex justify-content-between align-items-center mb-1">
        <div>
          {projectNameStatus === "view" ? (
            <h2
              className="app__title px-1 mb-0"
              onClick={handleProjectNameClick}
            >
              {projectName}
            </h2>
          ) : (
            <input
              ref={projectNameInputRef}
              type="text"
              id="projectNameInput"
              className="app__title-input mb-1"
              value={projectName}
              onChange={handleProjectNameInputChange}
              onBlur={endProjectNameEdit}
            />
          )}
        </div>
        <div className="d-none d-sm-block">
          <button
            onClick={() => dispatch(setIssueModalData({}))}
            className="btn btn-primary w-100"
          >
            <FontAwesomeIcon icon="plus" className="me-1" />
            Create Issue
          </button>
        </div>
      </div>
      <div className="d-none d-sm-block mb-1">
        {usersList}
        <div
          onClick={() => dispatch(setUserModalData({}))}
          role="button"
          className="user-icon__container clickable-icon"
        >
          <FontAwesomeIcon icon="user-plus" title="Add User" />
        </div>
      </div>
    </div>
  );
}
