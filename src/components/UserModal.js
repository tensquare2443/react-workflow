import * as bootstrap from "bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserModalData } from "store/modals/userModalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore/lite";
import firebase from "../firebase";
import { useForm } from "react-hook-form";
import { generateFirestoreId, showToast } from "global";
import { fetchUsers } from "store/usersSlice";
import cloneDeep from "clone-deep";
import { fetchIssues } from "store/issuesSlice";

const UserModal = function () {
  const db = getFirestore(firebase);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.value);
  const issues = useSelector((state) => state.issues.value);
  const userModal = useSelector((state) => state.userModal.value);
  const userEditing = useSelector(() => userModal.user || null);
  const idEditing = useSelector(() =>
    userModal.user ? userModal.user.id : null
  );
  const adminUserId = "qtGTcbgSoBhbkFh2qndW";
  const isAdminUser = useSelector(() => {
    if (userEditing) {
      return userEditing.id === adminUserId;
    } else return false;
  });

  useEffect(() => {
    const userBsModal = new bootstrap.Modal("#userModal", {});

    userBsModal.show();

    const userBsModalElement = document.getElementById("userModal");

    userBsModalElement.addEventListener("hidden.bs.modal", (event) => {
      dispatch(setUserModalData(false));
    });

    if (idEditing) {
      ["first_name", "last_name", "email"].forEach((field) => {
        setValue(field, userEditing[field]);
      });
    }
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const submitUserForm = async (data) => {
    const docId = idEditing || generateFirestoreId();

    await setDoc(doc(db, "users", docId), data);

    dispatch(fetchUsers());
    showToast("userCreateUpdateToast");
    hideModal();
  };

  const deleteUser = async () => {
    const issueEditRequests = [];
    issues.forEach((issue) => {
      if (issue.assigned_to === idEditing) {
        const issueEditing = cloneDeep(issue);
        const issueEditingId = issueEditing.id;

        delete issueEditing.assigned_to;
        delete issueEditing.id;

        issueEditing.column = doc(db, "columns", issueEditing.column);

        issueEditRequests.push(
          setDoc(doc(db, "issues", issueEditingId), issueEditing)
        );
      }
    });

    Promise.all(issueEditRequests).then((responses) => {
      dispatch(fetchIssues());
    });

    await deleteDoc(doc(db, "users", idEditing));

    dispatch(fetchUsers());
    showToast("userDeleteToast");
    hideModal();
  };

  const hideModal = () => {
    /**
     * selects existing user modal and hides it
     */
    const existingUserModal = bootstrap.Modal.getInstance(
      document.getElementById("userModal")
    );
    existingUserModal.hide();
    /**
     * end
     */
  };

  return (
    <div className="modal fade" id="userModal" tabIndex="-1">
      <div className="modal-dialog">
        <form onSubmit={handleSubmit(submitUserForm)} className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="userModalLabel">
              {idEditing
                ? `${isAdminUser ? "View " : "View/Edit "}`
                : "Create "}
              a User
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body" id="userModalBody">
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name<span className="text-danger">&nbsp;*</span>
              </label>
              <input
                {...register("first_name", {
                  required: true,
                  maxLength: 200,
                })}
                aria-invalid={errors.first_name ? "true" : "false"}
                className={`form-control ${
                  errors.first_name ? "is-invalid" : null
                }`}
                type="text"
                name="first_name"
                disabled={isAdminUser}
              />
              {errors.first_name?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  First name is required
                </p>
              )}
              {errors.first_name?.type === "maxLength" && (
                <p className="invalid-feedback" role="alert">
                  First name must be 200 or fewer characters
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name<span className="text-danger">&nbsp;*</span>
              </label>
              <input
                {...register("last_name", {
                  required: true,
                  maxLength: 200,
                })}
                aria-invalid={errors.last_name ? "true" : "false"}
                className={`form-control ${
                  errors.last_name ? "is-invalid" : null
                }`}
                type="text"
                name="last_name"
                disabled={isAdminUser}
              />
              {errors.last_name?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  Last name is required
                </p>
              )}
              {errors.last_name?.type === "maxLength" && (
                <p className="invalid-feedback" role="alert">
                  Last name must be 200 or fewer characters
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address<span className="text-danger">&nbsp;*</span>
              </label>
              <input
                {...register("email", {
                  required: true,
                  maxLength: 200,
                })}
                aria-invalid={errors.email ? "true" : "false"}
                className={`form-control ${errors.email ? "is-invalid" : null}`}
                type="email"
                name="email"
                disabled={isAdminUser}
              />
              {errors.email?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  Email address is required
                </p>
              )}
              {errors.email?.type === "maxLength" && (
                <p className="invalid-feedback" role="alert">
                  Email address must be 200 or fewer characters
                </p>
              )}
            </div>
            {/* <div className="mb-2">
              <label
                htmlFor="order"
                className="form-label d-flex align-items-center"
              >
                <div>
                  Order<span className="text-danger">&nbsp;*</span>
                </div>
                <div>
                  <button
                    id="orderInputPopover"
                    type="button"
                    className="btn btn-sm btn-primary order-input-popover d-flex align-items-center justify-content-center ms-1"
                    data-bs-toggle="popover"
                    data-bs-content="'Order' determines the order in which the users appear in the list at the top of this page."
                    data-bs-trigger="focus"
                  >
                    <FontAwesomeIcon icon="question" />
                  </button>
                </div>
              </label>
              <input
                {...register("order", { min: 2, max: 100, required: true })}
                aria-invalid={errors.order ? "true" : "false"}
                className={`form-control ${errors.order ? "is-invalid" : null}`}
                style={{ width: "initial" }}
                type="number"
                name="order"
                disabled={isAdminUser}
              />
              {errors.order?.type === "required" && (
                <p className="invalid-feedback" role="alert">
                  Order is required
                </p>
              )}
              {(errors.order?.type === "min" ||
                errors.order?.type === "max") && (
                <p className="invalid-feedback" role="alert">
                  Order must be a number between 2 and 100
                </p>
              )}
            </div> */}
            {isAdminUser ? (
              <p className="small mb-0 text-secondary">
                <em>Note: Admin User cannot be edited</em>
              </p>
            ) : null}
          </div>
          {!isAdminUser ? (
            <div
              className="modal-footer"
              style={{ justifyContent: "space-between" }}
            >
              <div
                className={`d-flex flex-column flex-md-row${
                  idEditing
                    ? " justify-content-between"
                    : " justify-content-end"
                } w-100`}
              >
                {idEditing ? (
                  <div className="mb-2 mb-md-0">
                    <button
                      onClick={deleteUser}
                      type="button"
                      className="btn btn-danger w-100"
                    >
                      Delete User
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
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default UserModal;
