import "./EmployeeRegularization.css";
import EmployeeRegularizationForm from "./EmployeeRegularizationForm";

function EmployeeRegularization() {
  return (
    <>
        <div className="regularization-page">
        <h2>Request Attendance Regularization</h2>

        <EmployeeRegularizationForm />
        </div>
    </>
  );
}

export default EmployeeRegularization;