import "./Leave.css";
import axios from "axios";
import { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveTable from "./LeaveTable";

function Leave() {
  const [leaveList, setLeaveList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  
  useEffect(() => {
    getLeaves();
    getEmployees();
  }, []);

  const getLeaves = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7206/api/Leave"
      );

      setLeaveList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7002/api/Employee"
      );

      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditLeave = (leave) => {
  setEditLeave(leave);
  setShowForm(true);
  };  

  const updateStatus = async (id, status) => {
  try {
          await axios.put(
          `https://localhost:7206/api/Leave/${id}/status`,
          {
          status: status,
          }
          );


    getLeaves();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <div className="leave-header">
        <h2>Leave Management</h2>
      </div>

        <button
        className="add-leave-btn"
        onClick={() => {
        if (showForm) {
        setShowForm(false);
        setEditLeave(null);
        } else {
        setEditLeave(null);
        setShowForm(true);
        }
        }}
        >
        {showForm ? "Close Form" : "Apply Leave"}
        </button>

        {showForm && (
        <LeaveForm
        employees={employees}
        getLeaves={getLeaves}
        editLeave={editLeave}
        setShowForm={setShowForm}
        />
        )}

        <LeaveTable
        leaveList={leaveList}
        employees={employees}
        handleEditLeave={handleEditLeave}
        updateStatus={updateStatus}
        />
    </>
  );
}

export default Leave;