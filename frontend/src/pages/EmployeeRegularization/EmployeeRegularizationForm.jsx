import { useState } from "react";
import axios from "axios";

function EmployeeRegularizationForm() {
  const [attendanceDate, setAttendanceDate] = useState("");
  const [requestedCheckIn, setRequestedCheckIn] = useState("");
  const [requestedCheckOut, setRequestedCheckOut] = useState("");
  const [reason, setReason] = useState("");

  const submitRequest = async () => {
    try {
      await axios.post("https://localhost:7289/api/Regularization", {
        attendanceId: 1,
        employeeId: 20,
        attendanceDate,
        requestedCheckIn,
        requestedCheckOut,
        reason,
        status: "Pending",
      });

      alert("Regularization Request Submitted");

      setAttendanceDate("");
      setRequestedCheckIn("");
      setRequestedCheckOut("");
      setReason("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="attendance-form">

      <input
        type="date"
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
      />

      <input
        type="time"
        value={requestedCheckIn}
        onChange={(e) => setRequestedCheckIn(e.target.value)}
      />

      <input
        type="time"
        value={requestedCheckOut}
        onChange={(e) => setRequestedCheckOut(e.target.value)}
      />

      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={submitRequest}>
        Submit Request
      </button>

    </div>
  );
}

export default EmployeeRegularizationForm;