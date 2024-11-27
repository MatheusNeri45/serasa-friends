"use client";
import { useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ExpensePayButton from "../../expensePage/expensePayButton/expensePayButton";
import { Expense } from "@prisma/client";
import ProgressBar from "../../expensePage/paymentProgressBar/paymentProgressBar";

interface extendedExpense extends Expense {
  paidBy: { name: string; id: number };
}
interface expenseListItemProps {
  onExpenseCreated: () => void;
  setSelectedExpense: (expense: extendedExpense) => void;
  expense: extendedExpense;
  groupId: number;
}

export default function ExpenseListItem({
  setSelectedExpense,
  expense,
  onExpenseCreated,
}: expenseListItemProps) {
  const handleClickExpense = (expense: extendedExpense) => {
    setSelectedExpense(expense);
  };

  useEffect(() => {}, []);
  return (
    <TableRow
      key={expense.id}
      onClick={() => handleClickExpense(expense)}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        cursor: "pointer",
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "rgba(128,128,128,0.1)",
        },
      }}
    >
      <TableCell align="center" width={25}>
        {String(expense.createdAt)}
      </TableCell>
      <TableCell align="center" width={80}>
        <div style={{ fontWeight: 430 }}>{expense.description}</div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "gray",
            fontStyle: "italic",
          }}
        >
          {expense.paidBy.name}
        </div>
      </TableCell>
      <TableCell align="center" width={80}>
        <ProgressBar value={expense.valuePaid / expense.value} />
      </TableCell>
      <TableCell align="center" width={20}>
        <ExpensePayButton
          expense={expense}
          onExpensePaid={onExpenseCreated}
        ></ExpensePayButton>
      </TableCell>
    </TableRow>
  );
}
