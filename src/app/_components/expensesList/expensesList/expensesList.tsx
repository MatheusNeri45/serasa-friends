"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import SplitExpensesList from "../splitExpenseList/splitExpensesList";
import { Expense, User } from "@prisma/client";
import ExpenseListItem from "../../expenseItemList/expensesList";

interface extendedExpense extends Expense {
  paidBy: { name: String; id: number };
}

interface expenseListProps {
  userId: Number;
  updateList: boolean;
  setUpdateList: Function;
  groupId: number;
}

export default function ExpensesList({
  userId,
  updateList,
  setUpdateList,
  groupId,
}: expenseListProps) {
  const [expenseList, setExpenseList] = useState<extendedExpense[]>([]);
  const [selectedExpense, setSelectedExpense] =
    useState<extendedExpense | null>(null);

  const fetchExpenseList = async () => {
    const res = await fetch("../api/getGroupExpenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: groupId }),
    });
    const response = await res.json();
    return response.expenseList;
  };

  useEffect(() => {
    if (userId) {
      fetchExpenseList().then((data) => {
        setExpenseList(data);
      });
    }
  }, [userId, updateList]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
      <Table sx={{ maxWidth: 900 }} aria-label="simple table">
        <TableBody>
          {expenseList.map((expense: extendedExpense) => (
            <ExpenseListItem
              setUpdateList={setUpdateList}
              setSelectedExpense={setSelectedExpense}
              expense={expense}
              groupId={groupId}
              key={expense.id}
            />
          ))}
        </TableBody>
      </Table>
      {selectedExpense && (
        <SplitExpensesList
          groupId={groupId}
          payer={selectedExpense.paidBy.id}
          selectedExpense={selectedExpense}
          setUpdateList={setUpdateList}
          setSelectedExpense={setSelectedExpense}
        />
      )}
    </TableContainer>
  );
}
