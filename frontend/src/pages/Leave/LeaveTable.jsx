import "./LeaveTable.css";

function LeaveTable({
  leaveList,
  employees,
  handleEditLeave,
  updateStatus

}) {
  return (
    <div className="leave-table-container">
      <table className="leave-table">

        <thead>
          <tr>
            <th>Leave ID</th>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaveList.map((item) => (
            <tr key={item.leaveId}>

              <td>{item.leaveId}</td>

              <td>
                {
                  employees.find(
                    (emp) => emp.employeeId === item.employeeId
                  )?.employeeName || "N/A"
                }
              </td>

              <td>{item.leaveType}</td>

              <td>{item.fromDate}</td>

              <td>{item.toDate}</td>

              <td>{item.reason}</td>

              <td>
              <span className={`status ${item.status.toLowerCase()}`}>
              {item.status}
              </span>
              </td>

                          <td>
                          <button
                          className="edit-btn"
                          onClick={() => handleEditLeave(item)}
                          >
                          Edit
                          </button>

                          {item.status === "Pending" && (
                          <>
                          <button
                          className="approve-btn"
                          onClick={() => updateStatus(item.leaveId, "Approved")}
                          >
                          Approve
                          </button>

                          <button
                          className="reject-btn"
                          onClick={() => updateStatus(item.leaveId, "Rejected")}
                          >
                          Reject
                          </button>
                          </>
                          )}
                          </td>      
               </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default LeaveTable;