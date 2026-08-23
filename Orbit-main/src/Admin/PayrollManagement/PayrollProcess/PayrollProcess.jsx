import React, { useMemo, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import "./PayrollProcess.css";


/* =========================================================
   SAMPLE PAYROLL DATA
   Later this can come from your Payroll API
========================================================= */

const employeesData = [
    {
        employeeId: 2020025,
        name: "Ayesha Khan",
        department: "IT",
        templateName: "Standard Employee",
        annualCtc: 2400000,
        monthlyCtc: 200000,

        earnings: [
            {
                name: "Basic Salary",
                calculation: "Percentage",
                value: 40,
            },
            {
                name: "House Rent Allowance",
                calculation: "Percentage",
                value: 20,
            },
            {
                name: "Special Allowance",
                calculation: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                name: "Provident Fund",
                calculation: "Percentage",
                value: 12,
            },
            {
                name: "Professional Tax",
                calculation: "Fixed Amount",
                value: 200,
            },
        ],
    },

    {
        employeeId: 2020022,
        name: "Hamza Raj Mohammed",
        department: "Administration",
        templateName: "Executive Payslip",
        annualCtc: 3000000,
        monthlyCtc: 250000,

        earnings: [
            {
                name: "Basic Salary",
                calculation: "Percentage",
                value: 40,
            },
            {
                name: "House Rent Allowance",
                calculation: "Percentage",
                value: 20,
            },
            {
                name: "Special Allowance",
                calculation: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                name: "Provident Fund",
                calculation: "Percentage",
                value: 12,
            },
            {
                name: "Professional Tax",
                calculation: "Fixed Amount",
                value: 200,
            },
        ],
    },

    {
        employeeId: 2020031,
        name: "John",
        department: "Operations",
        templateName: "Contract Employee",
        annualCtc: 1800000,
        monthlyCtc: 150000,

        earnings: [
            {
                name: "Basic Salary",
                calculation: "Percentage",
                value: 40,
            },
            {
                name: "Special Allowance",
                calculation: "Balance",
                value: 0,
            },
        ],

        deductions: [
            {
                name: "Professional Tax",
                calculation: "Fixed Amount",
                value: 200,
            },
        ],
    },
];


/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};


const calculateEmployee = (employee) => {
    const monthlyCtc = Number(employee?.monthlyCtc) || 0;

    const earnings = Array.isArray(employee?.earnings)
        ? employee.earnings
        : [];

    const deductions = Array.isArray(employee?.deductions)
        ? employee.deductions
        : [];

    let calculatedEarnings = [];
    let percentageEarningsTotal = 0;
    let balanceEarningIndexes = [];

    earnings.forEach((earning, index) => {
        const calculation = earning?.calculation || "";
        const value = Number(earning?.value) || 0;

        if (calculation === "Percentage") {
            const amount = monthlyCtc * (value / 100);

            percentageEarningsTotal += amount;

            calculatedEarnings.push({
                ...earning,
                amount,
            });
        } else if (calculation === "Fixed Amount") {
            calculatedEarnings.push({
                ...earning,
                amount: value,
            });
        } else if (calculation === "Balance") {
            balanceEarningIndexes.push(index);

            calculatedEarnings.push({
                ...earning,
                amount: 0,
            });
        } else {
            calculatedEarnings.push({
                ...earning,
                amount: 0,
            });
        }
    });

    const balanceAmount = Math.max(
        monthlyCtc - percentageEarningsTotal,
        0
    );

    if (balanceEarningIndexes.length > 0) {
        const amountPerBalance =
            balanceAmount / balanceEarningIndexes.length;

        balanceEarningIndexes.forEach((index) => {
            calculatedEarnings[index].amount = amountPerBalance;
        });
    }

    const grossSalary = calculatedEarnings.reduce(
        (total, earning) => total + Number(earning.amount || 0),
        0
    );

    const calculatedDeductions = deductions.map((deduction) => {
        const calculation = deduction?.calculation || "";
        const value = Number(deduction?.value) || 0;

        let amount = 0;

        if (calculation === "Percentage") {
            amount = monthlyCtc * (value / 100);
        }

        if (calculation === "Fixed Amount") {
            amount = value;
        }

        return {
            ...deduction,
            amount,
        };
    });

    const totalDeductions = calculatedDeductions.reduce(
        (total, deduction) => total + Number(deduction.amount || 0),
        0
    );

    const netSalary = Math.max(
        grossSalary - totalDeductions,
        0
    );

    return {
        ...employee,
        earnings: calculatedEarnings,
        deductions: calculatedDeductions,
        grossSalary,
        totalDeductions,
        netSalary,
    };
};


/* =========================================================
   COMPONENT
========================================================= */

const PayrollProcess = () => {
    const [selectedMonth, setSelectedMonth] = useState("August 2026");

    const [selectedEmployeeId, setSelectedEmployeeId] = useState(
        employeesData[0]?.employeeId
    );

    const [runDialogOpen, setRunDialogOpen] = useState(false);

    const [payrollProcessed, setPayrollProcessed] = useState(false);


    /* =====================================================
       CALCULATED EMPLOYEES
    ===================================================== */

    const employees = useMemo(() => {
        return employeesData.map((employee) =>
            calculateEmployee(employee)
        );
    }, []);


    const selectedEmployee = useMemo(() => {
        return (
            employees.find(
                (employee) =>
                    employee.employeeId === selectedEmployeeId
            ) || employees[0]
        );
    }, [employees, selectedEmployeeId]);


    const totals = useMemo(() => {
        return employees.reduce(
            (result, employee) => {
                result.grossSalary += employee.grossSalary;
                result.totalDeductions += employee.totalDeductions;
                result.netSalary += employee.netSalary;

                return result;
            },
            {
                grossSalary: 0,
                totalDeductions: 0,
                netSalary: 0,
            }
        );
    }, [employees]);


    /* =====================================================
       PAYROLL PERIOD
    ===================================================== */

    const processingPeriod = useMemo(() => {
        if (selectedMonth === "August 2026") {
            return "01 Aug 2026 - 31 Aug 2026";
        }

        if (selectedMonth === "September 2026") {
            return "01 Sep 2026 - 30 Sep 2026";
        }

        if (selectedMonth === "October 2026") {
            return "01 Oct 2026 - 31 Oct 2026";
        }

        return selectedMonth;
    }, [selectedMonth]);


    /* =====================================================
       HANDLERS
    ===================================================== */

    const handleBack = () => {
        window.history.back();
    };


    const handleRunPayroll = () => {
        setRunDialogOpen(false);
        setPayrollProcessed(true);
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box className="payroll-process-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <Box className="payroll-process-header">

                <Box className="payroll-title-area">

                    <IconButton
                        className="payroll-back-button"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Box>
                        <Typography className="payroll-process-title">
                            Payroll Process
                        </Typography>

                        <Typography className="payroll-process-subtitle">
                            Calculate and process employee salaries using
                            assigned payslip templates.
                        </Typography>
                    </Box>

                </Box>


                <Stack
                    className="payroll-header-actions"
                    direction="row"
                    spacing={1.5}
                >

                    <FormControl
                        size="small"
                        className="payroll-month-select"
                    >
                        <InputLabel id="payroll-month-label">
                            Payroll Month
                        </InputLabel>

                        <Select
                            labelId="payroll-month-label"
                            value={selectedMonth}
                            label="Payroll Month"
                            onChange={(event) =>
                                setSelectedMonth(event.target.value)
                            }
                        >
                            <MenuItem value="August 2026">
                                August 2026
                            </MenuItem>

                            <MenuItem value="September 2026">
                                September 2026
                            </MenuItem>

                            <MenuItem value="October 2026">
                                October 2026
                            </MenuItem>
                        </Select>
                    </FormControl>


                    <Button
                        className="run-payroll-button"
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => setRunDialogOpen(true)}
                    >
                        Run Payroll
                    </Button>

                </Stack>

            </Box>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <Box className="payroll-summary-grid">

                <Card className="payroll-summary-card">
                    <CardContent>

                        <Box className="summary-card-content">

                            <Box>
                                <Typography className="summary-label">
                                    Employees
                                </Typography>

                                <Typography className="summary-value">
                                    {employees.length}
                                </Typography>

                                <Typography className="summary-helper">
                                    Employees to process
                                </Typography>
                            </Box>

                            <Box className="summary-icon summary-icon-blue">
                                <PeopleIcon />
                            </Box>

                        </Box>

                    </CardContent>
                </Card>


                <Card className="payroll-summary-card">
                    <CardContent>

                        <Box className="summary-card-content">

                            <Box>
                                <Typography className="summary-label">
                                    Gross Salary
                                </Typography>

                                <Typography className="summary-value">
                                    {formatCurrency(totals.grossSalary)}
                                </Typography>

                                <Typography className="summary-helper">
                                    Calculated from templates
                                </Typography>
                            </Box>

                            <Box className="summary-icon summary-icon-green">
                                <AccountBalanceWalletIcon />
                            </Box>

                        </Box>

                    </CardContent>
                </Card>


                <Card className="payroll-summary-card">
                    <CardContent>

                        <Box className="summary-card-content">

                            <Box>
                                <Typography className="summary-label">
                                    Total Deductions
                                </Typography>

                                <Typography className="summary-value deduction-value">
                                    {formatCurrency(
                                        totals.totalDeductions
                                    )}
                                </Typography>

                                <Typography className="summary-helper">
                                    PF, tax and other deductions
                                </Typography>
                            </Box>

                            <Box className="summary-icon summary-icon-orange">
                                <ReceiptLongIcon />
                            </Box>

                        </Box>

                    </CardContent>
                </Card>


                <Card className="payroll-summary-card">
                    <CardContent>

                        <Box className="summary-card-content">

                            <Box>
                                <Typography className="summary-label">
                                    Net Salary
                                </Typography>

                                <Typography className="summary-value net-value">
                                    {formatCurrency(totals.netSalary)}
                                </Typography>

                                <Typography className="summary-helper">
                                    Total amount payable
                                </Typography>
                            </Box>

                            <Box className="summary-icon summary-icon-purple">
                                <TrendingUpIcon />
                            </Box>

                        </Box>

                    </CardContent>
                </Card>

            </Box>


            {/* =================================================
                PAYROLL CONFIGURATION
            ================================================= */}

            <Card className="process-card">

                <CardContent>

                    <Box className="section-header">

                        <Box>
                            <Typography className="section-title">
                                Payroll Configuration
                            </Typography>

                            <Typography className="section-subtitle">
                                Review the payroll period before processing.
                            </Typography>
                        </Box>

                        <Chip
                            className={
                                payrollProcessed
                                    ? "status-chip status-completed"
                                    : "status-chip status-ready"
                            }
                            label={
                                payrollProcessed
                                    ? "Processed"
                                    : "Ready"
                            }
                            size="small"
                        />

                    </Box>


                    <Box className="configuration-grid">

                        <Box className="configuration-box">

                            <Typography className="configuration-label">
                                Payroll Month
                            </Typography>

                            <Typography className="configuration-value">
                                {selectedMonth}
                            </Typography>

                        </Box>


                        <Box className="configuration-box">

                            <Typography className="configuration-label">
                                Payroll Period
                            </Typography>

                            <Typography className="configuration-value">
                                Monthly
                            </Typography>

                        </Box>


                        <Box className="configuration-box configuration-box-wide">

                            <Typography className="configuration-label">
                                Processing Period
                            </Typography>

                            <Typography className="configuration-value">
                                {processingPeriod}
                            </Typography>

                        </Box>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================================
                EMPLOYEE PAYROLL TABLE
            ================================================= */}

            <Card className="process-card">

                <CardContent>

                    <Box className="section-header">

                        <Box>
                            <Typography className="section-title">
                                Employee Payroll
                            </Typography>

                            <Typography className="section-subtitle">
                                Salary is automatically calculated using
                                each employee's assigned payslip template.
                            </Typography>
                        </Box>

                        <Typography className="employee-count">
                            {employees.length} Employees
                        </Typography>

                    </Box>


                    <TableContainer className="payroll-table-container">

                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell>
                                        Employee
                                    </TableCell>

                                    <TableCell>
                                        Payslip Template
                                    </TableCell>

                                    <TableCell align="right">
                                        Annual CTC
                                    </TableCell>

                                    <TableCell align="right">
                                        Gross Salary
                                    </TableCell>

                                    <TableCell align="right">
                                        Deductions
                                    </TableCell>

                                    <TableCell align="right">
                                        Net Salary
                                    </TableCell>

                                    <TableCell align="center">
                                        Status
                                    </TableCell>

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {employees.map((employee) => (

                                    <TableRow
                                        key={employee.employeeId}
                                        className={
                                            selectedEmployeeId ===
                                            employee.employeeId
                                                ? "selected-payroll-row"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedEmployeeId(
                                                employee.employeeId
                                            )
                                        }
                                    >

                                        <TableCell>

                                            <Typography className="employee-name">
                                                {employee.name}
                                            </Typography>

                                            <Typography className="employee-meta">
                                                {employee.employeeId} •{" "}
                                                {employee.department}
                                            </Typography>

                                        </TableCell>


                                        <TableCell>

                                            <Box className="template-cell">

                                                <Box className="template-icon">
                                                    <DescriptionIcon />
                                                </Box>

                                                <Box>

                                                    <Typography className="template-name">
                                                        {
                                                            employee.templateName
                                                        }
                                                    </Typography>

                                                    <Typography className="template-helper">
                                                        Applied automatically
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </TableCell>


                                        <TableCell align="right">

                                            <Typography className="money-primary">
                                                {
                                                    formatCurrency(
                                                        employee.annualCtc
                                                    )
                                                }
                                            </Typography>

                                            <Typography className="money-secondary">
                                                {
                                                    formatCurrency(
                                                        employee.monthlyCtc
                                                    )
                                                }{" "}
                                                / month
                                            </Typography>

                                        </TableCell>


                                        <TableCell align="right">

                                            <Typography className="money-primary">
                                                {
                                                    formatCurrency(
                                                        employee.grossSalary
                                                    )
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell align="right">

                                            <Typography className="deduction-table-value">
                                                -
                                                {formatCurrency(
                                                    employee.totalDeductions
                                                )}
                                            </Typography>

                                        </TableCell>


                                        <TableCell align="right">

                                            <Typography className="net-table-value">
                                                {
                                                    formatCurrency(
                                                        employee.netSalary
                                                    )
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell align="center">

                                            <Chip
                                                className={
                                                    payrollProcessed
                                                        ? "employee-status-chip completed"
                                                        : "employee-status-chip"
                                                }
                                                size="small"
                                                icon={
                                                    payrollProcessed ? (
                                                        <CheckCircleIcon />
                                                    ) : undefined
                                                }
                                                label={
                                                    payrollProcessed
                                                        ? "Processed"
                                                        : "Ready"
                                                }
                                            />

                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    </TableContainer>

                </CardContent>

            </Card>


            {/* =================================================
                SALARY CALCULATION
            ================================================= */}

            {selectedEmployee && (

                <Card className="process-card salary-calculation-card">

                    <CardContent>

                        <Box className="section-header">

                            <Box>

                                <Typography className="section-title">
                                    Salary Calculation
                                </Typography>

                                <Typography className="section-subtitle">
                                    Calculation for the selected employee
                                    based on their assigned template.
                                </Typography>

                            </Box>


                            <Chip
                                className="template-chip"
                                icon={<DescriptionIcon />}
                                label={
                                    selectedEmployee.templateName
                                }
                            />

                        </Box>


                        {/* Employee information */}

                        <Box className="selected-employee-card">

                            <Box className="selected-employee-avatar">
                                {selectedEmployee.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </Box>

                            <Box>

                                <Typography className="selected-employee-name">
                                    {selectedEmployee.name}
                                </Typography>

                                <Typography className="selected-employee-meta">
                                    {selectedEmployee.employeeId} •{" "}
                                    {selectedEmployee.department}
                                </Typography>

                            </Box>


                            <Box className="selected-employee-ctc">

                                <Typography className="ctc-label">
                                    Annual CTC
                                </Typography>

                                <Typography className="ctc-value">
                                    {
                                        formatCurrency(
                                            selectedEmployee.annualCtc
                                        )
                                    }
                                </Typography>

                            </Box>

                        </Box>


                        <Box className="calculation-grid">

                            {/* Earnings */}

                            <Box className="calculation-section">

                                <Typography className="calculation-section-title">
                                    Earnings
                                </Typography>

                                <Typography className="calculation-section-helper">
                                    Salary components from the assigned
                                    payslip template.
                                </Typography>


                                <Box className="calculation-list">

                                    {Array.isArray(
                                        selectedEmployee.earnings
                                    ) &&
                                        selectedEmployee.earnings.map(
                                            (earning, index) => (

                                                <Box
                                                    className="calculation-row"
                                                    key={`${earning.name}-${index}`}
                                                >

                                                    <Box>

                                                        <Typography className="calculation-component">
                                                            {earning.name}
                                                        </Typography>

                                                        <Typography className="calculation-rule">
                                                            {
                                                                earning.calculation
                                                            }

                                                            {earning.calculation ===
                                                                "Percentage" &&
                                                                ` • ${earning.value}%`}
                                                        </Typography>

                                                    </Box>

                                                    <Typography className="calculation-amount">
                                                        {
                                                            formatCurrency(
                                                                earning.amount
                                                            )
                                                        }
                                                    </Typography>

                                                </Box>

                                            )
                                        )}

                                </Box>


                                <Divider className="calculation-divider" />


                                <Box className="calculation-total-row">

                                    <Typography>
                                        Gross Salary
                                    </Typography>

                                    <Typography>
                                        {
                                            formatCurrency(
                                                selectedEmployee.grossSalary
                                            )
                                        }
                                    </Typography>

                                </Box>

                            </Box>


                            {/* Deductions */}

                            <Box className="calculation-section">

                                <Typography className="calculation-section-title">
                                    Deductions
                                </Typography>

                                <Typography className="calculation-section-helper">
                                    Deductions applied from the assigned
                                    template.
                                </Typography>


                                <Box className="calculation-list">

                                    {Array.isArray(
                                        selectedEmployee.deductions
                                    ) &&
                                        selectedEmployee.deductions.map(
                                            (deduction, index) => (

                                                <Box
                                                    className="calculation-row"
                                                    key={`${deduction.name}-${index}`}
                                                >

                                                    <Box>

                                                        <Typography className="calculation-component">
                                                            {deduction.name}
                                                        </Typography>

                                                        <Typography className="calculation-rule">
                                                            {
                                                                deduction.calculation
                                                            }

                                                            {deduction.calculation ===
                                                                "Percentage" &&
                                                                ` • ${deduction.value}%`}
                                                        </Typography>

                                                    </Box>

                                                    <Typography className="calculation-amount deduction-text">
                                                        -
                                                        {
                                                            formatCurrency(
                                                                deduction.amount
                                                            )
                                                        }
                                                    </Typography>

                                                </Box>

                                            )
                                        )}

                                </Box>


                                <Divider className="calculation-divider" />


                                <Box className="calculation-total-row">

                                    <Typography>
                                        Total Deductions
                                    </Typography>

                                    <Typography className="deduction-text">
                                        -
                                        {
                                            formatCurrency(
                                                selectedEmployee.totalDeductions
                                            )
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </Box>


                        {/* Net salary */}

                        <Box className="net-salary-panel">

                            <Box>

                                <Typography className="net-salary-label">
                                    Net Salary
                                </Typography>

                                <Typography className="net-salary-helper">
                                    Gross salary minus total deductions
                                </Typography>

                            </Box>


                            <Typography className="net-salary-amount">
                                {
                                    formatCurrency(
                                        selectedEmployee.netSalary
                                    )
                                }
                            </Typography>

                        </Box>


                        <Box className="calculation-info">

                            <InfoOutlinedIcon />

                            <Typography>
                                Salary values are calculated from the
                                employee's assigned payslip template.
                                Attendance, leave, tax and other payroll
                                adjustments can be applied during payroll
                                processing.
                            </Typography>

                        </Box>

                    </CardContent>

                </Card>

            )}


            {/* =================================================
                RUN PAYROLL DIALOG
            ================================================= */}

            <Dialog
                open={runDialogOpen}
                onClose={() => setRunDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Run Payroll
                </DialogTitle>

                <DialogContent>

                    <Box className="dialog-content">

                        <Box className="dialog-icon">
                            <CalendarTodayIcon />
                        </Box>

                        <Typography className="dialog-title">
                            Process {selectedMonth} Payroll?
                        </Typography>

                        <Typography className="dialog-description">
                            The system will calculate payroll for all
                            employees using their currently assigned
                            payslip templates.
                        </Typography>


                        <Box className="dialog-summary">

                            <Box className="dialog-summary-row">
                                <Typography>
                                    Employees
                                </Typography>

                                <Typography>
                                    {employees.length}
                                </Typography>
                            </Box>


                            <Box className="dialog-summary-row">
                                <Typography>
                                    Gross Salary
                                </Typography>

                                <Typography>
                                    {
                                        formatCurrency(
                                            totals.grossSalary
                                        )
                                    }
                                </Typography>
                            </Box>


                            <Box className="dialog-summary-row">
                                <Typography>
                                    Total Deductions
                                </Typography>

                                <Typography className="deduction-text">
                                    {
                                        formatCurrency(
                                            totals.totalDeductions
                                        )
                                    }
                                </Typography>
                            </Box>


                            <Divider />


                            <Box className="dialog-summary-row dialog-total">

                                <Typography>
                                    Net Salary
                                </Typography>

                                <Typography>
                                    {
                                        formatCurrency(
                                            totals.netSalary
                                        )
                                    }
                                </Typography>

                            </Box>

                        </Box>

                    </Box>

                </DialogContent>


                <DialogActions className="dialog-actions">

                    <Button
                        onClick={() => setRunDialogOpen(false)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleRunPayroll}
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                    >
                        Run Payroll
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};


export default PayrollProcess;