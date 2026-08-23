import React, { useMemo, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { useNavigate } from "react-router-dom";

import "./EmployeesPayroll.css";


/* =========================================================
   EMPLOYEES
   Replace this later with Employee API
========================================================= */

const employees = [
    {
        id: 1,
        employeeId: "2020022",
        name: "Hamza Raj Mohammed",
        department: "IT",
        designation: "Junior Software Developer",
    },
    {
        id: 2,
        employeeId: "2020023",
        name: "Mahinoor",
        department: "IT",
        designation: "Software Developer",
    },
    {
        id: 3,
        employeeId: "2020024",
        name: "Mohamed Fayaz",
        department: "Management",
        designation: "Manager",
    },
    {
        id: 4,
        employeeId: "2020025",
        name: "Ayesha Khan",
        department: "HR",
        designation: "HR Executive",
    },
    {
        id: 5,
        employeeId: "2020031",
        name: "John",
        department: "Operations",
        designation: "Operations Executive",
    },
];


/* =========================================================
   FALLBACK PAYSLIP TEMPLATES

   IMPORTANT:
   Employee Payroll does NOT create salary components.

   Components and deductions come from Payslip Templates.

   When your Payslip Templates API is ready, replace this
   fallback with API data.
========================================================= */

const defaultTemplates = [
    {
        id: 1,
        templateName: "Standard Employee",
        description: "Standard employee payslip structure.",
        status: "Active",

        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                type: "Percentage",
                value: 40,
            },
            {
                id: 2,
                name: "House Rent Allowance",
                type: "Percentage",
                value: 20,
            },
            {
                id: 3,
                name: "Special Allowance",
                type: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                id: 1,
                name: "Provident Fund",
                type: "Percentage",
                value: 12,
            },
            {
                id: 2,
                name: "Professional Tax",
                type: "Fixed Amount",
                value: 200,
            },
        ],
    },

    {
        id: 2,
        templateName: "Executive Payslip",
        description: "Payslip structure for executive employees.",
        status: "Active",

        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                type: "Percentage",
                value: 50,
            },
            {
                id: 2,
                name: "House Rent Allowance",
                type: "Percentage",
                value: 20,
            },
            {
                id: 3,
                name: "Special Allowance",
                type: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                id: 1,
                name: "Provident Fund",
                type: "Percentage",
                value: 12,
            },
            {
                id: 2,
                name: "Professional Tax",
                type: "Fixed Amount",
                value: 200,
            },
        ],
    },

    {
        id: 3,
        templateName: "Contract Employee Payslip",
        description: "Payslip structure for contract employees.",
        status: "Inactive",

        earnings: [
            {
                id: 1,
                name: "Basic Salary",
                type: "Percentage",
                value: 60,
            },
            {
                id: 2,
                name: "Special Allowance",
                type: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                id: 1,
                name: "Professional Tax",
                type: "Fixed Amount",
                value: 200,
            },
        ],
    },
];


/* =========================================================
   HELPERS
========================================================= */

const getStoredTemplates = () => {
    try {
        const stored = localStorage.getItem("payslipTemplates");

        if (!stored) {
            return defaultTemplates;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return defaultTemplates;
        }

        return parsed;
    } catch (error) {
        console.error("Unable to load payslip templates:", error);
        return defaultTemplates;
    }
};


const getStoredAssignments = () => {
    try {
        const stored = localStorage.getItem(
            "employeePayrollAssignments"
        );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(
            "Unable to load employee payroll assignments:",
            error
        );

        return [];
    }
};


const normalizeType = (type) => {
    if (!type) {
        return "Fixed Amount";
    }

    const value = String(type).toLowerCase();

    if (
        value === "fixed" ||
        value === "fixed amount"
    ) {
        return "Fixed Amount";
    }

    if (value === "percentage") {
        return "Percentage";
    }

    if (value === "balance") {
        return "Balance";
    }

    if (value === "formula") {
        return "Formula";
    }

    return type;
};


const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
};


/* =========================================================
   COMPONENT
========================================================= */

function EmployeesPayroll() {
    const navigate = useNavigate();

    /* =====================================================
       PAGE MODE

       list = assigned employees table
       form = assign/edit payroll
    ===================================================== */

    const [pageMode, setPageMode] = useState("list");

    const [search, setSearch] = useState("");

    const [assignments, setAssignments] = useState(
        getStoredAssignments
    );

    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState("");

    const [selectedTemplateId, setSelectedTemplateId] =
        useState("");

    const [annualCtc, setAnnualCtc] = useState("");

    const [editingEmployeeId, setEditingEmployeeId] =
        useState(null);

    const [viewAssignment, setViewAssignment] =
        useState(null);

    const [saved, setSaved] = useState(false);


    /* =====================================================
       LOAD PAYSLIP TEMPLATES
    ===================================================== */

    const salaryTemplates = useMemo(() => {
        return getStoredTemplates();
    }, [pageMode]);


    /* =====================================================
       ACTIVE TEMPLATES
    ===================================================== */

    const activeTemplates = useMemo(() => {
        return salaryTemplates.filter(
            (template) =>
                template.status !== "Inactive"
        );
    }, [salaryTemplates]);


    /* =====================================================
       ASSIGNED EMPLOYEE TABLE SEARCH
    ===================================================== */

    const filteredAssignments = useMemo(() => {
        const searchValue = search
            .toLowerCase()
            .trim();

        if (!searchValue) {
            return assignments;
        }

        return assignments.filter((item) => {
            return (
                String(item.employeeName || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.employeeId || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.templateName || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [assignments, search]);


    /* =====================================================
       EMPLOYEE SEARCH FOR ASSIGNMENT
    ===================================================== */

    const filteredEmployees = useMemo(() => {
        const searchValue = search
            .toLowerCase()
            .trim();

        if (!searchValue) {
            return employees;
        }

        return employees.filter((employee) => {
            return (
                employee.name
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.employeeId
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.department
                    .toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [search]);


    /* =====================================================
       SELECTED EMPLOYEE
    ===================================================== */

    const selectedEmployee = employees.find(
        (employee) =>
            String(employee.id) ===
            String(selectedEmployeeId)
    );


    /* =====================================================
       SELECTED TEMPLATE
    ===================================================== */

    const selectedTemplate = salaryTemplates.find(
        (template) =>
            String(
                template.id ??
                    template.templateId
            ) ===
            String(selectedTemplateId)
    );


    /* =====================================================
       TEMPLATE EARNINGS

       Imported from Payslip Template.
    ===================================================== */

    const templateEarnings = useMemo(() => {
        if (!selectedTemplate) {
            return [];
        }

        return (
            selectedTemplate.earnings ||
            selectedTemplate.components ||
            []
        ).map((item, index) => ({
            ...item,

            id: item.id ?? index + 1,

            name:
                item.name ||
                item.componentName ||
                "Salary Component",

            type: normalizeType(
                item.type ||
                    item.calculation
            ),

            value: Number(
                item.value || 0
            ),
        }));
    }, [selectedTemplate]);


    /* =====================================================
       TEMPLATE DEDUCTIONS

       Imported from Payslip Template.
    ===================================================== */

    const templateDeductions = useMemo(() => {
        if (!selectedTemplate) {
            return [];
        }

        return (
            selectedTemplate.deductions ||
            []
        ).map((item, index) => ({
            ...item,

            id: item.id ?? index + 1,

            name:
                item.name ||
                item.componentName ||
                "Deduction",

            type: normalizeType(
                item.type ||
                    item.calculation
            ),

            value: Number(
                item.value || 0
            ),
        }));
    }, [selectedTemplate]);


    /* =====================================================
       CTC
    ===================================================== */

    const ctc = Number(annualCtc) || 0;

    const monthlyCtc = ctc / 12;


    /* =====================================================
       CALCULATE EARNINGS
    ===================================================== */

    const calculatedEarnings = useMemo(() => {
        if (
            !selectedTemplate ||
            ctc <= 0
        ) {
            return [];
        }

        const earnings = templateEarnings;

        const percentageComponents =
            earnings.filter(
                (earning) =>
                    earning.type ===
                    "Percentage"
            );

        const fixedComponents =
            earnings.filter(
                (earning) =>
                    earning.type ===
                    "Fixed Amount"
            );

        const percentageTotal =
            percentageComponents.reduce(
                (total, earning) =>
                    total +
                    (ctc *
                        Number(
                            earning.value || 0
                        )) /
                        100,
                0
            );

        const fixedAnnualTotal =
            fixedComponents.reduce(
                (total, earning) =>
                    total +
                    Number(
                        earning.value || 0
                    ) *
                        12,
                0
            );

        const usedAnnualAmount =
            percentageTotal +
            fixedAnnualTotal;

        let remainingAmount = Math.max(
            ctc -
                usedAnnualAmount,
            0
        );

        return earnings.map(
            (earning) => {
                let annualAmount = 0;

                if (
                    earning.type ===
                    "Percentage"
                ) {
                    annualAmount =
                        (ctc *
                            Number(
                                earning.value ||
                                    0
                            )) /
                        100;
                } else if (
                    earning.type ===
                    "Fixed Amount"
                ) {
                    annualAmount =
                        Number(
                            earning.value ||
                                0
                        ) * 12;
                } else if (
                    earning.type ===
                    "Balance"
                ) {
                    annualAmount =
                        remainingAmount;

                    remainingAmount = 0;
                }

                return {
                    ...earning,

                    annualAmount,

                    monthlyAmount:
                        annualAmount /
                        12,
                };
            }
        );
    }, [
        selectedTemplate,
        templateEarnings,
        ctc,
    ]);


    /* =====================================================
       GROSS SALARY
    ===================================================== */

    const annualGrossSalary =
        calculatedEarnings.reduce(
            (total, earning) =>
                total +
                Number(
                    earning.annualAmount ||
                        0
                ),
            0
        );

    const monthlyGrossSalary =
        annualGrossSalary / 12;


    /* =====================================================
       CALCULATE DEDUCTIONS

       Deductions come from the selected template.
    ===================================================== */

    const calculatedDeductions =
        useMemo(() => {
            if (
                !selectedTemplate ||
                monthlyGrossSalary <= 0
            ) {
                return [];
            }

            return templateDeductions.map(
                (deduction) => {
                    let monthlyAmount = 0;

                    if (
                        deduction.type ===
                        "Percentage"
                    ) {
                        monthlyAmount =
                            (monthlyGrossSalary *
                                Number(
                                    deduction.value ||
                                        0
                                )) /
                            100;
                    } else if (
                        deduction.type ===
                        "Fixed Amount"
                    ) {
                        monthlyAmount =
                            Number(
                                deduction.value ||
                                    0
                            );
                    }

                    return {
                        ...deduction,

                        monthlyAmount,

                        annualAmount:
                            monthlyAmount *
                            12,
                    };
                }
            );
        }, [
            selectedTemplate,
            templateDeductions,
            monthlyGrossSalary,
        ]);


    /* =====================================================
       TOTAL DEDUCTIONS
    ===================================================== */

    const monthlyDeductions =
        calculatedDeductions.reduce(
            (total, deduction) =>
                total +
                Number(
                    deduction.monthlyAmount ||
                        0
                ),
            0
        );

    const annualDeductions =
        calculatedDeductions.reduce(
            (total, deduction) =>
                total +
                Number(
                    deduction.annualAmount ||
                        0
                ),
            0
        );


    /* =====================================================
       NET SALARY
    ===================================================== */

    const monthlyNetSalary =
        monthlyGrossSalary -
        monthlyDeductions;

    const annualNetSalary =
        annualGrossSalary -
        annualDeductions;


    /* =====================================================
       OPEN ASSIGN FORM
    ===================================================== */

    const handleOpenAssign = () => {
        setPageMode("form");

        setSelectedEmployeeId("");
        setSelectedTemplateId("");
        setAnnualCtc("");
        setEditingEmployeeId(null);
        setSearch("");
        setSaved(false);
    };


    /* =====================================================
       EDIT ASSIGNMENT
    ===================================================== */

    const handleEdit = (assignment) => {
        const employee = employees.find(
            (item) =>
                String(
                    item.employeeId
                ) ===
                String(
                    assignment.employeeId
                )
        );

        setSelectedEmployeeId(
            employee?.id || ""
        );

        setSelectedTemplateId(
            assignment.templateId
        );

        setAnnualCtc(
            assignment.annualCtc
        );

        setEditingEmployeeId(
            assignment.employeeId
        );

        setSaved(false);

        setPageMode("form");
    };


    /* =====================================================
       VIEW ASSIGNMENT
    ===================================================== */

    const handleView = (assignment) => {
        setViewAssignment(
            assignment
        );
    };


    /* =====================================================
       DELETE ASSIGNMENT
    ===================================================== */

    const handleDelete = (assignment) => {
        const confirmed =
            window.confirm(
                `Remove payroll assignment for ${assignment.employeeName}?`
            );

        if (!confirmed) {
            return;
        }

        const updated =
            assignments.filter(
                (item) =>
                    String(
                        item.employeeId
                    ) !==
                    String(
                        assignment.employeeId
                    )
            );

        setAssignments(updated);

        localStorage.setItem(
            "employeePayrollAssignments",
            JSON.stringify(updated)
        );
    };


    /* =====================================================
       TEMPLATE CHANGE
    ===================================================== */

    const handleTemplateChange = (
        event
    ) => {
        setSelectedTemplateId(
            event.target.value
        );

        setSaved(false);
    };


    /* =====================================================
       SAVE PAYROLL
    ===================================================== */

    const handleSave = () => {
        if (!selectedEmployee) {
            alert(
                "Please select an employee."
            );
            return;
        }

        if (!selectedTemplate) {
            alert(
                "Please select a payslip template."
            );
            return;
        }

        if (ctc <= 0) {
            alert(
                "Please enter the employee's Annual CTC."
            );
            return;
        }


        const salaryStructure = {
            employeeId:
                selectedEmployee.employeeId,

            employeeName:
                selectedEmployee.name,

            department:
                selectedEmployee.department,

            designation:
                selectedEmployee.designation,

            templateId:
                selectedTemplate.id ??
                selectedTemplate.templateId,

            templateName:
                selectedTemplate.templateName ||
                selectedTemplate.name,

            annualCtc: ctc,

            earnings:
                calculatedEarnings,

            deductions:
                calculatedDeductions,

            monthlyGrossSalary,

            annualGrossSalary,

            monthlyDeductions,

            annualDeductions,

            monthlyNetSalary,

            annualNetSalary,

            savedAt:
                new Date().toISOString(),
        };


        /*
         * If employee already has payroll,
         * replace the old assignment.
         *
         * Otherwise create a new one.
         */

        const updated = [
            ...assignments.filter(
                (item) =>
                    String(
                        item.employeeId
                    ) !==
                    String(
                        selectedEmployee.employeeId
                    )
            ),

            salaryStructure,
        ];


        localStorage.setItem(
            "employeePayrollAssignments",
            JSON.stringify(updated)
        );


        setAssignments(updated);

        setSaved(true);


        alert(
            editingEmployeeId
                ? `Payroll updated successfully for ${selectedEmployee.name}.`
                : `Payroll assigned successfully to ${selectedEmployee.name}.`
        );


        /*
         * After saving, return to
         * Assigned Employees list.
         */

        setPageMode("list");

        setSelectedEmployeeId("");
        setSelectedTemplateId("");
        setAnnualCtc("");
        setEditingEmployeeId(null);
        setSearch("");
    };


    /* =====================================================
       BACK TO LIST
    ===================================================== */

    const handleBackToList = () => {
        setPageMode("list");

        setSelectedEmployeeId("");
        setSelectedTemplateId("");
        setAnnualCtc("");
        setEditingEmployeeId(null);
        setSaved(false);
        setSearch("");
    };


    /* =====================================================
       FORM PAGE
    ===================================================== */

    if (pageMode === "form") {
        return (
            <Box className="employees-payroll-page">

                <Box className="employees-payroll-header">

                    <Box className="employees-payroll-title-wrapper">

                        <IconButton
                            className="employees-payroll-back"
                            onClick={
                                handleBackToList
                            }
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        <Box>
                            <Typography className="employees-payroll-title">
                                {editingEmployeeId
                                    ? "Edit Employee Payroll"
                                    : "Assign Employee Payroll"}
                            </Typography>

                            <Typography className="employees-payroll-subtitle">
                                Select a payslip template and assign the employee's Annual CTC.
                            </Typography>
                        </Box>

                    </Box>


                    <Button
                        variant="contained"
                        startIcon={
                            <SaveOutlinedIcon />
                        }
                        className="employees-payroll-save-button"
                        onClick={
                            handleSave
                        }
                    >
                        {editingEmployeeId
                            ? "Update Payroll"
                            : "Save Payroll"}
                    </Button>

                </Box>


                {/* =================================================
                    EMPLOYEE + TEMPLATE
                ================================================= */}

                <Card className="employees-payroll-card">

                    <CardContent>

                        <Box className="section-heading">

                            <Box className="section-heading-icon">
                                <SearchIcon />
                            </Box>

                            <Box>
                                <Typography className="section-title">
                                    Assign Payroll
                                </Typography>

                                <Typography className="section-description">
                                    Select an employee, choose a payslip template and enter their Annual CTC.
                                </Typography>
                            </Box>

                        </Box>


                        <Box className="employee-selection-grid">

                            <TextField
                                fullWidth
                                label="Search Employee"
                                placeholder="Search by name, ID or department"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />


                            <FormControl fullWidth>

                                <InputLabel>
                                    Employee
                                </InputLabel>

                                <Select
                                    value={
                                        selectedEmployeeId
                                    }
                                    label="Employee"
                                    onChange={(event) =>
                                        setSelectedEmployeeId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="">
                                        Select Employee
                                    </MenuItem>

                                    {filteredEmployees.map(
                                        (
                                            employee
                                        ) => (
                                            <MenuItem
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {
                                                    employee.name
                                                }{" "}
                                                -{" "}
                                                {
                                                    employee.employeeId
                                                }
                                            </MenuItem>
                                        )
                                    )}

                                </Select>

                            </FormControl>


                            <FormControl fullWidth>

                                <InputLabel>
                                    Payslip Template
                                </InputLabel>

                                <Select
                                    value={
                                        selectedTemplateId
                                    }
                                    label="Payslip Template"
                                    onChange={
                                        handleTemplateChange
                                    }
                                >

                                    <MenuItem value="">
                                        Select Payslip Template
                                    </MenuItem>

                                    {activeTemplates.map(
                                        (
                                            template
                                        ) => (
                                            <MenuItem
                                                key={
                                                    template.id ??
                                                    template.templateId
                                                }
                                                value={
                                                    template.id ??
                                                    template.templateId
                                                }
                                            >
                                                {
                                                    template.templateName ||
                                                    template.name
                                                }
                                            </MenuItem>
                                        )
                                    )}

                                </Select>

                            </FormControl>


                            <TextField
                                fullWidth
                                type="number"
                                label="Annual CTC"
                                placeholder="e.g. 2400000"
                                value={
                                    annualCtc
                                }
                                onChange={(
                                    event
                                ) => {
                                    setAnnualCtc(
                                        event.target
                                            .value
                                    );

                                    setSaved(
                                        false
                                    );
                                }}
                                inputProps={{
                                    min: 0,
                                }}
                                helperText="The selected template will calculate earnings and deductions automatically."
                            />

                        </Box>


                        {selectedEmployee && (
                            <Box className="employee-details">

                                <Box className="employee-avatar">
                                    {selectedEmployee.name
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()}
                                </Box>

                                <Box>

                                    <Typography className="employee-name">
                                        {
                                            selectedEmployee.name
                                        }
                                    </Typography>

                                    <Typography className="employee-meta">
                                        Employee ID:{" "}
                                        {
                                            selectedEmployee.employeeId
                                        }
                                    </Typography>

                                    <Typography className="employee-meta">
                                        {
                                            selectedEmployee.department
                                        }{" "}
                                        •{" "}
                                        {
                                            selectedEmployee.designation
                                        }
                                    </Typography>

                                </Box>

                            </Box>
                        )}

                    </CardContent>

                </Card>


                {/* =================================================
                    CALCULATED PAYROLL
                ================================================= */}

                {selectedTemplate &&
                    ctc > 0 && (
                        <Box className="payroll-content-grid">

                            <Box>

                                {/* TEMPLATE */}

                                <Card className="employees-payroll-card">

                                    <CardContent>

                                        <Box className="section-heading">

                                            <Box className="section-heading-icon green">
                                                <AccountBalanceWalletOutlinedIcon />
                                            </Box>

                                            <Box>

                                                <Typography className="section-title">
                                                    {
                                                        selectedTemplate.templateName ||
                                                        selectedTemplate.name
                                                    }
                                                </Typography>

                                                <Typography className="section-description">
                                                    Salary structure imported from the selected payslip template.
                                                </Typography>

                                            </Box>

                                        </Box>


                                        <Box className="template-info-bar">

                                            <Box>
                                                <Typography className="template-info-label">
                                                    Annual CTC
                                                </Typography>

                                                <Typography className="template-info-value">
                                                    {formatCurrency(
                                                        ctc
                                                    )}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography className="template-info-label">
                                                    Monthly CTC
                                                </Typography>

                                                <Typography className="template-info-value">
                                                    {formatCurrency(
                                                        monthlyCtc
                                                    )}
                                                </Typography>
                                            </Box>

                                        </Box>

                                    </CardContent>

                                </Card>


                                {/* EARNINGS */}

                                <Card className="employees-payroll-card">

                                    <CardContent>

                                        <Box className="section-heading">

                                            <Box className="section-heading-icon green">
                                                <AccountBalanceWalletOutlinedIcon />
                                            </Box>

                                            <Box>

                                                <Typography className="section-title">
                                                    Earnings
                                                </Typography>

                                                <Typography className="section-description">
                                                    Imported automatically from the selected payslip template.
                                                </Typography>

                                            </Box>

                                        </Box>


                                        <Box className="earnings-header">

                                            <Typography>
                                                Component
                                            </Typography>

                                            <Typography>
                                                Calculation
                                            </Typography>

                                            <Typography>
                                                Template Value
                                            </Typography>

                                            <Typography>
                                                Monthly Amount
                                            </Typography>

                                        </Box>


                                        <Box className="earnings-list">

                                            {calculatedEarnings.map(
                                                (
                                                    earning
                                                ) => (
                                                    <Box
                                                        className="earning-row"
                                                        key={
                                                            earning.id
                                                        }
                                                    >

                                                        <Typography className="component-name">
                                                            {
                                                                earning.name
                                                            }
                                                        </Typography>

                                                        <span className="calculation-badge">
                                                            {
                                                                earning.type
                                                            }
                                                        </span>

                                                        <Typography className="template-value">
                                                            {earning.type ===
                                                            "Percentage"
                                                                ? `${earning.value}%`
                                                                : earning.type ===
                                                                  "Balance"
                                                                ? "Remaining"
                                                                : earning.type ===
                                                                  "Fixed Amount"
                                                                ? formatCurrency(
                                                                      earning.value
                                                                  )
                                                                : earning.value}
                                                        </Typography>

                                                        <Typography className="calculated-value">
                                                            {formatCurrency(
                                                                earning.monthlyAmount
                                                            )}
                                                        </Typography>

                                                    </Box>
                                                )
                                            )}

                                        </Box>

                                    </CardContent>

                                </Card>


                                {/* DEDUCTIONS */}

                                <Card className="employees-payroll-card">

                                    <CardContent>

                                        <Box className="section-heading">

                                            <Box className="section-heading-icon deduction">
                                                %
                                            </Box>

                                            <Box>

                                                <Typography className="section-title">
                                                    Deductions
                                                </Typography>

                                                <Typography className="section-description">
                                                    Imported automatically from the selected payslip template.
                                                </Typography>

                                            </Box>

                                        </Box>


                                        <Box className="earnings-header">

                                            <Typography>
                                                Component
                                            </Typography>

                                            <Typography>
                                                Calculation
                                            </Typography>

                                            <Typography>
                                                Template Value
                                            </Typography>

                                            <Typography>
                                                Monthly Deduction
                                            </Typography>

                                        </Box>


                                        <Box className="earnings-list">

                                            {calculatedDeductions.length ===
                                            0 ? (
                                                <Box className="empty-deduction-state">
                                                    No deductions configured in this template.
                                                </Box>
                                            ) : (
                                                calculatedDeductions.map(
                                                    (
                                                        deduction
                                                    ) => (
                                                        <Box
                                                            className="earning-row"
                                                            key={
                                                                deduction.id
                                                            }
                                                        >

                                                            <Typography className="component-name">
                                                                {
                                                                    deduction.name
                                                                }
                                                            </Typography>

                                                            <span className="calculation-badge deduction-badge">
                                                                {
                                                                    deduction.type
                                                                }
                                                            </span>

                                                            <Typography className="template-value">
                                                                {deduction.type ===
                                                                "Percentage"
                                                                    ? `${deduction.value}%`
                                                                    : formatCurrency(
                                                                          deduction.value
                                                                      )}
                                                            </Typography>

                                                            <Typography className="calculated-value deduction-value">
                                                                {formatCurrency(
                                                                    deduction.monthlyAmount
                                                                )}
                                                            </Typography>

                                                        </Box>
                                                    )
                                                )
                                            )}

                                        </Box>

                                    </CardContent>

                                </Card>

                            </Box>


                            {/* SUMMARY */}

                            <Card className="employees-payroll-card salary-summary-card">

                                <CardContent>

                                    <Typography className="summary-title">
                                        Salary Summary
                                    </Typography>

                                    <Typography className="summary-description">
                                        Calculated automatically from the selected template.
                                    </Typography>


                                    <Box className="summary-items">

                                        <Box className="summary-item">
                                            <Typography>
                                                Annual CTC
                                            </Typography>

                                            <Typography className="summary-value">
                                                {formatCurrency(
                                                    ctc
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-item">
                                            <Typography>
                                                Monthly Gross Salary
                                            </Typography>

                                            <Typography className="summary-value">
                                                {formatCurrency(
                                                    monthlyGrossSalary
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-item">
                                            <Typography>
                                                Annual Gross Salary
                                            </Typography>

                                            <Typography className="summary-value">
                                                {formatCurrency(
                                                    annualGrossSalary
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-divider" />


                                        <Box className="summary-item">
                                            <Typography>
                                                Monthly Deductions
                                            </Typography>

                                            <Typography className="summary-value deduction-summary">
                                                -
                                                {formatCurrency(
                                                    monthlyDeductions
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-item">
                                            <Typography>
                                                Annual Deductions
                                            </Typography>

                                            <Typography className="summary-value deduction-summary">
                                                -
                                                {formatCurrency(
                                                    annualDeductions
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-divider" />


                                        <Box className="summary-item">
                                            <Typography className="summary-total-label">
                                                Monthly Net Salary
                                            </Typography>

                                            <Typography className="summary-total">
                                                {formatCurrency(
                                                    monthlyNetSalary
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box className="summary-item">
                                            <Typography className="summary-total-label">
                                                Annual Net Salary
                                            </Typography>

                                            <Typography className="summary-total">
                                                {formatCurrency(
                                                    annualNetSalary
                                                )}
                                            </Typography>
                                        </Box>

                                    </Box>


                                    <Box className="deduction-note">

                                        <Typography className="deduction-note-title">
                                            Template Controlled
                                        </Typography>

                                        <Typography>
                                            Earnings and deductions are imported from the selected payslip template. They are not manually defined in Employee Payroll.
                                        </Typography>

                                    </Box>

                                </CardContent>

                            </Card>

                        </Box>
                    )}

            </Box>
        );
    }


    /* =====================================================
       ASSIGNED EMPLOYEES LIST
    ===================================================== */

    return (
        <Box className="employees-payroll-page">

            {/* HEADER */}

            <Box className="employees-payroll-header">

                <Box className="employees-payroll-title-wrapper">

                    <IconButton
                        className="employees-payroll-back"
                        onClick={() =>
                            navigate(
                                "/payroll"
                            )
                        }
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Box>

                        <Typography className="employees-payroll-title">
                            Employees Payroll
                        </Typography>

                        <Typography className="employees-payroll-subtitle">
                            Assign and manage salary structures for employees.
                        </Typography>

                    </Box>

                </Box>


                <Button
                    variant="contained"
                    className="employees-payroll-assign-button"
                    onClick={
                        handleOpenAssign
                    }
                >
                    Assign Salary
                </Button>

            </Box>


            {/* SEARCH */}

            <Card className="employees-payroll-card employees-payroll-list-card">

                <CardContent>

                    <Box className="employees-payroll-list-toolbar">

                        <TextField
                            fullWidth
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search employee..."
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon className="table-search-icon" />
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            className="employees-payroll-assign-button toolbar-button"
                            onClick={
                                handleOpenAssign
                            }
                        >
                            Assign Salary
                        </Button>

                    </Box>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <Box className="assigned-payroll-table-wrapper">

                        <table className="assigned-payroll-table">

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Payslip
                                    </th>

                                    <th>
                                        Annual CTC
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAssignments.length ===
                                0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="empty-table-state"
                                        >
                                            <Typography>
                                                No payroll assignments found.
                                            </Typography>

                                            <Typography className="empty-table-helper">
                                                Click "Assign Salary" to assign a payslip template to an employee.
                                            </Typography>
                                        </td>

                                    </tr>

                                ) : (

                                    filteredAssignments.map(
                                        (
                                            assignment
                                        ) => (
                                            <tr
                                                key={
                                                    assignment.employeeId
                                                }
                                            >

                                                <td>

                                                    <Box className="table-employee">

                                                        <Box className="table-avatar">
                                                            {String(
                                                                assignment.employeeName ||
                                                                    "E"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </Box>

                                                        <Box>

                                                            <Typography className="table-employee-name">
                                                                {
                                                                    assignment.employeeName
                                                                }
                                                            </Typography>

                                                            <Typography className="table-employee-meta">
                                                                {
                                                                    assignment.designation ||
                                                                    ""
                                                                }
                                                            </Typography>

                                                        </Box>

                                                    </Box>

                                                </td>


                                                <td>

                                                    <Typography className="table-id">
                                                        {
                                                            assignment.employeeId
                                                        }
                                                    </Typography>

                                                </td>


                                                <td>

                                                    <span className="template-badge">
                                                        {
                                                            assignment.templateName
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <Typography className="table-ctc">
                                                        {formatCurrency(
                                                            assignment.annualCtc
                                                        )}
                                                    </Typography>

                                                </td>


                                                <td>

                                                    <Box className="table-actions">

                                                        <Button
                                                            className="table-action-button view-button"
                                                            onClick={() =>
                                                                handleView(
                                                                    assignment
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            className="table-action-button edit-button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    assignment
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            className="table-action-button delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    assignment
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>

                                                    </Box>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </Box>

                </CardContent>

            </Card>


            {/* =====================================================
                VIEW DIALOG
            ===================================================== */}

            <Dialog
                open={
                    Boolean(
                        viewAssignment
                    )
                }
                onClose={() =>
                    setViewAssignment(
                        null
                    )
                }
                fullWidth
                maxWidth="md"
            >

                <DialogTitle className="view-dialog-title">
                    Employee Payroll Details
                </DialogTitle>


                <DialogContent>

                    {viewAssignment && (
                        <Box>

                            <Box className="view-employee-header">

                                <Box className="view-avatar">
                                    {viewAssignment.employeeName
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()}
                                </Box>

                                <Box>

                                    <Typography className="view-employee-name">
                                        {
                                            viewAssignment.employeeName
                                        }
                                    </Typography>

                                    <Typography className="view-employee-meta">
                                        Employee ID:{" "}
                                        {
                                            viewAssignment.employeeId
                                        }
                                    </Typography>

                                </Box>

                            </Box>


                            <Box className="view-summary-grid">

                                <Box className="view-summary-box">

                                    <Typography>
                                        Payslip Template
                                    </Typography>

                                    <strong>
                                        {
                                            viewAssignment.templateName
                                        }
                                    </strong>

                                </Box>


                                <Box className="view-summary-box">

                                    <Typography>
                                        Annual CTC
                                    </Typography>

                                    <strong>
                                        {formatCurrency(
                                            viewAssignment.annualCtc
                                        )}
                                    </strong>

                                </Box>


                                <Box className="view-summary-box">

                                    <Typography>
                                        Monthly Gross
                                    </Typography>

                                    <strong>
                                        {formatCurrency(
                                            viewAssignment.monthlyGrossSalary
                                        )}
                                    </strong>

                                </Box>


                                <Box className="view-summary-box">

                                    <Typography>
                                        Monthly Net
                                    </Typography>

                                    <strong>
                                        {formatCurrency(
                                            viewAssignment.monthlyNetSalary
                                        )}
                                    </strong>

                                </Box>

                            </Box>


                            <Typography className="view-section-title">
                                Earnings
                            </Typography>


                            <Box className="view-component-list">

                                {(
                                    viewAssignment.earnings ||
                                    []
                                ).map(
                                    (
                                        earning
                                    ) => (
                                        <Box
                                            className="view-component-row"
                                            key={
                                                earning.id
                                            }
                                        >

                                            <Typography>
                                                {
                                                    earning.name
                                                }
                                            </Typography>

                                            <Typography>
                                                {earning.type ===
                                                "Percentage"
                                                    ? `${earning.value}%`
                                                    : earning.type ===
                                                      "Balance"
                                                    ? "Remaining"
                                                    : formatCurrency(
                                                          earning.value
                                                      )}
                                            </Typography>

                                            <strong>
                                                {formatCurrency(
                                                    earning.monthlyAmount
                                                )}
                                            </strong>

                                        </Box>
                                    )
                                )}

                            </Box>


                            <Typography className="view-section-title">
                                Deductions
                            </Typography>


                            <Box className="view-component-list">

                                {(
                                    viewAssignment.deductions ||
                                    []
                                ).length ===
                                0 ? (

                                    <Typography className="view-empty">
                                        No deductions.
                                    </Typography>

                                ) : (

                                    (
                                        viewAssignment.deductions ||
                                        []
                                    ).map(
                                        (
                                            deduction
                                        ) => (
                                            <Box
                                                className="view-component-row deduction-view-row"
                                                key={
                                                    deduction.id
                                                }
                                            >

                                                <Typography>
                                                    {
                                                        deduction.name
                                                    }
                                                </Typography>

                                                <Typography>
                                                    {deduction.type ===
                                                    "Percentage"
                                                        ? `${deduction.value}%`
                                                        : formatCurrency(
                                                              deduction.value
                                                          )}
                                                </Typography>

                                                <strong>
                                                    -
                                                    {formatCurrency(
                                                        deduction.monthlyAmount
                                                    )}
                                                </strong>

                                            </Box>
                                        )
                                    )
                                )}

                            </Box>

                        </Box>
                    )}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setViewAssignment(
                                null
                            )
                        }
                    >
                        Close
                    </Button>

                    {viewAssignment && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleEdit(
                                    viewAssignment
                                );

                                setViewAssignment(
                                    null
                                );
                            }}
                        >
                            Edit Payroll
                        </Button>
                    )}

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default EmployeesPayroll;