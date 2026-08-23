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
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./PayrollHistory.css";

const payrollHistoryData = [
    {
        id: 1,
        month: "August 2026",
        period: "01 Aug 2026 - 31 Aug 2026",
        employees: 3,
        grossSalary: 600000,
        totalDeductions: 54600,
        netSalary: 545400,
        processedDate: "31 Aug 2026",
        processedBy: "Hamza",
        status: "Completed",
    },
    {
        id: 2,
        month: "July 2026",
        period: "01 Jul 2026 - 31 Jul 2026",
        employees: 3,
        grossSalary: 600000,
        totalDeductions: 54600,
        netSalary: 545400,
        processedDate: "31 Jul 2026",
        processedBy: "Hamza",
        status: "Completed",
    },
    {
        id: 3,
        month: "June 2026",
        period: "01 Jun 2026 - 30 Jun 2026",
        employees: 3,
        grossSalary: 600000,
        totalDeductions: 54600,
        netSalary: 545400,
        processedDate: "30 Jun 2026",
        processedBy: "Hamza",
        status: "Completed",
    },
    {
        id: 4,
        month: "May 2026",
        period: "01 May 2026 - 31 May 2026",
        employees: 3,
        grossSalary: 600000,
        totalDeductions: 54600,
        netSalary: 545400,
        processedDate: "31 May 2026",
        processedBy: "Hamza",
        status: "Completed",
    },
];

const employeePayrollData = [
    {
        employeeName: "Ayesha Khan",
        employeeId: "2020025",
        department: "IT",
        template: "Standard Employee",
        grossSalary: 200000,
        deductions: 24200,
        netSalary: 175800,
    },
    {
        employeeName: "Hamza Raj Mohammed",
        employeeId: "2020022",
        department: "Administration",
        template: "Executive Payslip",
        grossSalary: 250000,
        deductions: 30200,
        netSalary: 219800,
    },
    {
        employeeName: "John",
        employeeId: "2020031",
        department: "Operations",
        template: "Contract Employee",
        grossSalary: 150000,
        deductions: 200,
        netSalary: 149800,
    },
];

const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const PayrollHistory = ({ onBack }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");
    const [selectedPayroll, setSelectedPayroll] = useState(null);

    const months = useMemo(() => {
        return [
            "All",
            ...new Set(payrollHistoryData.map((item) => item.month)),
        ];
    }, []);

    const filteredPayrolls = useMemo(() => {
        return payrollHistoryData.filter((payroll) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                payroll.month.toLowerCase().includes(searchValue) ||
                payroll.period.toLowerCase().includes(searchValue) ||
                payroll.processedBy.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                payroll.status === statusFilter;

            const matchesMonth =
                monthFilter === "All" ||
                payroll.month === monthFilter;

            return matchesSearch && matchesStatus && matchesMonth;
        });
    }, [search, statusFilter, monthFilter]);

    const totalRuns = payrollHistoryData.length;

    const totalEmployees = payrollHistoryData.reduce(
        (total, payroll) => total + payroll.employees,
        0
    );

    const latestPayroll = payrollHistoryData[0];

    const handleCloseDialog = () => {
        setSelectedPayroll(null);
    };

    const handleDownloadReport = () => {
        if (!selectedPayroll) {
            return;
        }

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const payroll = selectedPayroll;

        const formatPdfCurrency = (amount) => {
            return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
        };

        /* ================= HEADER ================= */

        doc.setTextColor(23, 32, 51);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SPARK", 20, 22);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("ERP & HR Management System", 20, 29);

        doc.setDrawColor(226, 232, 240);
        doc.line(20, 36, 190, 36);

        doc.setTextColor(23, 32, 51);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Payroll Report", 20, 49);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Payroll Month: ${payroll.month}`, 20, 57);
        doc.text(`Processing Period: ${payroll.period}`, 20, 63);

        /* ================= PAYROLL SUMMARY ================= */

        doc.setTextColor(23, 32, 51);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Payroll Summary", 20, 77);

        autoTable(doc, {
            startY: 83,
            theme: "grid",
            head: [["Component", "Value"]],
            body: [
                ["Employees Processed", String(payroll.employees)],
                ["Gross Salary", formatPdfCurrency(payroll.grossSalary)],
                ["Total Deductions", `- ${formatPdfCurrency(payroll.totalDeductions)}`],
                ["Net Salary", formatPdfCurrency(payroll.netSalary)],
                ["Processed Date", payroll.processedDate],
                ["Processed By", payroll.processedBy],
                ["Status", payroll.status],
            ],
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 5,
                textColor: [71, 85, 105],
            },
            headStyles: {
                fillColor: [248, 250, 252],
                textColor: [71, 85, 105],
                fontStyle: "bold",
            },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 100 },
            },
        });

        /* ================= EMPLOYEE PAYROLL ================= */

        const employeeTableStart =
            (doc.lastAutoTable?.finalY || 83) + 14;

        doc.setTextColor(23, 32, 51);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Employee Payroll", 20, employeeTableStart);

        const employeeRows = employeePayrollData.map((employee) => [
            `${employee.employeeName}\n${employee.employeeId} • ${employee.department}`,
            employee.template,
            formatPdfCurrency(employee.grossSalary),
            `- ${formatPdfCurrency(employee.deductions)}`,
            formatPdfCurrency(employee.netSalary),
        ]);

        autoTable(doc, {
            startY: employeeTableStart + 6,
            theme: "grid",
            head: [["Employee", "Payslip Template", "Gross", "Deductions", "Net Salary"]],
            body: employeeRows,
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 4,
                textColor: [71, 85, 105],
                valign: "middle",
            },
            headStyles: {
                fillColor: [248, 250, 252],
                textColor: [71, 85, 105],
                fontStyle: "bold",
            },
            columnStyles: {
                0: { cellWidth: 48 },
                1: { cellWidth: 40 },
                2: { cellWidth: 28, halign: "right" },
                3: { cellWidth: 30, halign: "right" },
                4: { cellWidth: 30, halign: "right" },
            },
        });

        /* ================= FOOTER ================= */

        const pageCount = doc.getNumberOfPages();

        for (let page = 1; page <= pageCount; page += 1) {
            doc.setPage(page);

            const pageHeight = doc.internal.pageSize.height;

            doc.setDrawColor(226, 232, 240);
            doc.line(20, pageHeight - 20, 190, pageHeight - 20);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);

            doc.text(
                "This is a system-generated payroll report.",
                20,
                pageHeight - 13
            );

            doc.text(
                `Page ${page} of ${pageCount}`,
                190,
                pageHeight - 13,
                { align: "right" }
            );
        }

        const safeMonth = String(payroll.month || "Payroll")
            .replace(/[^a-z0-9]+/gi, "_")
            .replace(/^_+|_+$/g, "");

        doc.save(`Payroll_Report_${safeMonth}.pdf`);
    };

    return (
        <Box className="payroll-history-page">

            {/* ================= HEADER ================= */}

            <Box className="payroll-history-header">

                <Box className="payroll-history-title-section">

                    <IconButton
                        className="payroll-history-back-button"
                        onClick={onBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Box>
                        <Typography className="payroll-history-title">
                            Payroll History
                        </Typography>

                        <Typography className="payroll-history-subtitle">
                            View payroll run history, records and details.
                        </Typography>
                    </Box>

                </Box>

            </Box>


            {/* ================= SUMMARY ================= */}

            <Grid
                container
                spacing={2}
                className="payroll-history-summary-grid"
            >

                <Grid item xs={12} sm={6} md={3}>
                    <Card className="history-summary-card">
                        <CardContent>

                            <Box className="history-summary-top">

                                <Box>
                                    <Typography className="history-summary-label">
                                        Payroll Runs
                                    </Typography>

                                    <Typography className="history-summary-value">
                                        {totalRuns}
                                    </Typography>

                                    <Typography className="history-summary-helper">
                                        Total processed runs
                                    </Typography>
                                </Box>

                                <Box className="history-summary-icon history-icon-blue">
                                    <HistoryIcon />
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} sm={6} md={3}>
                    <Card className="history-summary-card">
                        <CardContent>

                            <Box className="history-summary-top">

                                <Box>
                                    <Typography className="history-summary-label">
                                        Employees Processed
                                    </Typography>

                                    <Typography className="history-summary-value">
                                        {totalEmployees}
                                    </Typography>

                                    <Typography className="history-summary-helper">
                                        Across payroll runs
                                    </Typography>
                                </Box>

                                <Box className="history-summary-icon history-icon-green">
                                    <PeopleIcon />
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} sm={6} md={3}>
                    <Card className="history-summary-card">
                        <CardContent>

                            <Box className="history-summary-top">

                                <Box>
                                    <Typography className="history-summary-label">
                                        Latest Gross Salary
                                    </Typography>

                                    <Typography className="history-summary-value">
                                        {formatCurrency(latestPayroll.grossSalary)}
                                    </Typography>

                                    <Typography className="history-summary-helper">
                                        {latestPayroll.month}
                                    </Typography>
                                </Box>

                                <Box className="history-summary-icon history-icon-orange">
                                    <PaymentsIcon />
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} sm={6} md={3}>
                    <Card className="history-summary-card">
                        <CardContent>

                            <Box className="history-summary-top">

                                <Box>
                                    <Typography className="history-summary-label">
                                        Latest Net Salary
                                    </Typography>

                                    <Typography className="history-summary-value history-net-value">
                                        {formatCurrency(latestPayroll.netSalary)}
                                    </Typography>

                                    <Typography className="history-summary-helper">
                                        Amount paid
                                    </Typography>
                                </Box>

                                <Box className="history-summary-icon history-icon-purple">
                                    <CheckCircleIcon />
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>

            </Grid>


            {/* ================= HISTORY CARD ================= */}

            <Card className="payroll-history-card">

                <CardContent>

                    <Box className="history-section-header">

                        <Box>
                            <Typography className="history-section-title">
                                Payroll Runs
                            </Typography>

                            <Typography className="history-section-subtitle">
                                Review previously processed payroll records.
                            </Typography>
                        </Box>

                        <Typography className="history-count">
                            {filteredPayrolls.length} Records
                        </Typography>

                    </Box>


                    {/* ================= FILTERS ================= */}

                    <Box className="history-filters">

                        <TextField
                            className="history-search"
                            placeholder="Search payroll..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />


                        <FormControl
                            size="small"
                            className="history-filter-select"
                        >
                            <Select
                                value={monthFilter}
                                onChange={(event) =>
                                    setMonthFilter(event.target.value)
                                }
                                displayEmpty
                                startAdornment={
                                    <CalendarMonthIcon className="select-icon" />
                                }
                            >
                                {months.map((month) => (
                                    <MenuItem
                                        key={month}
                                        value={month}
                                    >
                                        {month === "All"
                                            ? "All Months"
                                            : month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <FormControl
                            size="small"
                            className="history-filter-select"
                        >
                            <Select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <MenuItem value="All">
                                    All Status
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Processing">
                                    Processing
                                </MenuItem>
                            </Select>
                        </FormControl>

                    </Box>


                    {/* ================= TABLE ================= */}

                    <Box className="payroll-history-table-wrapper">

                        <table className="payroll-history-table">

                            <thead>
                                <tr>
                                    <th>Payroll Month</th>
                                    <th>Processing Period</th>
                                    <th>Employees</th>
                                    <th>Gross Salary</th>
                                    <th>Deductions</th>
                                    <th>Net Salary</th>
                                    <th>Processed Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredPayrolls.length > 0 ? (
                                    filteredPayrolls.map((payroll) => (

                                        <tr key={payroll.id}>

                                            <td>
                                                <Box className="history-month-cell">

                                                    <Box className="history-month-icon">
                                                        <DescriptionIcon />
                                                    </Box>

                                                    <Box>
                                                        <Typography className="history-month">
                                                            {payroll.month}
                                                        </Typography>

                                                        <Typography className="history-period">
                                                            Monthly Payroll
                                                        </Typography>
                                                    </Box>

                                                </Box>
                                            </td>


                                            <td>
                                                <Typography className="history-body-text">
                                                    {payroll.period}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Typography className="history-body-strong">
                                                    {payroll.employees}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Typography className="history-body-strong">
                                                    {formatCurrency(
                                                        payroll.grossSalary
                                                    )}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Typography className="history-deduction">
                                                    -{formatCurrency(
                                                        payroll.totalDeductions
                                                    )}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Typography className="history-net">
                                                    {formatCurrency(
                                                        payroll.netSalary
                                                    )}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Typography className="history-body-text">
                                                    {payroll.processedDate}
                                                </Typography>

                                                <Typography className="history-processed-by">
                                                    By {payroll.processedBy}
                                                </Typography>
                                            </td>


                                            <td>
                                                <Chip
                                                    icon={<CheckCircleIcon />}
                                                    label={payroll.status}
                                                    size="small"
                                                    className="history-completed-chip"
                                                />
                                            </td>


                                            <td>

                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    className="history-view-button"
                                                    onClick={() =>
                                                        setSelectedPayroll(
                                                            payroll
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                            </td>

                                        </tr>

                                    ))
                                ) : (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="history-empty-cell"
                                        >
                                            <HistoryIcon />

                                            <Typography>
                                                No payroll records found.
                                            </Typography>
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </Box>

                </CardContent>

            </Card>


            {/* ================= VIEW PAYROLL DIALOG ================= */}

            <Dialog
                open={Boolean(selectedPayroll)}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
            >

                {selectedPayroll && (
                    <>
                        <DialogTitle className="history-dialog-title">

                            <Box>
                                <Typography className="history-dialog-heading">
                                    Payroll Details
                                </Typography>

                                <Typography className="history-dialog-subtitle">
                                    {selectedPayroll.month} Payroll
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={handleCloseDialog}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>

                        </DialogTitle>


                        <DialogContent>

                            {/* Payroll summary */}

                            <Grid
                                container
                                spacing={2}
                                className="dialog-summary-grid"
                            >

                                <Grid item xs={12} sm={4}>
                                    <Box className="dialog-summary-item">
                                        <Typography>
                                            Employees
                                        </Typography>

                                        <strong>
                                            {selectedPayroll.employees}
                                        </strong>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box className="dialog-summary-item">
                                        <Typography>
                                            Gross Salary
                                        </Typography>

                                        <strong>
                                            {formatCurrency(
                                                selectedPayroll.grossSalary
                                            )}
                                        </strong>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box className="dialog-summary-item">
                                        <Typography>
                                            Net Salary
                                        </Typography>

                                        <strong className="dialog-net">
                                            {formatCurrency(
                                                selectedPayroll.netSalary
                                            )}
                                        </strong>
                                    </Box>
                                </Grid>

                            </Grid>


                            <Divider className="dialog-divider" />


                            {/* Employee payroll */}

                            <Typography className="dialog-employees-title">
                                Employee Payroll
                            </Typography>

                            <Box className="dialog-employee-table-wrapper">

                                <table className="dialog-employee-table">

                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Payslip Template</th>
                                            <th>Gross</th>
                                            <th>Deductions</th>
                                            <th>Net Salary</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {employeePayrollData.map(
                                            (employee) => (

                                                <tr
                                                    key={
                                                        employee.employeeId
                                                    }
                                                >

                                                    <td>
                                                        <Typography className="dialog-employee-name">
                                                            {
                                                                employee.employeeName
                                                            }
                                                        </Typography>

                                                        <Typography className="dialog-employee-meta">
                                                            {
                                                                employee.employeeId
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                employee.department
                                                            }
                                                        </Typography>
                                                    </td>

                                                    <td>
                                                        <Typography className="dialog-template">
                                                            {
                                                                employee.template
                                                            }
                                                        </Typography>
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            employee.grossSalary
                                                        )}
                                                    </td>

                                                    <td className="dialog-deduction">
                                                        -
                                                        {formatCurrency(
                                                            employee.deductions
                                                        )}
                                                    </td>

                                                    <td className="dialog-net">
                                                        {formatCurrency(
                                                            employee.netSalary
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </Box>

                        </DialogContent>


                        <DialogActions className="history-dialog-actions">

                            <Button
                                onClick={handleCloseDialog}
                                variant="outlined"
                            >
                                Close
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<DescriptionIcon />}
                                className="history-download-button"
                                onClick={handleDownloadReport}
                            >
                                Download Report
                            </Button>

                        </DialogActions>

                    </>
                )}

            </Dialog>

        </Box>
    );
};

export default PayrollHistory;