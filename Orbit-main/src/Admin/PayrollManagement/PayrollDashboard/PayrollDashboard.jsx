import React from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Button,
    Select,
    MenuItem,
    LinearProgress,
} from "@mui/material";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import "./PayrollDashboard.css";

function PayrollDashboard() {
    const [month, setMonth] = React.useState("May 2026");

    const summaryCards = [
        {
            title: "Total Payroll",
            value: "₹24,85,000",
            subtitle: "+12.4% from Apr 2026",
            icon: <AccountBalanceWalletOutlinedIcon />,
            color: "blue",
            positive: true,
        },
        {
            title: "Employees Processed",
            value: "156",
            subtitle: "Active employees",
            icon: <GroupsOutlinedIcon />,
            color: "green",
        },
        {
            title: "Net Salary Paid",
            value: "₹21,66,250",
            subtitle: "87.1% of total payroll",
            icon: <TrendingUpOutlinedIcon />,
            color: "purple",
        },
        {
            title: "Total Deductions",
            value: "₹2,18,750",
            subtitle: "8.8% of total payroll",
            icon: <ReceiptLongOutlinedIcon />,
            color: "orange",
        },
    ];

    const payrollOverview = [
        {
            month: "Dec",
            value: 68,
        },
        {
            month: "Jan",
            value: 76,
        },
        {
            month: "Feb",
            value: 72,
        },
        {
            month: "Mar",
            value: 84,
        },
        {
            month: "Apr",
            value: 80,
        },
        {
            month: "May",
            value: 92,
        },
    ];

    const departments = [
        {
            name: "IT Department",
            amount: "₹9,25,000",
            percentage: 74,
        },
        {
            name: "HR Department",
            amount: "₹4,80,000",
            percentage: 52,
        },
        {
            name: "Finance Department",
            amount: "₹3,65,000",
            percentage: 40,
        },
        {
            name: "Sales Department",
            amount: "₹4,10,000",
            percentage: 45,
        },
        {
            name: "Operations",
            amount: "₹3,05,000",
            percentage: 33,
        },
    ];

    const handleRunPayroll = () => {
        console.log("Run Payroll:", month);
    };

    const handleQuickAction = (action) => {
        console.log("Quick Action:", action);
    };

    return (
        <Box className="payroll-dashboard">

            {/* =========================
                HEADER
            ========================= */}

            <Box className="payroll-dashboard-header">

                <Box>
                    <Typography className="payroll-dashboard-title">
                        Payroll Dashboard
                    </Typography>

                    <Typography className="payroll-dashboard-subtitle">
                        Monitor payroll, salaries, deductions and employee payments.
                    </Typography>
                </Box>

                <Box className="payroll-dashboard-header-actions">

                    <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="payroll-month-select"
                        size="small"
                    >
                        <MenuItem value="May 2026">
                            May 2026
                        </MenuItem>

                        <MenuItem value="April 2026">
                            April 2026
                        </MenuItem>

                        <MenuItem value="March 2026">
                            March 2026
                        </MenuItem>

                        <MenuItem value="February 2026">
                            February 2026
                        </MenuItem>
                    </Select>

                    <Button
                        className="run-payroll-button"
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleRunPayroll}
                    >
                        Run Payroll
                    </Button>

                </Box>

            </Box>


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <Grid
                container
                spacing={2.5}
                className="payroll-summary-grid"
            >

                {summaryCards.map((card) => (
                    <Grid
                        key={card.title}
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                        }}
                    >

                        <Card className="payroll-summary-card">

                            <CardContent>

                                <Box className="summary-card-top">

                                    <Box>
                                        <Typography className="summary-card-title">
                                            {card.title}
                                        </Typography>

                                        <Typography className="summary-card-value">
                                            {card.value}
                                        </Typography>

                                        <Typography
                                            className={
                                                card.positive
                                                    ? "summary-card-subtitle positive"
                                                    : "summary-card-subtitle"
                                            }
                                        >
                                            {card.subtitle}
                                        </Typography>
                                    </Box>

                                    <Box
                                        className={`summary-card-icon ${card.color}`}
                                    >
                                        {card.icon}
                                    </Box>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>
                ))}

            </Grid>


            {/* =========================
                OVERVIEW + STATUS
            ========================= */}

            <Grid
                container
                spacing={2.5}
                className="payroll-main-grid"
            >

                {/* Payroll Overview */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 8,
                    }}
                >

                    <Card className="payroll-panel">

                        <CardContent>

                            <Typography className="panel-title">
                                Payroll Overview
                            </Typography>

                            <Typography className="panel-subtitle">
                                {month} payroll breakdown
                            </Typography>

                            <Box className="payroll-chart">

                                <Box className="payroll-chart-bars">

                                    {payrollOverview.map((item) => (
                                        <Box
                                            className="payroll-chart-column"
                                            key={item.month}
                                        >

                                            <Box
                                                className="payroll-chart-bar"
                                                style={{
                                                    height: `${item.value * 2}px`,
                                                }}
                                            />

                                            <Typography className="payroll-chart-label">
                                                {item.month}
                                            </Typography>

                                        </Box>
                                    ))}

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Payroll Status */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 4,
                    }}
                >

                    <Card className="payroll-panel payroll-status-panel">

                        <CardContent>

                            <Typography className="panel-title">
                                Payroll Status
                            </Typography>

                            <Typography className="panel-subtitle">
                                Current payroll processing status
                            </Typography>


                            {/* Completed */}

                            <Box className="payroll-status-item completed">

                                <Box className="status-icon completed-icon">
                                    <TaskAltOutlinedIcon />
                                </Box>

                                <Box className="status-content">

                                    <Typography className="status-title">
                                        Payroll Completed
                                        <span>Done</span>
                                    </Typography>

                                    <Typography className="status-date">
                                        20 May 2026
                                    </Typography>

                                </Box>

                            </Box>


                            {/* Upcoming */}

                            <Box className="payroll-status-item upcoming">

                                <Box className="status-icon upcoming-icon">
                                    <PendingOutlinedIcon />
                                </Box>

                                <Box className="status-content">

                                    <Typography className="status-title">
                                        Next Payroll
                                        <span>Upcoming</span>
                                    </Typography>

                                    <Typography className="status-date">
                                        20 June 2026
                                    </Typography>

                                </Box>

                            </Box>


                            {/* Progress */}

                            <Box className="payroll-progress-section">

                                <Box className="payroll-progress-header">

                                    <Typography>
                                        Payroll completion
                                    </Typography>

                                    <Typography>
                                        100%
                                    </Typography>

                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    className="payroll-progress"
                                />

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* =========================
                DEPARTMENT + QUICK ACTIONS
            ========================= */}

            <Grid
                container
                spacing={2.5}
                className="payroll-bottom-grid"
            >

                {/* Department Payroll */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 8,
                    }}
                >

                    <Card className="payroll-panel department-panel">

                        <CardContent>

                            <Typography className="panel-title">
                                Department Payroll
                            </Typography>

                            <Typography className="panel-subtitle">
                                Payroll distribution by department
                            </Typography>


                            <Box className="department-list">

                                {departments.map((department) => (
                                    <Box
                                        className="department-item"
                                        key={department.name}
                                    >

                                        <Box className="department-header">

                                            <Typography>
                                                {department.name}
                                            </Typography>

                                            <Typography>
                                                {department.amount}
                                            </Typography>

                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={department.percentage}
                                            className="department-progress"
                                        />

                                    </Box>
                                ))}

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Quick Actions */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 4,
                    }}
                >

                    <Card className="payroll-panel quick-actions-panel">

                        <CardContent>

                            <Typography className="panel-title">
                                Quick Actions
                            </Typography>


                            <Box className="quick-actions">

                                <Button
                                    className="quick-action-button"
                                    onClick={() =>
                                        handleQuickAction("Run Payroll")
                                    }
                                    startIcon={<PlayArrowIcon />}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Run Payroll
                                </Button>


                                <Button
                                    className="quick-action-button"
                                    onClick={() =>
                                        handleQuickAction("Generate Payslips")
                                    }
                                    startIcon={<DescriptionOutlinedIcon />}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Generate Payslips
                                </Button>


                                <Button
                                    className="quick-action-button"
                                    onClick={() =>
                                        handleQuickAction("Payroll Reports")
                                    }
                                    startIcon={<AssessmentOutlinedIcon />}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Payroll Reports
                                </Button>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>
    );
}

export default PayrollDashboard; 