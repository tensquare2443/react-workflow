import * as bootstrap from "bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIssueModalData } from "store/modals/issueModalSlice";
import { fetchIssues } from "store/issuesSlice";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore/lite";
import firebase from "../firebase";
import { useForm } from "react-hook-form";
import { generateFirestoreId, showToast } from "global";

const IssueModal = function () {
  const db = getFirestore(firebase);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.value);
  const columns = useSelector((state) => state.columns.value);
  const issues = useSelector((state) => state.issues.value);
  const issueModal = useSelector((state) => state.issueModal.value);
  const idEditing = useSelector((state) => state.issueModal.value.idEditing);

  useEffect(() => {
    const issueBsModal = new bootstrap.Modal("#issueModal", {});

    issueBsModal.show();

    const issueBsModalElement = document.getElementById("issueModal");

    issueBsModalElement.addEventListener("hidden.bs.modal", (event) => {
      dispatch(setIssueModalData(false));
    });

    if (idEditing) {
      let issueEditing;

      for (let i = 0; i < issues.length; i++) {
        if (issues[i].id === idEditing) {
          issueEditing = issues[i];
          break;
        }
      }

      ["type", "summary", "description", "assigned_to", "column"].forEach(
        (field) => {
          if (field === "assigned_to") {
            if (issueEditing[field]) {
              setValue(field, issueEditing[field]);
            }
          } else {
            setValue(field, issueEditing[field]);
          }
        }
      );
    } else if (issueModal.columnId) {
      setValue("column", issueModal.columnId);
    }
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const getIssueOrder = (columnId) => {
    if (idEditing) {
      const issue = issueModal.issue;

      return issue.order;
    } else {
      const columnIssues = issues.filter((issue) => issue.column === columnId);

      return columnIssues.length;
    }
  };

  const submitIssueForm = async (data) => {
    /**
     * changes strings to references
     */
    data.assigned_to = doc(db, "users", data.assigned_to);

    const columnId = data.column || columns[0].id;

    data.column = doc(db, "columns", columnId);
    /**
     * end
     */

    data.order = getIssueOrder(columnId);

    const docId = idEditing || generateFirestoreId();

    await setDoc(doc(db, "issues", docId), data);

    dispatch(fetchIssues());
    showToast("issueCreateUpdateToast");
    hideModal();
  };

  const deleteIssue = async () => {
    await deleteDoc(doc(db, "issues", idEditing));

    dispatch(fetchIssues());
    showToast("issueDeleteToast");
    hideModal();
  };

  const hideModal = () => {
    /**
     * selects existing issue modal and hides it
     */
    const existingIssueModal = bootstrap.Modal.getInstance(
      document.getElementById("issueModal")
    );
    existingIssueModal.hide();
    /**
     * end
     */
  };

  const usersList = users.map((user, userI) => {
    return (
      <option value={user.id} key={userI}>
        {user.first_name}&nbsp;{user.last_name}
      </option>
    );
  });
  const columnsList = columns.map((column, columnI) => {
    return (
      <option value={column.id} key={columnI}>
        {column.name}
      </option>
    );
  });

  return (
    <div className="modal modal-lg fade" id="issueModal" tabIndex="-1">
      <div className="modal-dialog">
        <form
          onSubmit={handleSubmit(submitIssueForm)}
          className="modal-content"
        >
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="issueModalLabel">
              {idEditing ? "View/Edit " : "Create "}an Issue
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body" id="issueModalBody">
            <div className="row">
              <div className="col-12 col-lg-6">
                <div
                  className={`select2-modal__hide-dropdown mb-3 ${
                    errors.type ? "select2__is-invalid" : ""
                  }`}
                >
                  <label htmlFor="issue_type" className="form-label">
                    Type<span className="text-danger">&nbsp;*</span>
                  </label>
                  <select
                    name="type"
                    {...register("type")}
                    className="form-select"
                  >
                    <option value="task">Task</option>
                    <option value="bug_fix">Bug Fix</option>
                    <option value="hotfix">Hotfix</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="summary" className="form-label">
                Summary<span className="text-danger">&nbsp;*</span>
              </label>
              <input
                {...register("summary", { required: true, maxLength: 200 })}
                aria-invalid={errors.summary ? "true" : "false"}
                className={`form-control ${
                  errors.summary ? "is-invalid" : null
                }`}
                type="text"
                name="summary"
              />
              {errors.summary?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  Summary is required
                </p>
              )}
              {errors.summary?.type === "maxLength" && (
                <p className="invalid-feedback" role="alert">
                  Summary must be 200 or fewer characters
                </p>
              )}
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Description<span className="text-danger">&nbsp;*</span>
              </label>
              <textarea
                name="description"
                {...register("description", {
                  required: true,
                  maxLength: 2000,
                })}
                aria-invalid={errors.description ? "true" : "false"}
                className={`form-control ${
                  errors.description ? "is-invalid" : null
                }`}
              />
              {errors.description?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  Description is required
                </p>
              )}
              {errors.description?.type === "maxLength" && (
                <p className="invalid-feedback" role="alert">
                  Description must be 2,000 or fewer characters
                </p>
              )}
            </div>
            <div className="row">
              <div className="col-12 col-lg-6">
                <div className="select2-modal__hide-dropdown mb-3">
                  <label htmlFor="issue_type" className="form-label">
                    Assigned to<span className="text-danger">&nbsp;*</span>
                  </label>

                  <select
                    name="assigned_to"
                    {...register("assigned_to", {
                      required: true,
                    })}
                    aria-invalid={errors.assigned_to ? "true" : "false"}
                    className={`form-select ${
                      errors.assigned_to ? "is-invalid" : null
                    }`}
                  >
                    <option value="">Select user...</option>
                    {usersList}
                  </select>
                  {errors.assigned_to?.type === "required" && (
                    <p className="invalid-feedback" role="alert">
                      Assigned to is required
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-6">
                <div className="select2-modal__hide-dropdown mb-2">
                  <label htmlFor="issue_type" className="form-label">
                    Column<span className="text-danger">&nbsp;*</span>
                  </label>

                  <select
                    name="column"
                    {...register("column", {
                      required: true,
                    })}
                    aria-invalid={errors.column ? "true" : "false"}
                    className={`form-select ${
                      errors.column ? "is-invalid" : null
                    }`}
                  >
                    {columnsList}
                  </select>
                  {errors.column?.type === "required" && (
                    <p className="invalid-feedback" role="alert">
                      Column is required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ justifyContent: "space-between" }}
          >
            <div
              className={`d-flex flex-column flex-md-row${
                idEditing ? " justify-content-between" : " justify-content-end"
              } w-100`}
            >
              {idEditing ? (
                <div className="mb-2 mb-md-0">
                  <button
                    onClick={deleteIssue}
                    type="button"
                    className="btn btn-danger w-100"
                  >
                    Delete Issue
                  </button>
                </div>
              ) : null}

              <div>
                <button
                  type="button"
                  className="modal-footer__btn btn btn-outline-secondary d-block d-md-inline me-md-2 mb-2 mb-md-0"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-footer__btn btn btn-primary"
                >
                  {idEditing ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
