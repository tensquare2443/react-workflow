import { useEffect } from "react";
import * as bootstrap from "bootstrap";

export function Toasts() {
  useEffect(() => {
    const toastElList = document.querySelectorAll(".toast");
    
    [...toastElList].map((toastEl) => new bootstrap.Toast(toastEl, {}));
  }, []);

  return (
    <>
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
    </>
  );
}
