import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CreatePayslipTemplate.css";

const STORAGE_KEY = "spark_payslip_templates";

const createId = () => Date.now() + Math.floor(Math.random() * 1000);

const emptyEarning = () => ({
    id: createId(),
    name: "",
    calculationType: "Percentage",
    value: 0,
    balance: false,
});

const emptyDeduction = () => ({
    id: createId(),
    name: "",
    calculationType: "Percentage",
    value: 0,
});

function CreatePayslipTemplate() {
    const navigate = useNavigate();
    const location = useLocation();

    const editingTemplate = location.state?.template || null;
    const viewOnly = location.state?.mode === "view";

    const [templateName, setTemplateName] = useState("");
    const [description, setDescription] = useState("");
    const [employeeType, setEmployeeType] =
        useState("Regular Employee");

    const [earnings, setEarnings] = useState([
        {
            id: createId(),
            name: "Basic Salary",
            calculationType: "Percentage",
            value: 50,
            balance: false,
        },
        {
            id: createId(),
            name: "House Rent Allowance",
            calculationType: "Percentage",
            value: 20,
            balance: false,
        },
        {
            id: createId(),
            name: "Special Allowance",
            calculationType: "Balance",
            value: 0,
            balance: true,
        },
    ]);

    const [deductions, setDeductions] = useState([]);

    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!editingTemplate) return;

        setTemplateName(editingTemplate.name || "");
        setDescription(editingTemplate.description || "");
        setEmployeeType(
            editingTemplate.employeeType || "Regular Employee"
        );

        setEarnings(
            editingTemplate.earnings?.length
                ? editingTemplate.earnings
                : [emptyEarning()]
        );

        setDeductions(editingTemplate.deductions || []);
    }, [editingTemplate]);

    const updateEarning = (id, field, value) => {
        setEarnings((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                if (field === "calculationType") {
                    return {
                        ...item,
                        calculationType: value,
                        balance: value === "Balance",
                        value: value === "Balance" ? 0 : item.value,
                    };
                }

                return {
                    ...item,
                    [field]: value,
                };
            })
        );
    };

    const removeEarning = (id) => {
        setEarnings((current) =>
            current.filter((item) => item.id !== id)
        );
    };

    const addEarning = () => {
        setEarnings((current) => [...current, emptyEarning()]);
    };

    const updateDeduction = (id, field, value) => {
        setDeductions((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                return {
                    ...item,
                    [field]: value,
                    value:
                        field === "calculationType" &&
                        value === "Balance"
                            ? 0
                            : field === "value"
                            ? Number(value)
                            : item.value,
                };
            })
        );
    };

    const removeDeduction = (id) => {
        setDeductions((current) =>
            current.filter((item) => item.id !== id)
        );
    };

    const addDeduction = () => {
        setDeductions((current) => [
            ...current,
            emptyDeduction(),
        ]);
    };

    const validateTemplate = () => {
        if (!templateName.trim()) {
            setMessage("Please enter a template name.");
            return false;
        }

        if (!description.trim()) {
            setMessage("Please enter a description.");
            return false;
        }

        const invalidEarning = earnings.some(
            (item) =>
                !item.name.trim() ||
                (item.calculationType !== "Balance" &&
                    Number(item.value) < 0)
        );

        if (invalidEarning) {
            setMessage(
                "Please complete all earning components correctly."
            );
            return false;
        }

        const balanceComponents = earnings.filter(
            (item) => item.calculationType === "Balance"
        );

        if (balanceComponents.length > 1) {
            setMessage(
                "Only one earning component can use Balance."
            );
            return false;
        }

        const invalidDeduction = deductions.some(
            (item) =>
                !item.name.trim() ||
                Number(item.value) < 0
        );

        if (invalidDeduction) {
            setMessage(
                "Please complete all deduction components correctly."
            );
            return false;
        }

        return true;
    };

    const handleSave = () => {
        if (viewOnly) return;

        if (!validateTemplate()) return;

        const savedTemplates =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

        const now = new Date();

        const formattedDate = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        const templateData = {
            id: editingTemplate?.id || createId(),
            name: templateName.trim(),
            description: description.trim(),
            employeeType,
            status: editingTemplate?.status || "Active",
            updatedAt: formattedDate,
            employees: editingTemplate?.employees || 0,
            earnings,
            deductions,
        };

        let updatedTemplates;

        if (editingTemplate) {
            updatedTemplates = savedTemplates.map((template) =>
                template.id === editingTemplate.id
                    ? templateData
                    : template
            );
        } else {
            updatedTemplates = [
                ...savedTemplates,
                templateData,
            ];
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedTemplates)
        );

        setMessage(
            editingTemplate
                ? "Template updated successfully."
                : "Template created successfully."
        );

        setTimeout(() => {
            navigate("/payroll/payslip-templates");
        }, 900);
    };

    const handleBack = () => {
        navigate("/payroll/payslip-templates");
    };

    return (
        <div className="create-template-page">
            <div className="create-template-header">
                <div className="create-template-title">
                    <button
                        className="ct-back-button"
                        onClick={handleBack}
                    >
                        ←
                    </button>

                    <div>
                        <h1>
                            {viewOnly
                                ? "View Payslip Template"
                                : editingTemplate
                                ? "Edit Payslip Template"
                                : "Create Payslip Template"}
                        </h1>

                        <p>
                            Define salary calculation rules for
                            employees.
                        </p>
                    </div>
                </div>

                {!viewOnly && (
                    <button
                        className="ct-save-button"
                        onClick={handleSave}
                    >
                        ▣{" "}
                        {editingTemplate
                            ? "Update Template"
                            : "Save Template"}
                    </button>
                )}
            </div>

            {message && (
                <div
                    className={`ct-message ${
                        message.includes("successfully")
                            ? "success"
                            : "error"
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="ct-layout">
                <div className="ct-main">
                    <section className="ct-card">
                        <div className="ct-section-header">
                            <div>
                                <h2>Template Information</h2>
                                <p>
                                    Enter the basic details for this
                                    payslip template.
                                </p>
                            </div>
                        </div>

                        <div className="ct-form-grid">
                            <div className="ct-field">
                                <label>Template Name</label>

                                <input
                                    type="text"
                                    value={templateName}
                                    disabled={viewOnly}
                                    placeholder="e.g. Standard Employee Payslip"
                                    onChange={(event) =>
                                        setTemplateName(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="ct-field">
                                <label>Employee Type</label>

                                <select
                                    value={employeeType}
                                    disabled={viewOnly}
                                    onChange={(event) =>
                                        setEmployeeType(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option>
                                        Regular Employee
                                    </option>
                                    <option>Executive</option>
                                    <option>Contract Employee</option>
                                    <option>Intern</option>
                                    <option>Temporary Employee</option>
                                </select>
                            </div>

                            <div className="ct-field ct-full">
                                <label>Description</label>

                                <textarea
                                    value={description}
                                    disabled={viewOnly}
                                    placeholder="Describe how this template is used..."
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section className="ct-card">
                        <div className="ct-section-header">
                            <div>
                                <h2>Earnings</h2>
                                <p>
                                    Define the salary calculation
                                    rules. Actual amounts will be
                                    calculated from the employee's
                                    CTC.
                                </p>
                            </div>

                            {!viewOnly && (
                                <button
                                    className="ct-outline-button"
                                    onClick={addEarning}
                                >
                                    + Add Earning
                                </button>
                            )}
                        </div>

                        <div className="ct-table-header">
                            <span>COMPONENT</span>
                            <span>CALCULATION</span>
                            <span>VALUE</span>
                            <span />
                        </div>

                        <div className="ct-component-list">
                            {earnings.map((earning) => (
                                <div
                                    className="ct-component-row"
                                    key={earning.id}
                                >
                                    <input
                                        type="text"
                                        value={earning.name}
                                        disabled={viewOnly}
                                        placeholder="Component name"
                                        onChange={(event) =>
                                            updateEarning(
                                                earning.id,
                                                "name",
                                                event.target.value
                                            )
                                        }
                                    />

                                    <select
                                        value={
                                            earning.calculationType
                                        }
                                        disabled={viewOnly}
                                        onChange={(event) =>
                                            updateEarning(
                                                earning.id,
                                                "calculationType",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option>
                                            Percentage
                                        </option>
                                        <option>
                                            Fixed Amount
                                        </option>
                                        <option>
                                            Balance
                                        </option>
                                    </select>

                                    <div className="ct-value-wrapper">
                                        {earning.calculationType ===
                                        "Balance" ? (
                                            <span className="ct-balance-text">
                                                Remaining Amount
                                            </span>
                                        ) : (
                                            <>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        earning.value
                                                    }
                                                    disabled={viewOnly}
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEarning(
                                                            earning.id,
                                                            "value",
                                                            Number(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {earning.calculationType ===
                                                    "Percentage"
                                                        ? "%"
                                                        : "₹"}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {!viewOnly && (
                                        <button
                                            className="ct-delete-button"
                                            onClick={() =>
                                                removeEarning(
                                                    earning.id
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="ct-card">
                        <div className="ct-section-header">
                            <div>
                                <h2>Deductions</h2>
                                <p>
                                    Define deductions that belong to
                                    this payslip template.
                                </p>
                            </div>

                            {!viewOnly && (
                                <button
                                    className="ct-outline-button"
                                    onClick={addDeduction}
                                >
                                    + Add Deduction
                                </button>
                            )}
                        </div>

                        {deductions.length === 0 ? (
                            <div className="ct-no-components">
                                <strong>
                                    No deductions configured
                                </strong>

                                <span>
                                    PF, ESI, tax, loans and other
                                    deductions can be added here.
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="ct-table-header">
                                    <span>COMPONENT</span>
                                    <span>CALCULATION</span>
                                    <span>VALUE</span>
                                    <span />
                                </div>

                                <div className="ct-component-list">
                                    {deductions.map((deduction) => (
                                        <div
                                            className="ct-component-row"
                                            key={deduction.id}
                                        >
                                            <input
                                                type="text"
                                                value={
                                                    deduction.name
                                                }
                                                disabled={viewOnly}
                                                placeholder="Deduction name"
                                                onChange={(event) =>
                                                    updateDeduction(
                                                        deduction.id,
                                                        "name",
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            />

                                            <select
                                                value={
                                                    deduction.calculationType
                                                }
                                                disabled={viewOnly}
                                                onChange={(event) =>
                                                    updateDeduction(
                                                        deduction.id,
                                                        "calculationType",
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option>
                                                    Percentage
                                                </option>
                                                <option>
                                                    Fixed Amount
                                                </option>
                                            </select>

                                            <div className="ct-value-wrapper">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        deduction.value
                                                    }
                                                    disabled={viewOnly}
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateDeduction(
                                                            deduction.id,
                                                            "value",
                                                            event.target
                                                                .value
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {deduction.calculationType ===
                                                    "Percentage"
                                                        ? "%"
                                                        : "₹"}
                                                </span>
                                            </div>

                                            {!viewOnly && (
                                                <button
                                                    className="ct-delete-button"
                                                    onClick={() =>
                                                        removeDeduction(
                                                            deduction.id
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                </div>

                <aside className="ct-preview-card">
                    <h2>Template Preview</h2>

                    <p>
                        Preview how this template will be structured.
                    </p>

                    <div className="ct-preview">
                        <div className="ct-preview-logo">
                            SPARK
                        </div>

                        <div className="ct-preview-subtitle">
                            ERP & CRM SYSTEM
                        </div>

                        <div className="ct-preview-line" />

                        <h3>PAYSLIP</h3>

                        <div className="ct-preview-period">
                            <div>
                                <span>Employee</span>
                                <strong>Employee Name</strong>
                            </div>

                            <div>
                                <span>Pay Period</span>
                                <strong>Monthly</strong>
                            </div>
                        </div>

                        <h4>Earnings</h4>

                        {earnings.map((earning) => (
                            <div
                                className="ct-preview-row"
                                key={earning.id}
                            >
                                <span>
                                    {earning.name ||
                                        "Component"}
                                </span>

                                <strong>
                                    {earning.calculationType ===
                                    "Balance"
                                        ? "Balance"
                                        : earning.calculationType ===
                                          "Percentage"
                                        ? `${earning.value}%`
                                        : `₹${Number(
                                              earning.value || 0
                                          ).toLocaleString(
                                              "en-IN"
                                          )}`}
                                </strong>
                            </div>
                        ))}

                        <h4>Deductions</h4>

                        {deductions.length === 0 ? (
                            <div className="ct-preview-empty">
                                No deductions
                            </div>
                        ) : (
                            deductions.map((deduction) => (
                                <div
                                    className="ct-preview-row"
                                    key={deduction.id}
                                >
                                    <span>
                                        {deduction.name ||
                                            "Deduction"}
                                    </span>

                                    <strong>
                                        {deduction.calculationType ===
                                        "Percentage"
                                            ? `${deduction.value}%`
                                            : `₹${Number(
                                                  deduction.value ||
                                                      0
                                              ).toLocaleString(
                                                  "en-IN"
                                              )}`}
                                    </strong>
                                </div>
                            ))
                        )}

                        <div className="ct-preview-total">
                            <span>Net Salary</span>
                            <strong>Calculated</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default CreatePayslipTemplate;