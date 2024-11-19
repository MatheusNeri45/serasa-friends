"use client";
import { useState, useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ExpensePayButton from "../payButton/expensePayButton/expensePayButton";
import { Expense } from "@prisma/client";
import ProgressBar from "../paymentProgressBar/paymentProgressBar";

interface extendedExpense extends Expense {
  paidBy: { name: String };
}
interface expenseListItemProps {
  setUpdateList: Function;
  setSelectedExpense: Function;
  expense: extendedExpense;
  groupId: Number;
}

export default function ExpenseListItem({
  setSelectedExpense,
  expense,
  setUpdateList,
  groupId,
}: expenseListItemProps) {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClickExpense = (expense: extendedExpense) => {
    setSelectedExpense(expense);
    setClicked((prev: boolean) => !prev);
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
          paidExpense={expense.paid}
          expense={expense}
          setUpdateList={setUpdateList}
          groupId={groupId}
        ></ExpensePayButton>
      </TableCell>
    </TableRow>
  );
}
