"use client";
import AddMemberForms from "@/app/_components/addMemberForms/addMemberForms";
import AddExpenseForms from "@/app/_components/expensesList/addExpenseForms/addExpenseForms";
import ExpensesList from "@/app/_components/expensesList/expensesList/expensesList";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }: { params: { groupId: number } }) {
  const router = useRouter();
  const [debtors, setDebtors] = useState<[]>([]);
  // NOTE: remover userId do state
  const [userId, setUserId] = useState(0);
  const [updateList, setUpdateList] = useState<boolean>(false);
  const [users, setUsers] = useState([]); //q

  //NOTE setState já dentro do fetch
  const fetchUsers = async (groupId: Number) => {
    const response = await fetch("/api/getUsersGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: groupId }),
    });
    const res = await response.json();
    return res.groupInfo;
  };

  useEffect(() => {
    // Fazer o parse do groupId no topo do componente, Dont repeat yourself DRY, vc reescreveu isso varias vezes nesse arquivo
    fetchUsers(Number(params.groupId)).then((groupInfo) => {
      console.log(groupInfo);
      setUsers(groupInfo.members);
      setDebtors(groupInfo.members);
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

  const onViewGroups = () => {
    router.push("/groups");
  };

  return (
    <div>
      {users.length > 0 && (
        <AddMemberForms
          users={users}
          setUsers={setUsers}
          groupId={params.groupId}
        />
      )}
      <ExpensesList
        userId={userId}
        updateList={updateList}
        setUpdateList={setUpdateList}
        groupId={Number(params.groupId)}
      />
      <Button variant="outlined" sx={{}}>
        <HomeSharpIcon sx={{ width: 30 }} />
      </Button>
      <Button variant="outlined" sx={{}} onClick={onViewGroups}>
        <GroupsIcon sx={{ width: 30 }} />
      </Button>
      <AddExpenseForms
        debtors={debtors}
        setUpdateList={setUpdateList}
        users={users}
        userId={userId}
        groupId={Number(params.groupId)}
      />
      <Button variant="outlined">
        <AccountCircleSharpIcon />
      </Button>
    </div>
  );
}
