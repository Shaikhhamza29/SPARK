import AttendanceForm from "./AttendanceForm";
import "./Attendance.css";
import axios from "axios";
import { useEffect, useState } from "react";
import AttendanceTable from "./AttendanceTable";

function Attendance() {

  const [attendanceList, setAttendanceList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editAttendance, setEditAttendance] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
  getAttendance();
  getEmployees();

  }, []);
  
   const handleEditAttendance = (attendance) => {
  setEditAttendance(attendance);
  setShowForm(true);
  };

  const getAttendance = async () => {
    try {
      const response = await axios.get("https://localhost:7289/api/Attendance");
     console.log("Response:", response.data);

      setAttendanceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployees = async () => {
  try {
    const response = await axios.get("https://localhost:7002/api/Employee");
    setEmployees(response.data);
  } catch (error) {
    console.log(error);
  }
};
  

  return (
    <>
      
  <div className="attendance-header">
    <h2>Attendance Management</h2>

    <button
      className="add-btn"
      onClick={() => setShowForm(!showForm)}
    >
      {showForm ? "Close Form" : "Add Attendance"}
    </button>
  </div>

  {showForm && (
  <AttendanceForm
  getAttendance={getAttendance}
  setShowForm={setShowForm}
  editAttendance={editAttendance}
    setEditAttendance={setEditAttendance}
/>
)}

  <AttendanceTable
  attendanceList={attendanceList}
  employees={employees}
  editAttendance={handleEditAttendance}
/>
    </>
  );
}


export default Attendance;