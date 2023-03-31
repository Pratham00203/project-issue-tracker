import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import checkAuth from "./helpers/auth";
import UserContext from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import "./assets/styles/App.css";
import { PrivateRoute } from "./components/subcomponents/PrivateRoute";
import { PublicRoute } from "./components/subcomponents/PublicRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import EmailForm from "./components/EmailForm";
import ChangePassword from "./components/ChangePassword";
import ProjectForm from "./components/ProjectForm";
import Organization from "./components/Organization";
import OrganizationForm from "./components/OrganizationForm";
import ProjectDashboard from "./components/ProjectDashboard";
import Project from "./components/Project";
import JoinForm from "./components/JoinForm";
import IssueForm from "./components/IssueForm";
import Issue from "./components/Issue";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState({
    id: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    if (checkAuth()) {
      getUser();
      setIsAuthenticated(true);
    }
  }, []);

  const getUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: "https://trackify-backend.onrender.com/api/auth/",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setUser({
        name: res.data.user.name,
        id: res.data.user._id,
        role: res.data.user.role,
        email: res.data.user.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeUserSettings = (newUserState) => {
    setUser(newUserState);
  };

  return (
    <UserContext.Provider value={{ user, changeUserSettings }}>
      <Routes>
        <Route
          exact
          path='/'
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route
          exact
          path='/projects/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/create'
          element={
            <PrivateRoute>
              <ProjectForm option='Create' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/update'
          element={
            <PrivateRoute>
              <ProjectForm option='Update' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/my-organization'
          element={
            <PrivateRoute>
              <Organization />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/organization/create'
          element={
            <PrivateRoute>
              <OrganizationForm option='Create' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/organization/:organizationid/update'
          element={
            <PrivateRoute>
              <OrganizationForm option='Update' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/dashboard'
          element={
            <PrivateRoute>
              <ProjectDashboard />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/details'
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/create/issue/new'
          element={
            <PrivateRoute>
              <IssueForm option='Create' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/update/issue/:issueid'
          element={
            <PrivateRoute>
              <IssueForm option='Update' />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/project/:projectid/issue/:issueid'
          element={
            <PrivateRoute>
              <Issue />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          exact
          path='/register/:token'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          exact
          path='/verify-email/register'
          element={
            <PublicRoute>
              <EmailForm option={"Register"} />
            </PublicRoute>
          }
        />
        <Route
          exact
          path='/verify-email/change-password'
          element={
            <PublicRoute>
              <EmailForm option={"Change Password"} />
            </PublicRoute>
          }
        />
        <Route
          exact
          path='/change-password/:email/:token'
          element={
            <PublicRoute>
              <ChangePassword />
            </PublicRoute>
          }
        />
        <Route
          exact
          path='/organization/join/:organizationid'
          element={<JoinForm option={"Organization"} />}
        />
        <Route
          exact
          path='/project/join/:projectid'
          element={<JoinForm option={"Project"} />}
        />
        <Route exact path='*' element={<h1>Not Found</h1>} />
      </Routes>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 2000,
        }}
      />
    </UserContext.Provider>
  );
}

export default App;
