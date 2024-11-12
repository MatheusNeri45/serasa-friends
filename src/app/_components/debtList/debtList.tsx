"use client";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface debtItem {
  id: number;
  value: number;
  description: string,
  expenseId: number;
  participantId: number;
  updatedAt: string;
  paid: boolean;
}

export default function DebtList({userId, updateList}) {
  const [debtList, setDebtList] = useState<debtItem[]>([]);

  const fetchDebtList = async (id: number) => {
    const res = await fetch("/api/getUserDebts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    const response = await res.json();
    return response.debtList;
  };

  useEffect(() => {
    if (userId) {
      fetchDebtList(userId).then((data) => setDebtList(data));
    }
  }, [userId, updateList]);

  console.log(userId);
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
      <Table sx={{ maxWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {debtList.map((debtItem) => (
            <TableRow
              key={debtItem.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              {debtItem.description}
              </TableCell>
              <TableCell align="right">{debtItem.value}</TableCell>
              <TableCell align="right">{debtItem.paid ? "Paid" : "Not paid"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
