"use client";
import { useState, useEffect, Fragment } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import SplitModal from "../splitModal/splitModal";
import { Expense } from "@prisma/client";
import ExpenseListItem from "../expenseItemList/expensesList";
import { useParams } from "next/navigation";
import AddExpenseForms from "../addExpenseForms/addExpenseForms";

interface extendedExpense extends Expense {
  paidBy: { name: string; id: number };
}

export default function ExpensesList() {
  const { groupId } = useParams();
  const [expenseList, setExpenseList] = useState<extendedExpense[]>([]);
  const [selectedExpense, setSelectedExpense] =
    useState<extendedExpense | null>();

  const fetchExpenseList = async () => {
    const res = await fetch("/api/getGroupExpenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const response = await res.json();
    setExpenseList(response.expenseList);
  };

  useEffect(() => {
    fetchExpenseList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <AddExpenseForms onExpenseCreated={() => fetchExpenseList()} />
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table sx={{ maxWidth: 900 }} aria-label="simple table">
          <TableBody>
            {expenseList.map((expense: extendedExpense) => {
              return (
                <ExpenseListItem
                  onExpenseCreated={() => fetchExpenseList()}
                  setSelectedExpense={setSelectedExpense}
                  expense={expense}
                  groupId={Number(groupId)}
                  key={expense.id}
                />
              );
            })}
          </TableBody>
        </Table>
        {selectedExpense && (
          <SplitModal
            selectedExpense={selectedExpense}
            onExpenseUpdated={() => fetchExpenseList()}
            setSelectedExpense={setSelectedExpense}
          />
        )}
      </TableContainer>
    </Fragment>
  );
}
