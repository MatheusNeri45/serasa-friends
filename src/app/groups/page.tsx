"use client";
import { Typography } from "@mui/material";
import { Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateGroupForms from "../_components/groupsList/createGroupForms/createGroupForms";
import GroupsList from "../_components/groupsList/groupsList/groupsList";

export default function Home() {
  const router = useRouter();
  // NOTE: wtf is this kkkk userId padrão 0 e como state, leia do storage
  const [userId, setUserId] = useState(0);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [updateGroupList, setUpdateGroupList] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>();

  // NOTE: isole os comportamentos, mas não tanto, essa função já pode setar o state, assim vc deixa a leitura do código mais fluida
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

  // NOTE: same here, set state dos usuarios carregados
  // NOTE: Genê do futuro aqui, pq porra vc ta fazendo o fetch de users aqui se vc só ta usando em membersList??? código desnecessario nesse lugar
  const fetchUsers = async () => {
    const response = await fetch("/api/getUsers");
    const res = await response.json();
    const users = res.users;
    return users;
  };

  useEffect(() => {
    // NOTE: usar sua função utilitaria de pegar userId
    const storedUser = localStorage.getItem("id");
    const userId = storedUser ? Number(JSON.parse(storedUser)) : null;
    if (userId) {
      // NOTE: sem necessidade de state aqui
      setUserId(userId);
      console.log(userId);
      fetchUsers().then((users) => {
        // NOTE: mover pra dentro da função
        setUsers(users);
      });
    } else {
      // NOTE: pesquise sobre middleware, vc pode fazer isso antes de renderizar a página
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
      // NOTE: mover pra dentro da função
      setGroups(groups);
    });
  }, [userId, updateGroupList]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "650px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Groups
        </Typography>
        <CreateGroupForms
          users={users}
          // NOTE: crie uma função que vai ser chamda ao finalizar a criação do grupo em vez de passar o setUpdateGroupList, isso deixa o código mais limpo e generico caso vc queira usar o mesmo form em outro lugar a função pode ser "onGroupCreated", e nessa função vc chama o seu "fetchGroupsList" que já sabe carregar e setar a lista de grupos
          setUpdateGroupList={setUpdateGroupList}
          // NOTE: userId não precisa ser passado, vc já tem ele no localStorage
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
