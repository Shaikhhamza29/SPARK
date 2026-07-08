import "./AttendanceTable.css";

function AttendanceTable({
  attendanceList,
  employees,
  editAttendance
}) {
  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
  <tr>
    <th>Attendance ID</th>
    <th>Employee</th>
    <th>Attendance Date</th>
    <th>Check In</th>
    <th>Check Out</th>
    <th>Status</th>
    <th>Remarks</th>

    <th>Action</th>
  </tr>
</thead>
        <tbody>
          {attendanceList.map((item) => (
            <tr key={item.attendanceId}>
              <td>{item.attendanceId}</td>
              <td>
           { employees.find(
             (emp) => emp.employeeId === item.employeeId
                 )?.employeeName || "N/A"
            }
           </td>
              <td>{item.attendanceDate}</td>
              <td>{item.checkIn}</td>
              <td>{item.checkOut}</td> 
              <td>{item.status}</td>
              <td>{item.remarks || "-"}</td>

<td>
  <button
    className="edit-btn"
    onClick={() => editAttendance(item)}
  >
    Edit
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;