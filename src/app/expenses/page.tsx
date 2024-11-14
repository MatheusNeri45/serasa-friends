"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import ExpensesList from "../_components/expensesList/expensesList";
import AddExpenseForms from "../_components/addExpenseForms/addExpenseForms";


export default function Home() {
  const [debtors, setDebtors] = useState<[]>([]);
  const [userId, setUserId] = useState(0);
  const [updateList, setUpdateList] = useState<boolean>(false);

  const getUsers = async () => {
    const fetchRes = await fetch("api/getUsers");
    const res = await fetchRes.json();
    setDebtors(res.users);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const userId = storedUser ? JSON.parse(storedUser) : null;
    if (userId) {
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <ExpensesList
        userId={userId}
        updateList={updateList}
        setUpdateList={setUpdateList}
      />
      <AddExpenseForms
        userId={userId}
        debtors={debtors}
        setUpdateList={setUpdateList}
      />
    </div>
  );
}