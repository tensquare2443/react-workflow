import React from "react";
import firebase from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore/lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInitials } from "global";
import { setIssueModalData } from "store/modals/issueModalSlice";
import { ReactSortable } from "react-sortablejs";
import cloneDeep from "clone-deep";
import _ from "lodash";

const Columns = function () {
  const dispatch = useDispatch();
  const db = getFirestore(firebase);

  const columns = useSelector((state) => state.columns.value);
  const issues = useSelector((state) => state.issues.value);
  const users = useSelector((state) => state.users.value);

  const getColId = (colName) => {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].name === colName) {
        return columns[i].id;
      }
    }
  };

  const [toDevelopIssues, setToDevelopIssues] = useState([]);
  const [inDevelopmentIssues, setInDevelopmentIssues] = useState([]);
  const [readyForStagingIssues, setReadyForStagingIssues] = useState([]);
  const [onStagingIssues, setOnStagingIssues] = useState([]);
  const [readyForProductionIssues, setReadyForProductionIssues] = useState([]);
  const [onProductionIssues, setOnProductionIssues] = useState([]);
  const [draggingIssue, setDraggingIssue] = useState(false);
  const [issueHasBeenDragged, setIssueHasBeenDragged] = useState(false);

  const [mobileColumn, setMobileColumn] = useState("To Develop");

  const colNameData = {
    "To Develop": {
      issues: toDevelopIssues,
      setIssues: setToDevelopIssues,
      colId: getColId("To Develop"),
    },
    "In Development": {
      issues: inDevelopmentIssues,
      setIssues: setInDevelopmentIssues,
      colId: getColId("In Development"),
    },
    "Ready for Staging": {
      issues: readyForStagingIssues,
      setIssues: setReadyForStagingIssues,
      colId: getColId("Ready for Staging"),
    },
    "On Staging": {
      issues: onStagingIssues,
      setIssues: setOnStagingIssues,
      colId: getColId("On Staging"),
    },
    "Ready for Production": {
      issues: readyForProductionIssues,
      setIssues: setReadyForProductionIssues,
      colId: getColId("Ready for Production"),
    },
    "On Production": {
      issues: onProductionIssues,
      setIssues: setOnProductionIssues,
      colId: getColId("On Production"),
    },
  };

  const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
      ref.current = value;
    });

    return ref.current;
  };
  const toDevelopPreviousIssues = usePrevious(toDevelopIssues);
  const inDevelopmentPreviousIssues = usePrevious(inDevelopmentIssues);
  const readyForStagingPreviousIssues = usePrevious(readyForStagingIssues);
  const onStagingPreviousIssues = usePrevious(onStagingIssues);
  const readyForProductionPreviousIssues = usePrevious(
    readyForProductionIssues
  );
  const onProductionPreviousIssues = usePrevious(onProductionIssues);

  const getColIssuesChangedStatus = (colIssues, colPreviousIssues) => {
    if (colIssues.length !== colPreviousIssues.length) {
      return true;
    }

    for (let i = 0; i < colIssues.length; i++) {
      if (colIssues[i].id !== colPreviousIssues[i].id) {
        return true;
      }
    }

    return false;
  };

  const handleColIssueChange = (colIssues, colPreviousIssues, colId) => {
    if (!draggingIssue) {
      /**
       * issue has been dropped somewhere
       */
      if (
        issueHasBeenDragged &&
        colPreviousIssues &&
        colIssues.length >= colPreviousIssues.length
      ) {
        /**
         * make sure something was actually changed in the column before sending reqs
         */
        const colIssuesChanged = getColIssuesChangedStatus(
          colIssues,
          colPreviousIssues
        );

        if (!colIssuesChanged) return;
        /**
         * end
         */
        // only if issue added, need to send issues (send in new order, and also will need to set new "column" reference on the one added)
        colIssues.forEach((issue, issueI) => {
          const issueId = issue.id;

          issue = _.pick(issue, [
            "assigned_to",
            "column",
            "description",
            "order",
            "summary",
            "type",
          ]);

          issue.assigned_to = doc(db, "users", issue.assigned_to);
          issue.column = doc(db, "columns", colId);

          issue.order = issueI;

          setDoc(doc(db, "issues", issueId), issue);
        });
      }
    }
  };

  useEffect(() => {
    handleColIssueChange(
      toDevelopIssues,
      toDevelopPreviousIssues,
      colNameData["To Develop"].colId
    );
  }, [toDevelopIssues]);
  useEffect(() => {
    handleColIssueChange(
      inDevelopmentIssues,
      inDevelopmentPreviousIssues,
      colNameData["In Development"].colId
    );
  }, [inDevelopmentIssues]);
  useEffect(() => {
    handleColIssueChange(
      readyForStagingIssues,
      readyForStagingPreviousIssues,
      colNameData["Ready for Staging"].colId
    );
  }, [readyForStagingIssues]);
  useEffect(() => {
    handleColIssueChange(
      onStagingIssues,
      onStagingPreviousIssues,
      colNameData["On Staging"].colId
    );
  }, [onStagingIssues]);
  useEffect(() => {
    handleColIssueChange(
      readyForProductionIssues,
      readyForProductionPreviousIssues,
      colNameData["Ready for Production"].colId
    );
  }, [readyForProductionIssues]);
  useEffect(() => {
    handleColIssueChange(
      onProductionIssues,
      onProductionPreviousIssues,
      colNameData["On Production"].colId
    );
  }, [onProductionIssues]);

  useEffect(() => {
    columns.forEach((column) => {
      const columnIssues = [];

      issues.forEach((issue) => {
        if (issue.column === column.id) {
          columnIssues.push(cloneDeep(issue));
        }
      });

      /**
       * sorts column issues by order and sets them
       */
      colNameData[column.name].setIssues(
        columnIssues.sort((issue1, issue2) => {
          if (issue1.order < issue2.order) {
            return -1;
          }
          if (issue1.order > issue2.order) {
            return 1;
          }
          return 0;
        })
      );
      /**
       * end
       */
    });
  }, [columns, issues]);

  const getIssueAssignedTo = (userId) => {
    let issueUser;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        issueUser = users[i];
        break;
      }
    }

    return issueUser
      ? {
          name: `${issueUser.first_name} ${issueUser.last_name}`,
          initials: getUserInitials(issueUser),
        }
      : {};
  };

  const issueTypeIcon = (issueType) => {
    if (issueType === "task") {
      return (
        <FontAwesomeIcon
          icon="fa-thumbtack"
          className="text-success"
          title="Task"
        />
      );
    } else if (issueType === "bug_fix") {
      return (
        <FontAwesomeIcon
          icon="fa-bug"
          style={{ color: "#0b5ed7" }}
          title="Bug Fix"
        />
      );
    } else if (issueType === "hotfix") {
      return (
        <FontAwesomeIcon
          icon="fa-fire-flame-curved"
          className="text-danger"
          title="Hotfix"
        />
      );
    }
  };

  const createIssueBtn = (columnId) => {
    const modalData = columnId ? { columnId } : {};

    return (
      <button
        onClick={() => dispatch(setIssueModalData(modalData))}
        className="column__create-issue-btn btn btn-sm btn-primary w-100"
      >
        <FontAwesomeIcon icon="plus" className="me-1" />
        Create Issue
      </button>
    );
  };

  const getColumnIssueHtml = (issue, isMobile) => {
    const assignedTo = getIssueAssignedTo(issue.assigned_to);
    const assignedToInitials = assignedTo.initials;

    const issueClasses = ["issue", "p-1"];
    if (isMobile) {
      issueClasses.push("mt-2");
      issueClasses.push("is-mobile");
    } else {
      issueClasses.push("mt-0");
      issueClasses.push("mx-2");
      issueClasses.push("mb-2");
    }

    return (
      <div className={issueClasses.join(" ")} key={issue.id}>
        <div className="d-flex justify-content-between">
          <div className="ps-1">{issue.summary}</div>
          <div>
            <div className="d-flex issue__icons-container">
              <div
                role="button"
                onClick={() =>
                  dispatch(setIssueModalData({ idEditing: issue.id, issue }))
                }
                className="issue__icon-container edit-issue ml-auto"
              >
                <FontAwesomeIcon
                  icon="pen-to-square"
                  className="issue__edit-icon"
                />
              </div>
              <div className="issue__icon-container">
                {issueTypeIcon(issue.type)}
              </div>
            </div>
            <div
              className="d-flex justify-content-end"
              style={{ marginRight: "2px", marginBottom: "2px" }}
            >
              <div
                className="mt-3 user-icon__container"
                title={assignedTo.name || "Issue is unassigned"}
              >
                {assignedToInitials || <FontAwesomeIcon icon="question" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columnsList = columns.map((column, columnI) => {
    let columnClasses = ["column"];

    if (columnI === 0) {
      columnClasses.push("me-1");
    } else if (columnI === columns.length - 1) {
      columnClasses.push("ms-1");
    } else {
      columnClasses.push("mx-1");
    }

    const columnIssues = cloneDeep(colNameData[column.name].issues);
    const setColumnIssues = colNameData[column.name].setIssues;

    return (
      <div className={columnClasses.join(" ")} key={column.id}>
        <div>
          <h5 className="mb-0 mt-1 px-2">{column.name}</h5>
          <div className="p-2">{createIssueBtn(column.id)}</div>
        </div>
        <div className="column__content pt-2">
          <ReactSortable
            group="shared"
            list={columnIssues}
            setList={setColumnIssues}
            onChoose={() => {
              if (!issueHasBeenDragged) {
                setIssueHasBeenDragged(true);
              }

              setDraggingIssue(true);
            }}
            onUnchoose={() => setDraggingIssue(false)}
            className="h-100"
          >
            {columnIssues.map((issue) => getColumnIssueHtml(issue))}
          </ReactSortable>
        </div>
      </div>
    );
  });

  const mobileColumnIssues = colNameData[mobileColumn].issues.map((issue) =>
    getColumnIssueHtml(issue, true)
  );

  return (
    <>
      <div className="d-none d-sm-block columns p-2">
        <div className="d-flex flex-row h-100" style={{ maxHeight: "100%" }}>
          {columnsList}
        </div>
      </div>
      <div
        className="d-sm-none columns-mobile p-2"
        style={{ backgroundColor: "#f4f5f7" }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <h5 className="mb-0">{mobileColumn}</h5>
          </div>
          <div>
            <div className="dropdown">
              <button
                className="btn btn-secondary btn-sm dropdown-toggle columns-mobile__dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Column
              </button>
              <ul className="dropdown-menu">
                {Object.keys(colNameData).map((colName) => {
                  return (
                    <li key={colName}>
                      <div
                        onClick={() => setMobileColumn(colName)}
                        role="button"
                        className="dropdown-item"
                      >
                        {colName}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        {createIssueBtn(colNameData[mobileColumn].colId)}
        {mobileColumnIssues}
      </div>
    </>
  );
};

export default Columns;
