import * as bootstrap from "bootstrap";

export const getUserInitials = (user) => {
  return `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`;
};

export const showToast = (toastId) => {
  const toast = bootstrap.Toast.getInstance(
    document.querySelector(`#${toastId}`)
  );

  toast.show();
};

export const generateFirestoreId = () => {
  /**
   * generates an id identical to ones used by default in firestore
   */
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
};