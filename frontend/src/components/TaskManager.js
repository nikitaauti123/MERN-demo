import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { NavLink } from "react-router-dom";

const TaskManager = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const initialState = {
    title: "",
    description: "",
    priority: "Low",
    due_date: "",
    status: "Pending", 
  };

  const [data, setData] = useState(initialState);

  useEffect(() => {
    
    $.validator.addMethod("minDate", function (value, element) {
      return this.optional(element) || new Date(value) > new Date();
    }, "Due date must be in the future");
  
    // Initialize form validation
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!$("#taskForm").valid()) {
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Send JWT token
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Task added successfully!", { autoClose: 1000 });
        setTimeout(() => navigate("/tasklist"), 1500);
      } else {
        toast.error("Failed to add task!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <>
      <div className="flex items-center">
        <ToastContainer autoClose={2000} />
        <NavLink to="/tasklist">
            <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
              Task List
            </button>
          </NavLink>   <h2 className="text-2xl font-bold mx-2 my-8 px-4">Add Task</h2>
      </div>

      {loader ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-8 h-8"></div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="taskForm">
            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">Task Title <span className="text-red-600">*</span></label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded-lg w-full p-2"
                
              />
            </div>

            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            <div className="my-4">
              <label className="block mb-2 text-sm font-medium">Priority </label>
              <select
                name="priority"
                value={data.priority}
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
              <label className="block mb-2 text-sm font-medium">Due Date </label>
              <input
                name="due_date"
                value={data.due_date}
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
              ADD TASK
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default TaskManager;
