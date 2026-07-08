import { useEffect, useState } from "react";
import "./AttendanceForm.css";
import axios from "axios";
import { validateAttendance } from "./AttendanceValidation";

function AttendanceForm({getAttendance,setShowForm, editAttendance, setEditAttendance}) {
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("Present");
  const [remarks, setRemarks] = useState("");
  const [employees, setEmployees] = useState([]);

useEffect(() => {
  getEmployees();
}, []);

const getEmployees = async () => {
  try {
    const response = await axios.get(
      "https://localhost:7002/api/Employee"
    );

    setEmployees(response.data);
  } 
  catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  if (editAttendance) {
    setEmployeeId(editAttendance.employeeId);
    setAttendanceDate(
      editAttendance.attendanceDate?.split("T")[0] || ""
    );
    setCheckIn(editAttendance.checkIn);
    setCheckOut(editAttendance.checkOut);
    setStatus(editAttendance.status);
    setRemarks(editAttendance.remarks || "");
  }
}, [editAttendance]);


const saveAttendance = async () => {

const isValid = validateAttendance(
  employeeId,
  attendanceDate,
  checkIn,
  checkOut,
  status
);

if (!isValid) return;   
    
const attendanceData = {
    attendanceId: editAttendance?.attendanceId || 0,
    employeeId,
    attendanceDate,
    checkIn,
    checkOut,
    status,
    remarks,
};
  try {
    if (editAttendance) {
  await axios.put(
    `https://localhost:7289/api/Attendance/${editAttendance.attendanceId}`,
    attendanceData
  );

  alert("Attendance updated successfully!");
} else {
  await axios.post(
    "https://localhost:7289/api/Attendance",
    attendanceData
  );
    alert("Attendance added successfully!");
}
   // Refresh the table
if (getAttendance) {
  await getAttendance();
}

// Close the form
setShowForm(false);
setEditAttendance(null);

// Clear the form
setEmployeeId("");
setAttendanceDate("");
setCheckIn("");
setCheckOut("");
setStatus("Present");
setRemarks("");
  } 
  
  
  catch (error) {
  console.log(error);

  if (error.response) {
    alert(error.response.data);
  } else {
    alert("Failed to save attendance.");
  }
}
};

  return (
    <div className="attendance-form">
      <h2>Attendance Form</h2>

      <label>Employee</label>
     <select
  value={employeeId}
  onChange={(e) => setEmployeeId(e.target.value)}
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

      <label>Attendance Date</label>
      <input
        type="date"
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
      />

      <label>Check In</label>
      <input
        type="time"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <label>Check Out</label>
      <input
        type="time"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <label>Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Present</option>
        <option>Absent</option>
        <option>Half Day</option>
        <option>Leave</option>
        <option>Work From Home</option>
        <option>Holiday</option>
      </select>

      <label>Remarks</label>
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      ></textarea>

      <button onClick={saveAttendance}>
  {editAttendance ? "Update Attendance" : "Save Attendance"}
</button>
    </div>
  );
}

export default AttendanceForm;