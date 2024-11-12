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
import { SplitExpense } from "@prisma/client";


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
}
interface expenseSplit{

  id: number;
  value: number;
  expenseId: number;
  participantId: number;
  updatedAt: string;
  paid: boolean;

}

export default function ExpensesList({ userId, updateList}:expenseListProps) {
  const [expenseList, setExpenseList] = useState<expenseItem[]>([]);
  const [users, setUsers] = useState([])
  const [selectedExpense, setSelectedExpense] = useState<expenseItem|null>(null)
  const [selectedExpenseSplits, setSelectedExpenseSplits] = useState([])

  const handleClickExpense = (expenseItem:expenseItem) => {
    setSelectedExpense(expenseItem)
    fetchSplitExpenses(expenseItem.id)
  }

  const fetchSplitExpenses = async(expenseId:number) =>{
    const res = await fetch("/api/getExpenseSplits",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenseId: expenseId }),
      }
    );
    const response = await res.json();
    setSelectedExpenseSplits(response.splitExpenseList)
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
      fetchExpenseList().then((data) => setExpenseList(data));
    }
  }, [userId, updateList]);

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
                {expenseItem.paid ? "Paid" : "Not paid"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedExpense&&(
            <BasicModal component={"View expense details"} onClose={()=>setSelectedExpense(null)} open={!!selectedExpense}>
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
                      {expenseSplit.paid ? "Paid" : <button>Pay debt</button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
            </BasicModal>
        
      )}
    </TableContainer>
  );
}
