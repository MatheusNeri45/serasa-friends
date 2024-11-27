"use client";
import { useState, useEffect, Fragment } from "react";
import { SplitExpense, Expense, User } from "@prisma/client";
import { useParams } from "next/navigation";

interface extendedExpenseSplits extends SplitExpense {
  participant: { name: string; id: number };
}

interface extendedExpense extends Expense {
  paidBy: { name: string; id: number };
}

interface formProps {
  onExpenseEdited: () => void;
  selectedExpenseSplits: extendedExpenseSplits[];
  selectedExpense: extendedExpense;
  onChangeEditing: () => void;
  editing: boolean;
}

export default function EditExpenseForms({
  onExpenseEdited,
  selectedExpense,
  onChangeEditing,
  editing,
}: formProps) {
  const { groupId } = useParams();
  const [users, setUsers] = useState<User[]>();
  const [debtors, setDebtors] = useState<User[]>();
  const [payer, setPayer] = useState<number>(selectedExpense.paidBy.id);
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsersGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setUsers(res.groupInfo);
    setDebtors(res.groupInfo);
  };

  const fetchUpdate = async (data: object) => {
    const res = await fetch("../api/updateExpenseEdit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      onExpenseEdited();
      onChangeEditing();
    }
  };
  return <Fragment></Fragment>;
}
