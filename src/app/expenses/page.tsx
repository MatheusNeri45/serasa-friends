"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpensesList from "../_components/expensesList/expensesList";
import AddExpenseForms from "../_components/addExpenseForms/addExpenseForms";

export default function Home() {
  const router = useRouter();
  const [debtors, setDebtors] = useState<[]>([]);
  const [userId, setUserId] = useState(0);
  const [updateList, setUpdateList] = useState<boolean>(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsers");
    const res = await response.json();
    const users = res.users;
    return users;
  };
  useEffect(() => {
    fetchUsers().then((users) => {
      setUsers(users);
      setDebtors(users);
    });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const userId = storedUser ? JSON.parse(storedUser) : null;
    if (userId) {
      setUserId(userId);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div>
      <ExpensesList
        userId={userId}
        updateList={updateList}
        setUpdateList={setUpdateList}
      />
      <AddExpenseForms
        debtors={debtors}
        setUpdateList={setUpdateList}
        users={users}
        userId={userId}
      />
    </div>
  );
}
