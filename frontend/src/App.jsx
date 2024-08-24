import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Public from "./components/Public.jsx";
import Login from "./pages/auth/Login.jsx";
import DashLayout from "./components/DashLayout.jsx";
import Welcome from "./pages/auth/Welcome.jsx";
import NotesList from "./pages/notes/NotesList.jsx";
import UsersList from "./pages/users/UsersList.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
