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

interface expenseItem {
  id: number;
  value: number;
  description: string;
  createdAt: string;
  paid: boolean;
  userId: number;
}
interface expenseListProps {
  userId:number;
  updateList:boolean;
  setUpdateList:Function;
}

export default function ExpensesList({ userId, updateList, setUpdateList}:expenseListProps) {
  const [expenseList, setExpenseList] = useState<expenseItem[]>([]);
  const [users, setUsers] = useState([])
  const [selectedExpense, setSelectedExpense] = useState<expenseItem|null>(null)

  const handleClickExpense = (expenseItem:expenseItem) => {
    setSelectedExpense(expenseItem)
  }
  const fetchExpenseList = async () => {
    const res = await fetch("/api/getAllExpenses");
    const response = await res.json();
    return response.expenseList;
  };
  
  const fetchUsers = async()=>{
    const res = await fetch("api/getUsers")
    const response = await res.json()
    return response.users;
  }

  useEffect(() => {
    if (userId) {
      fetchExpenseList().then((data) =>{
        setExpenseList(data)
        console.log(data)
    })
  }}, [userId, updateList]);

  useEffect(()=>{
    fetchUsers().then((users)=>setUsers(users))
  },[])

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
          {expenseList.map((expenseItem) => (
            <TableRow
              key={expenseItem.id}
              onClick = {()=>handleClickExpense(expenseItem)}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }
              }
            >
              <TableCell align='center'component="th" scope="row">
                {expenseItem.userId}
              </TableCell>
              <TableCell align="center">{expenseItem.description}</TableCell>
              <TableCell align="center">{expenseItem.value}</TableCell>
              <TableCell align="center">{expenseItem.createdAt.slice(0,10)}</TableCell>
              <TableCell align="center">
              <ExpensePayButton  paidExpense={expenseItem.paid} expense={expenseItem}></ExpensePayButton>
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
