// src/components/admin/UsersList.tsx
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
  Button,
} from "@mui/material";

interface IUser {
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

interface UsersListProps {
  users: IUser[];
  onToggleRole: (userId: string) => Promise<void>;
}

type SortValue = string | number | undefined;

type Order = "asc" | "desc";
type SortKey = "email" | "role" | "insights.totalAssessments" | "lastAssessmentDate";

const UsersList: React.FC<UsersListProps> = ({ users, onToggleRole }) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortKey>("email");

  if (!users.length) return <Typography>No users found</Typography>;

  const handleSort = (property: SortKey) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: SortValue = a.email;
let bValue: SortValue = b.email;
    if (orderBy === "role") {
      aValue = a.role;
      bValue = b.role;
    } else if (orderBy === "insights.totalAssessments") {
      aValue = a.insights.totalAssessments;
      bValue = b.insights.totalAssessments;
    } else if (orderBy === "lastAssessmentDate") {
      aValue = a.insights.lastAssessmentDate || "";
      bValue = b.insights.lastAssessmentDate || "";
    }
    if (order === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        All Users
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
                  active={orderBy === "role"}
                  direction={orderBy === "role" ? order : "asc"}
                  onClick={handleSort("role")}
                >
                  Role
                </TableSortLabel>
              </TableCell>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  {user.firstName} {user.lastName} ({user.email})
                </TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "admin" ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.insights.totalAssessments}</TableCell>
                <TableCell>
                  {user.insights.lastAssessmentDate
                    ? new Date(user.insights.lastAssessmentDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.paymentStatus}
                    color={user.paymentStatus === "completed" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onToggleRole(user._id)}
                    color={user.role === "user" ? "primary" : "secondary"}
                  >
                    {user.role === "user" ? "Promote" : "Demote"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersList;