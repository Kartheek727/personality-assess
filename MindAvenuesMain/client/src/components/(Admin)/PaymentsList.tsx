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

export interface IPayment {
  _id: string;
  user: { _id: string; email: string; firstName: string; lastName: string };
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsListProps {
  payments: IPayment[];
}

type Order = "asc" | "desc";
type SortKey = "amount" | "status" | "createdAt" | "user.email";

export default function PaymentsList({ payments }: PaymentsListProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortKey>("createdAt");

  if (!payments || payments.length === 0) {
    return <Typography>No payments found</Typography>;
  }

  const handleSort = (property: SortKey) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPayments = [...payments].sort((a, b) => {
    const aValue = orderBy === "user.email" ? a.user.email : a[orderBy];
    const bValue = orderBy === "user.email" ? b.user.email : b[orderBy];
    if (order === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        All Payments
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "user.email"}
                  direction={orderBy === "user.email" ? order : "asc"}
                  onClick={handleSort("user.email")}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={handleSort("amount")}
                >
                  Amount ($)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={handleSort("createdAt")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPayments.map((payment) => (
              <TableRow key={payment._id} hover>
                <TableCell>
                  {payment.user.firstName} {payment.user.lastName} ({payment.user.email})
                </TableCell>
                <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={payment.status === "completed" ? "success" : payment.status === "pending" ? "warning" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}