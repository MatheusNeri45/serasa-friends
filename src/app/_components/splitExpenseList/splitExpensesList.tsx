"use client";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BasicModal from "../modal/modal";
import SplitPayButton from "../payButton/expenseSplitPayButton/splitPayButton";
import { Typography } from "@mui/material";
import { User, Expense, SplitExpense } from "@prisma/client";

interface expenseListProps {
  selectedExpense: Expense;
  setUpdateList: Function;
  setSelectedExpense: Function;
}


export default function SplitExpensesList({
  selectedExpense,
  setUpdateList,
  setSelectedExpense,
}: expenseListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExpenseSplits, setSelectedExpenseSplits] = useState<
    SplitExpense[]
  >([]);

  const fetchSplitExpenses = async (expenseId: number) => {
    const res = await fetch("/api/getExpenseSplits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: expenseId }),
    });
    const response = await res.json();
    const list = response.splitExpenseList;
    return list;
  };

  const fetchUsers = async () => {
    const res = await fetch("api/getUsers");
    const response = await res.json();
    return response.users;
  };

  useEffect(() => {
    fetchUsers().then((users) => setUsers(users));
  }, []);

  useEffect(() => {
    fetchSplitExpenses(selectedExpense.id).then((splitExpenses) => {
      setSelectedExpenseSplits(splitExpenses);
    });
  }, []);
  const onClose = async () => {
    setSelectedExpense(null);
  };

  return (
    <BasicModal onClose={onClose} open={!!selectedExpense}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Expense splits
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
        <Table sx={{ maxWidth: 600 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Debtor</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedExpenseSplits.map((expenseSplit: SplitExpense) => (
              <TableRow
                key={expenseSplit.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {expenseSplit.participant.name}
                </TableCell>
                <TableCell align="center">{expenseSplit.value}</TableCell>
                <TableCell align="center">
                  <SplitPayButton
                    splitExpense={expenseSplit}
                    setUpdateList={setUpdateList}
                  ></SplitPayButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BasicModal>
  );
}
