import React, { useContext,useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import Cookies from "js-cookie";
import "jquery-validation";
import { NavLink } from "react-router-dom";
import getUserFromToken from "./utils/getUserFromToken";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { ImCross } from "react-icons/im";
import { FcApproval } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";

const TaskList = () => {
    const { setAuth } = useContext(AuthContext);
    const userInfo = getUserFromToken();
    const [search, setSearch] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [task, settask] = useState([]);
    const [count, setCount] = useState(0);
    const [loader, setLoader] = useState(true);
    const [noData, setNoData] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
     const token = Cookies.get("jwt");
      if (!token) {
        navigate("/"); // Redirect to login page if token is not found
      }
    }, [navigate]);
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "search") {
        setPage(1);
        setSearch(value);
      }
    };
  
    useEffect(() => {
      fetchtask();
    }, [page, search]);
  
    const fetchEmployeeName = async (id) => {
      const nameRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getesingleemployee`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const employeeName = await nameRes.json();
      return employeeName.success ? employeeName.data[0].name : "Unknown";
    };
    const fetchtask = async () => {
        
        setLoader(true);
        const token = Cookies.get("jwt");   
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/task?page=${page}&limit=${pageSize}&search=${search}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Include JWT token
                "Content-Type": "application/json",
              },
            }
          );
      
          const response = await res.json();
          if (response.success) {
            setNoData(false);
            if (response.result.length === 0) {
              setNoData(true);
            }
            settask(response.result);
            setCount(response.count);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoader(false);
        }
      };
      
    const startIndex = (page - 1) * pageSize;
    const handleStatusChange = async (id, newStatus) => {
        let status = "Pending"; // changed to let
        if (newStatus === 'Completed' ) {
          status = "Completed";
        }
        const permissionOfDelete = window.confirm(`Are you sure change status of task to ${status} ?`);
        if (permissionOfDelete) {
          let projectOne = task.length === 1;
          if (count === 1) {
            projectOne = false;
          }
          try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatetasktStatus/${id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: newStatus }),
            });
    
            const response = await res.json(); // Awaiting the response to parse it
            if (response.success) {
              toast.success(`Task status ${status} Successfully!`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              if (projectOne) {
                setPage(page - 1);
              } else {
                fetchtask();
              }
            }
          } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
          }
        }
      };
      const handleLogout = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/logout`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json", // Set content type to JSON
              },
              body: JSON.stringify({ id: userInfo.id }), // Include user ID in the request body
            // Send cookies with the request
            }
          );
          const response = await res.json();
          if (response.success) {
            Cookies.remove("jwt");
            toast.success("Logout Successfully", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setAuth({ isAuthenticated: false, user: null });
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

      const handleDelete = async (e, id) => {
        e.preventDefault();
        const permissionOfDelete = window.confirm(
          "Are you sure, you want to delete the task"
        );
        if (permissionOfDelete) {
          let clientOne = task.length === 1;
          if (count === 1) {
            clientOne = false;
          }
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/task/${id}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            }
          );
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          const response = await res.json();
          if (response.success) {
            toast.success("task is deleted Successfully!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            if (clientOne) {
              setPage(page - 1);
            } else {
              fetchtask();
            }
          }
        }
      };
    
  return (
    <>
     <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex items-center">
        
        <div className="text-2xl font-bold mx-2 my-8 px-4">Task List</div>
      </div>
      <div class="flex justify-end">
      <button class="w-1/3 ml-auto"
                  onClick={handleLogout}
                  className="flex items-left text-[16px] px-4 py-2 font-medium text-white bg-gray-800 rounded-full hover:scale-110 transform transition-transform duration-200"
                >
                  Logout
                </button>

</div>
      <div className="w-1/3  ml-5">
                
              </div>
       
      <div className="flex justify-between">
          <NavLink to="/addtask">
            <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
              Add New
            </button>
          </NavLink>
          
        <div className={` flex items-center`}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
      </div>
      {/* {loader && <div className="absolute h-full w-full  flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>} */}

      <div className="relative overflow-x-auto m-5 mb-0">
        {task.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>

                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Task Title
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  description
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Status
                </th>
              
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Edit
                </th>
              
              </tr>
            </thead>

            <tbody>
              {task.map((item, index) => {
                return (
                  <tr key={item._id} className="bg-white border-b ">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {startIndex + index + 1}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.title}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                         {item?.description}
                     
                    </th>
                   
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900  border-2 border-gray-300"
                    >
                         {item?.priority}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                     
                      {new Date(item?.due_date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-")}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.status}
                    </th>
                    
                    <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.status === "Pending" ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, "Completed")}
                      >
                        Pending
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, "Pending")}
                      >
                        Completed
                      </button>
                    )}
                    &ensp;
                                        
                  </td>

                  <td className="px-6 py-4 border-2 border-gray-300 p-4">
                        <NavLink to={`/edittask/${item?._id}`}>
                        <CiEdit className="text-2xl cursor-pointer text-green-900" />
                      </NavLink>
                      <button
                            onClick={(e) => handleDelete(e, item._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <MdDelete className="inline mr-2" />                           </button>
                  </td>            </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {noData && <div className="text-center text-xl">
            Currently! There are no Task in the storage.
          </div>}

      {task.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black ">
            Showing{" "}
            <span className="font-semibold text-black ">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black ">
              {" "}
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black ">{count}</span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
  <button
    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:bg-gray-400"
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1} // Disable when on the first page
  >
    Prev
  </button>
  <button
    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 disabled:bg-gray-400"
    onClick={() => setPage((prev) => (startIndex + pageSize < count ? prev + 1 : prev))}
    disabled={startIndex + pageSize >= count} // Disable when on the last page
  >
    Next
  </button>
</div>

        </div>
      )}
    </div>
    </>
  );
};

export default TaskList;
