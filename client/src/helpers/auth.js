import { isExpired } from "react-jwt";

export default function checkAuth() {
  if (localStorage.getItem("token")) {
    if (isExpired(localStorage.getItem("token"))) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}
