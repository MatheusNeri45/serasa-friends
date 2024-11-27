"use client";
import { useState, useEffect, Fragment } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SplitPayButton from "../expenseSplitPayButton/splitPayButton";
import { Expense, SplitExpense } from "@prisma/client";
import EditExpenseForms from "../editExpenseForms/editExpenseForms";

interface extendedExpense extends Expense {
  paidBy: { name: string; id: number };
}

interface extendedExpenseSplits extends SplitExpense {
  participant: { name: string; id: number };
}

interface expenseListProps {
  selectedExpense: extendedExpense;
  onExpenseUpdated: () => void;
  payer: number;
  editing: boolean;
  onChangeEditing: ()=>void;
}

export default function SplitExpensesList({
  selectedExpense,
  onExpenseUpdated,
  editing,
  onChangeEditing
}: expenseListProps) {
  const [selectedExpenseSplits, setSelectedExpenseSplits] = useState<
    extendedExpenseSplits[]
  >([]);

  const fetchSplitExpenses = async () => {
    const res = await fetch("/api/getExpenseSplits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: selectedExpense.id }),
    });
    const response = await res.json();
    const splitExpenses = response.splitExpenseList;
    setSelectedExpenseSplits(splitExpenses);
    onExpenseUpdated()
  };
  useEffect(() => {
    fetchSplitExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      
      {editing ? (
        <EditExpenseForms
          onExpenseEdited={() => fetchSplitExpenses()}
          selectedExpense={selectedExpense}
          selectedExpenseSplits={selectedExpenseSplits}
          onChangeEditing={()=>onChangeEditing()}
          editing={editing}
        />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
          <Table sx={{ maxWidth: 600 }} aria-label="simple table">
            <TableBody>
              {selectedExpenseSplits
                .filter((expenseSplit: extendedExpenseSplits) => {
                  return expenseSplit.participantId !== selectedExpense.paidBy.id;
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
                        onSplitPaid={() => fetchSplitExpenses()}
                      ></SplitPayButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
}
