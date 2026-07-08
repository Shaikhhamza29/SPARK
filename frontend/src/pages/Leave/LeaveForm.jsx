import "./LeaveForm.css";
import axios from "axios";
import {useEffect, useState } from "react";

function LeaveForm({
  employees,
  getLeaves,
  editLeave,
  setShowForm,
}) {
  const [leaveData, setLeaveData] = useState({
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "Pending",
  });
  
useEffect(() => {
  if (editLeave) {
    setLeaveData({
      employeeId: editLeave.employeeId,
      leaveType: editLeave.leaveType,
      fromDate: editLeave.fromDate?.split("T")[0],
      toDate: editLeave.toDate?.split("T")[0],
      reason: editLeave.reason,
      status: editLeave.status,
    });
  } else {
    setLeaveData({
      employeeId: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      status: "Pending",
    });
  }
}, [editLeave]);


  const handleChange = (e) => {
    setLeaveData({
      ...leaveData,
      [e.target.name]: e.target.value,
    });
  };
  
const saveLeave = async (e) => {
e.preventDefault();

try {
  if (editLeave) {

    await axios.put(
      `https://localhost:7206/api/Leave/${editLeave.leaveId}`,
      leaveData
    );

    alert("Leave Updated Successfully");

  } else {

    await axios.post(
      "https://localhost:7206/api/Leave",
      leaveData
    );

    alert("Leave Request Submitted");
  }

  setLeaveData({
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "Pending",
  });

  getLeaves();
  setShowForm(false);

} catch (error) {
  console.log(error);
}
};

  return (
    <div className="leave-form-container">
      <form onSubmit={saveLeave} className="leave-form">

        <select
          name="employeeId"
          value={leaveData.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>

          {employees.map((emp) => (
            <option
              key={emp.employeeId}
              value={emp.employeeId}
            >
              {emp.employeeName}
            </option>
          ))}
        </select>

        <select
          name="leaveType"
          value={leaveData.leaveType}
          onChange={handleChange}
          required
        >
          <option value="">Select Leave Type</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Earned Leave">Earned Leave</option>
        </select>

        <input
          type="date"
          name="fromDate"
          value={leaveData.fromDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="toDate"
          value={leaveData.toDate}
          onChange={handleChange}
          required
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={leaveData.reason}
          onChange={handleChange}
          required
        />

          <button type="submit">
          {editLeave ? "Update Leave" : "Apply Leave"}
          </button>

      </form>
    </div>
  );
}

export default LeaveForm;