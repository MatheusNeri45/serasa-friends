"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GroupsList from "../_components/groupsList/groupsList/groupsList";
import CreateGroupForms from "../_components/groupsList/createGroupForms/createGroupForms";
import { Group } from "@prisma/client";
import { Typography } from "@mui/material";
import AddExpenseForms from "../_components/expensesList/addExpenseForms/addExpenseForms";

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState(0);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [updateGroupList, setUpdateGroupList] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>();

  const fetchGroupsList = async (userId: Number) => {
    const response = await fetch("/api/getGroups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    });
    const res = await response.json();
    const groups = res.groupList;
    return groups;
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsers");
    const res = await response.json();
    const users = res.users;
    return users;
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const userId = storedUser ? Number(JSON.parse(storedUser)) : null;
    if (userId) {
      setUserId(userId);
      console.log(userId);
      fetchUsers().then((users) => {
        setUsers(users);
      });
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      router.push(`expenses/${selectedGroup.id}`);
      setSelectedGroup(null);
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchGroupsList(userId).then((groups) => {
      setGroups(groups);
    });
  }, [userId, updateGroupList]);


  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", maxWidth:"650px"}}>
        <Typography variant="h4" gutterBottom>
          Groups
        </Typography>
        <CreateGroupForms
          users={users}
          setUpdateGroupList={setUpdateGroupList}
          userId={userId}
        />
      </div>
      <GroupsList setSelectedGroup={setSelectedGroup} groups={groups} />
      {/* <AddExpenseForms
        debtors={debtors}
        setUpdateList={setUpdateList}
        users={users}
        userId={userId}
        groupId={Number(params.groupId)}
      /> */}
    </div>
  );
}
