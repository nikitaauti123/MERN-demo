import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import "jquery-validation";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

const EditTask = () => {
  const [loader, setLoader] = useState(false);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    title: "",
    description: "",
    priority: "",
    due_date: "",
    status: "",
  };
  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    fetchOldData();
    setupValidation();
  }, []);

  const fetchOldData = async () => {
    const token = Cookies.get("jwt");   
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/task/${id}`,
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
        setOldData({
          ...oldData,
          title: response.result.title,
          description: response.result.description,
          priority: response.result.priority,
          due_date: response.result.due_date 
          ? new Date(response.result.due_date).toISOString().split("T")[0] 
          : "",  // ✅ Ensure correct format for input type="date"
          status: response.result.status,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setupValidation = () => {
    $("#taskForm").validate({
      rules: {
        title: {
          required: true,
        },
        due_date: {
             minDate: true, 
        },
      },
      messages: {
        title: {
          required: "Please enter task title",
        },
        due_date: {
           minDate: "Due date must be in the future",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Custom validation for date
    $.validator.addMethod(
      "minDate",
      function (value, element) {
        return this.optional(element) || new Date(value) > new Date();
      },
      "Due date must be in the future"
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({ ...oldData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!$("#taskForm").valid()) {
      return;
    }
    const token = Cookies.get("jwt");   

    try {
      setLoader(true);
      const updatedata = { id, ...oldData };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/task/${id}`,
        {
          method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token
                "Content-Type": "application/json",
              },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Task is updated Successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/tasklist");
        }, 1500);
      } else {
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <ToastContainer autoClose={2000} />
        <NavLink to="/tasklist">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Task List
          </button>
        </NavLink>
        <h2 className="text-2xl font-bold mx-2 my-8 px-4">Edit Task</h2>
      </div>

      {loader ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-8 h-8"></div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="taskForm">
            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">
                Task Title <span className="text-red-600">*</span>
              </label>
              <input
                name="title"
                value={oldData.title}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={oldData.description}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">
                Priority <span className="text-red-600">*</span>
              </label>
              <select
                name="priority"
                value={oldData.priority}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2"
              >
                {/* <option value="">Select Priority</option> */}
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">
                Due Date <span className="text-red-600">*</span>
              </label>
              <input
                name="due_date"
                value={oldData.due_date}
                onChange={handleChange}
                type="date"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
            >
              Update TASK
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditTask;
