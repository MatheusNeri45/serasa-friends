"use client";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpensePayButton from "../payButton/expensePayButton/expensePayButton";
import SplitExpensesList from "../splitExpenseList/splitExpensesList";

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  paidExpenses: Expense[];
}

interface Expense {
  id: number;
  value: number;
  description: string;
  createdAt: string;
  paid: boolean;
  userId: number;
  paidBy: User;
}
interface expenseListProps {
  userId:number;
  updateList:boolean;
  setUpdateList:Function;
}

export default function ExpensesList({ userId, updateList, setUpdateList}:expenseListProps) {
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense|null>(null)

  const handleClickExpense = (expense:Expense) => {
    setSelectedExpense(expense)
  }
  const fetchExpenseList = async () => {
    const res = await fetch("/api/getAllExpenses");
    const response = await res.json();
    return response.expenseList;
  };

  useEffect(() => {
    if (userId) {
      fetchExpenseList().then((data) =>{
        setExpenseList(data)
    })
  }}, [userId, updateList]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
      <Table sx={{ maxWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Paid by</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Value</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenseList.map((expense:Expense) => (
            <TableRow
              key={expense.id}
              onClick = {()=>handleClickExpense(expense)}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }
              }
            >
              <TableCell align='center'component="th" scope="row">
                {expense.paidBy.name}
              </TableCell>
              <TableCell align="center">{expense.description}</TableCell>
              <TableCell align="center">{expense.value}</TableCell>
              <TableCell align="center">{expense.createdAt.slice(0,10)}</TableCell>
              <TableCell align="center">
              <ExpensePayButton  paidExpense={expense.paid} expense={expense}></ExpensePayButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedExpense&&(
        <SplitExpensesList selectedExpense={selectedExpense} setUpdateList={setUpdateList} setSelectedExpense={setSelectedExpense}/>
      )}
    </TableContainer>
  );
}
