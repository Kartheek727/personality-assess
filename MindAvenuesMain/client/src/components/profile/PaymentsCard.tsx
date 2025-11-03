// src/components/profile/PaymentsCard.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

interface Payment {
  _id: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface PaymentsCardProps {
  payments: Payment[];
}

const PaymentsCard: React.FC<PaymentsCardProps> = ({ payments }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #1a62a4/20" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a62a4", mb: 3 }}>
            Payment Receipts
          </Typography>
          {payments.length === 0 ? (
            <Typography sx={{ color: "#045494" }}>No payments recorded yet.</Typography>
          ) : (
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              {payments.map((payment) => (
                <Box key={payment._id} sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#1a62a4" }}>Amount: ₹{payment.amount.toFixed(2)}</Typography>
                  <Typography sx={{ color: "#045494", fontSize: "0.9rem" }}>
                    Date: {new Date(payment.createdAt).toLocaleDateString()} - Status: {payment.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentsCard;