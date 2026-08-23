import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PayslipTemplates.css";

const STORAGE_KEY = "spark_payslip_templates";

const defaultTemplates = [
    {
        id: 1,
        name: "Standard Employee Payslip",
        description:
            "Standard monthly payslip format for regular employees.",
        employeeType: "Regular Employee",
        status: "Active",
        updatedAt: "20 Aug 2026",
        employees: 124,
        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                calculationType: "Percentage",
                value: 50,
                balance: false,
            },
            {
                id: 2,
                name: "House Rent Allowance",
                calculationType: "Percentage",
                value: 20,
                balance: false,
            },
            {
                id: 3,
                name: "Transport Allowance",
                calculationType: "Percentage",
                value: 10,
                balance: false,
            },
            {
                id: 4,
                name: "Special Allowance",
                calculationType: "Balance",
                value: 0,
                balance: true,
            },
        ],
        deductions: [
            {
                id: 1,
                name: "Provident Fund",
                calculationType: "Percentage",
                value: 12,
            },
            {
                id: 2,
                name: "Professional Tax",
                calculationType: "Fixed Amount",
                value: 200,
            },
        ],
    },
    {
        id: 2,
        name: "Executive Payslip",
        description:
            "Payslip format with executive compensation components.",
        employeeType: "Executive",
        status: "Active",
        updatedAt: "18 Aug 2026",
        employees: 18,
        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                calculationType: "Percentage",
                value: 40,
                balance: false,
            },
            {
                id: 2,
                name: "House Rent Allowance",
                calculationType: "Percentage",
                value: 20,
                balance: false,
            },
            {
                id: 3,
                name: "Special Allowance",
                calculationType: "Balance",
                value: 0,
                balance: true,
            },
        ],
        deductions: [
            {
                id: 1,
                name: "Provident Fund",
                calculationType: "Percentage",
                value: 12,
            },
            {
                id: 2,
                name: "Professional Tax",
                calculationType: "Fixed Amount",
                value: 200,
            },
        ],
    },
    {
        id: 3,
        name: "Contract Employee Payslip",
        description:
            "Payslip template for contract and temporary employees.",
        employeeType: "Contract Employee",
        status: "Inactive",
        updatedAt: "12 Aug 2026",
        employees: 14,
        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                calculationType: "Percentage",
                value: 60,
                balance: false,
            },
            {
                id: 2,
                name: "Special Allowance",
                calculationType: "Balance",
                value: 0,
                balance: true,
            },
        ],
        deductions: [],
    },
];

function PayslipTemplates() {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [menuId, setMenuId] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            try {
                setTemplates(JSON.parse(saved));
            } catch {
                setTemplates(defaultTemplates);
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultTemplates)
                );
            }
        } else {
            setTemplates(defaultTemplates);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultTemplates)
            );
        }
    }, []);

    const saveTemplates = (updatedTemplates) => {
        setTemplates(updatedTemplates);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedTemplates)
        );
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                template.name.toLowerCase().includes(searchValue) ||
                template.description.toLowerCase().includes(searchValue) ||
                template.employeeType.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "All Status" ||
                template.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [templates, search, statusFilter]);

    const handleDelete = (id) => {
        const template = templates.find((item) => item.id === id);

        if (!template) return;

        const confirmed = window.confirm(
            `Delete "${template.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        const updated = templates.filter((item) => item.id !== id);
        saveTemplates(updated);
        setMenuId(null);
    };

    const handleToggleStatus = (id) => {
        const updated = templates.map((template) =>
            template.id === id
                ? {
                      ...template,
                      status:
                          template.status === "Active"
                              ? "Inactive"
                              : "Active",
                  }
                : template
        );

        saveTemplates(updated);
        setMenuId(null);
    };

    const handleEdit = (template) => {
        navigate("/payroll/payslip-templates/create", {
            state: {
                template,
                mode: "edit",
            },
        });
    };

    const handleView = (template) => {
        navigate("/payroll/payslip-templates/create", {
            state: {
                template,
                mode: "view",
            },
        });
    };

    return (
        <div
            className="payslip-templates-page"
            onClick={() => setMenuId(null)}
        >
            <div className="payslip-templates-header">
                <div>
                    <h1>Payslip Templates</h1>
                    <p>
                        Create and manage payslip templates and salary
                        calculation rules.
                    </p>
                </div>

                <button
                    className="pt-primary-button"
                    onClick={() =>
                        navigate("/payroll/payslip-templates/create")
                    }
                >
                    <span>+</span>
                    Create Template
                </button>
            </div>

            <div className="pt-toolbar">
                <div className="pt-search-wrapper">
                    <span className="pt-search-icon">⌕</span>

                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            <div className="pt-count">
                {filteredTemplates.length}{" "}
                {filteredTemplates.length === 1
                    ? "template"
                    : "templates"}
            </div>

            {filteredTemplates.length === 0 ? (
                <div className="pt-empty-state">
                    <div className="pt-empty-icon">▣</div>

                    <h3>No templates found</h3>

                    <p>
                        Create a payslip template to define salary
                        calculation rules.
                    </p>

                    <button
                        className="pt-primary-button"
                        onClick={() =>
                            navigate(
                                "/payroll/payslip-templates/create"
                            )
                        }
                    >
                        + Create Template
                    </button>
                </div>
            ) : (
                <div className="pt-grid">
                    {filteredTemplates.map((template) => (
                        <div
                            className="pt-template-card"
                            key={template.id}
                        >
                            <div className="pt-card-top">
                                <div className="pt-template-icon">
                                    ▣
                                </div>

                                <div
                                    className="pt-menu-wrapper"
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
                                >
                                    <button
                                        className="pt-more-button"
                                        onClick={() =>
                                            setMenuId(
                                                menuId === template.id
                                                    ? null
                                                    : template.id
                                            )
                                        }
                                    >
                                        ⋮
                                    </button>

                                    {menuId === template.id && (
                                        <div className="pt-dropdown-menu">
                                            <button
                                                onClick={() =>
                                                    handleView(template)
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleEdit(template)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        template.id
                                                    )
                                                }
                                            >
                                                {template.status ===
                                                "Active"
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        template.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2>{template.name}</h2>

                            <p className="pt-description">
                                {template.description}
                            </p>

                            <div className="pt-divider" />

                            <div className="pt-card-info">
                                <div>
                                    <span>EMPLOYEES</span>
                                    <strong>
                                        {template.employees}
                                    </strong>
                                </div>

                                <div>
                                    <span>LAST UPDATED</span>
                                    <strong>
                                        {template.updatedAt}
                                    </strong>
                                </div>
                            </div>

                            <div className="pt-card-footer">
                                <span
                                    className={`pt-status ${
                                        template.status === "Active"
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    {template.status}
                                </span>

                                <div className="pt-actions">
                                    <button
                                        title="View"
                                        onClick={() =>
                                            handleView(template)
                                        }
                                    >
                                        ◉
                                    </button>

                                    <button
                                        title="Edit"
                                        onClick={() =>
                                            handleEdit(template)
                                        }
                                    >
                                        ✎
                                    </button>

                                    <button
                                        title="Delete"
                                        onClick={() =>
                                            handleDelete(template.id)
                                        }
                                    >
                                        □
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PayslipTemplates;