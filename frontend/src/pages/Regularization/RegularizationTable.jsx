import "./RegularizationTable.css";

function RegularizationTable({
  regularizationList,
  employees,
  updateStatus,
}) {
  return (
    <div className="regularization-table-container">
      <table className="regularization-table">
        <thead>
          <tr>
            <th>Regularization ID</th>
            <th>Employee</th>
            <th>Attendance Date</th>
            <th>Requested Check In</th>
            <th>Requested Check Out</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {regularizationList.map((item) => (
            <tr key={item.regularizationId}>
              <td>{item.regularizationId}</td>

              <td>
                {employees.find(
                  (emp) => emp.employeeId === item.employeeId
                )?.employeeName || "N/A"}
              </td>

              <td>
                {new Date(item.attendanceDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td>{item.requestedCheckIn}</td>

              <td>{item.requestedCheckOut}</td>

              <td>{item.reason}</td>

              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>

                        <td>
  {item.status === "Pending" && (
                  <>
                  <button
                  className="approve-btn"
                  onClick={() =>
                  updateStatus(item.regularizationId, "Approved")
                  }
                  >
                  Approve
                  </button>

                  <button
                  className="reject-btn"
                  onClick={() =>
                  updateStatus(item.regularizationId, "Rejected")
                  }
                  >
                  Reject
                  </button>
                  </>
                  )}

                  {item.status === "Approved" && (
                  <span className="approved-badge">Approved</span>
                  )}

                  {item.status === "Rejected" && (
                  <span className="rejected-badge">Rejected</span>
                  )}
                  </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegularizationTable;