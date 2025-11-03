"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Chip,
} from "@mui/material";

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: "user" | "admin";
  paymentStatus: string;
  insights: {
    totalAssessments: number;
    lastAssessmentDate?: string;
  };
  completedAssessments: Array<{
    assessment: string;
    completedAt: string;
    selectedOptions: string[];
    responseReceived: string;
  }>;
}

interface PaidUsersListProps {
  paidUsers: IUser[];
}

type Order = "asc" | "desc";
type SortKey = "email" | "insights.totalAssessments" | "lastAssessmentDate";

const PaidUsersList: React.FC<PaidUsersListProps> = ({ paidUsers }) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortKey>("email");

  if (!paidUsers.length) return <Typography>No paid users found</Typography>;

  const handleSort = (property: SortKey) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedUsers = [...paidUsers].sort((a, b) => {
    // Define the type of values based on SortKey
    type SortValue = string | number | undefined;

    let aValue: SortValue = a.email;
    let bValue: SortValue = b.email;

    if (orderBy === "insights.totalAssessments") {
      aValue = a.insights.totalAssessments;
      bValue = b.insights.totalAssessments;
    } else if (orderBy === "lastAssessmentDate") {
      aValue = a.insights.lastAssessmentDate || "";
      bValue = b.insights.lastAssessmentDate || "";
    }

    if (order === "asc") {
      if (aValue === undefined || bValue === undefined) return aValue === bValue ? 0 : aValue === undefined ? 1 : -1;
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
    if (aValue === undefined || bValue === undefined) return aValue === bValue ? 0 : aValue === undefined ? -1 : 1;
    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        Paid Users
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={handleSort("email")}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "insights.totalAssessments"}
                  direction={orderBy === "insights.totalAssessments" ? order : "asc"}
                  onClick={handleSort("insights.totalAssessments")}
                >
                  Total Assessments
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "lastAssessmentDate"}
                  direction={orderBy === "lastAssessmentDate" ? order : "asc"}
                  onClick={handleSort("lastAssessmentDate")}
                >
                  Last Assessment
                </TableSortLabel>
              </TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  {user.firstName} {user.lastName} ({user.email})
                </TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.insights.totalAssessments}</TableCell>
                <TableCell>
                  {user.insights.lastAssessmentDate
                    ? new Date(user.insights.lastAssessmentDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip label={user.paymentStatus} color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaidUsersList;