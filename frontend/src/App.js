import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import TaskList from "./components/TaskList";
import EditTask from "./components/EditTask";
import Login from "./components/Login";

import AuthProvider from "./context/AuthContext";


function App() {
  // const [sidebar,setsidebar] = useState(true);
  // const toggleSideBar = () => {
  //   setSideBar(!sideBar);
  // };
  const router  = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/addtask",
      element: (
        <div>
          <TaskManager />
        </div>
      ),
    },
    {
      path: "/tasklist",
      element: (
        <div>
          <TaskList />
        </div>
      ),
    },
    {
      path: "/edittask/:id",
      element: (
        <div>
          <EditTask />
        </div>
      ),
    },
    
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;