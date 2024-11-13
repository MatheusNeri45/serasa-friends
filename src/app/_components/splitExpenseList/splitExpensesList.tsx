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
import ExpensePayButton from "../payButton/expensePayButton/expensePayButton";

interface expenseItem {
  id: number;
  value: number;
  description: string;
  createdAt: string;
  paid: boolean;
  userId: number;
}
interface expenseListProps {
  selectedExpense: expenseItem;
  setUpdateList:Function;
  setSelectedExpense: Function;
}
interface expenseSplit{

  id: number;
  value: number;
  expenseId: number;
  participantId: number;
  updatedAt: string;
  paid: boolean;

}

export default function SplitExpensesList({ selectedExpense, setUpdateList, setSelectedExpense}:expenseListProps) {
  const [users, setUsers] = useState([])
  const [selectedExpenseSplits, setSelectedExpenseSplits] = useState<expenseSplit[]>([])

  const fetchSplitExpenses = async(expenseId:number) =>{
    const res = await fetch("/api/getExpenseSplits",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenseId: expenseId }),
      }
    );
    const response = await res.json();
    const list = response.splitExpenseList
    return list
  }

  const fetchUsers = async()=>{
    const res = await fetch("api/getUsers")
    const response = await res.json()
    return response.users;
  }


  useEffect(()=>{
    fetchUsers().then((users)=>setUsers(users))
  },[])

  useEffect(()=>{
    fetchSplitExpenses(selectedExpense.id).then((splitExpenses)=>{setSelectedExpenseSplits(splitExpenses) })
  },[])
  const onClose = async()=>{
    setSelectedExpense(null)
  }

return(
  <BasicModal onClose={onClose} open={!!selectedExpense}>
  <TableContainer component={Paper} sx={{ maxWidth: 650 }}>

  <Table sx={{ maxWidth: 600 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell align="center">Particpant</TableCell>
        <TableCell align="center">Value</TableCell>
        <TableCell align="center">Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {selectedExpenseSplits.map((expenseSplit:expenseSplit) => (
        <TableRow
          key={expenseSplit.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }
          }
        >
          <TableCell align='center'component="th" scope="row">
            {expenseSplit.participantId}
          </TableCell>
          <TableCell align="center">{expenseSplit.value}</TableCell>
          <TableCell align="center">
            <SplitPayButton splitExpense={expenseSplit} setUpdateList={setUpdateList}></SplitPayButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  </TableContainer>
  </BasicModal>)}