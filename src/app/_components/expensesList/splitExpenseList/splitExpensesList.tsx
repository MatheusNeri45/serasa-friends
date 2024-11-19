"use client";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BasicModal from "../modal/modal";
import SplitPayButton from "../payButton/expenseSplitPayButton/splitPayButton";
import { Typography } from "@mui/material";
import { User, Expense, SplitExpense } from "@prisma/client";
import DeleteExpenseButton from "../deleteExpenseButton/deleteExpenseButton";
import EditExpenseButton from "../editExpenseButton/editExpenseButton";
import EditExpenseForms from "../editExpenseButton/editExpenseForms/editExpenseForms";

interface extendedExpenseSplits extends SplitExpense {
  participant: { name: string; id: number };
}
interface expenseListProps {
  selectedExpense: Expense;
  setUpdateList: Function;
  setSelectedExpense: Function;
  payer: number|undefined;
  groupId: number;
}

export default function SplitExpensesList({
  selectedExpense,
  setUpdateList,
  setSelectedExpense,
  groupId,
  payer,
}: expenseListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExpenseSplits, setSelectedExpenseSplits] = useState<
    extendedExpenseSplits[]
  >([]);
  const [editing, setEditing] = useState<boolean>(false);

  const fetchSplitExpenses = async (expenseId: number) => {
    const res = await fetch("../api/getExpenseSplits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: expenseId }),
    });
    const response = await res.json();
    const list = response.splitExpenseList;
    return list;
  };

  const fetchUsers = async () => {
    const res = await fetch("../api/getUsers");
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
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Expense splits
        </Typography>
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <EditExpenseButton
            editing={editing}
            setEditing={setEditing}
            expenseId={selectedExpense.id}
          />
          <DeleteExpenseButton
            editing={editing}
            expenseId={selectedExpense.id}
            setUpdateList={setUpdateList}
            setSelectedExpense={setSelectedExpense}
          ></DeleteExpenseButton>
        </div>
      </span>
      {editing ? (
        <EditExpenseForms
          setUpdateList={setUpdateList}
          selectedExpense={selectedExpense}
          setSelectedExpenseSplits={setSelectedExpenseSplits}
          selectedExpenseSplits={selectedExpenseSplits}
          groupId={groupId}
          payer={payer}
          setEditing={setEditing}
        />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
          <Table sx={{ maxWidth: 600 }} aria-label="simple table">
            <TableBody>
              {selectedExpenseSplits
                .filter((expenseSplit: extendedExpenseSplits) => {
                  return expenseSplit.participantId !== payer;
                })
                .map((expenseSplit: extendedExpenseSplits) => (
                  <TableRow
                    key={expenseSplit.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {expenseSplit.participant.name}
                    </TableCell>
                    <TableCell align="center">
                      R$ {expenseSplit.value}
                    </TableCell>
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
      )}
    </BasicModal>
  );
}
