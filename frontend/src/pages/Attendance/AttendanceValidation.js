export function validateAttendance(
  employeeId,
  attendanceDate,
  checkIn,
  checkOut,
  status
) {
  if (!employeeId) {
    alert("Please select an employee.");
    return false;
  }

  if (!attendanceDate) {
    alert("Please select attendance date.");
    return false;
  }
  const today = new Date().toISOString().split("T")[0];

if (attendanceDate > today) {
  alert("Future attendance is not allowed.");
  return false;
}

  if (!checkIn) {
    alert("Please enter check in time.");
    return false;
  }

  if (!checkOut) {
    alert("Please enter check out time.");
    return false;
  }

if (checkOut <= checkIn) {
    alert("Check Out time must be greater than Check In time.");
    return false;
}

  if (!status) {
    alert("Please select status.");
    return false;
  }

  return true;
}