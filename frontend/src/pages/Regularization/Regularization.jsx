import "./Regularization.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RegularizationTable from "./RegularizationTable";

function Regularization() {
  const [regularizationList, setRegularizationList] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    getRegularizations();
    getEmployees();
  }, []);

  const getRegularizations = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7289/api/Regularization"
      );

      console.log(response.data);

      setRegularizationList(response.data);
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

  const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `https://localhost:7289/api/Regularization/${id}`,
      {
        status: status,
      }
    );

    getRegularizations();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <div className="regularization-header">
        <h2>Attendance Regularization</h2>
      </div>

        
      <RegularizationTable
        regularizationList={regularizationList}
        employees={employees}
        updateStatus={updateStatus}

      />
    </>
  );
}

export default Regularization;