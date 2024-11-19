"use client";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { User } from "@prisma/client";
import { Divider } from "@mui/material";

interface expenseListProps {
  members: User[];
  setSelectedMembers: Function;
  selectedMembers: User[];
  userId: Number;
}

export default function MembersList({
  members,
  setSelectedMembers,
  selectedMembers,
  userId,
}: expenseListProps) {
  // NOTE: a responsabilidade desse componente é de selecionar os membros, ele deveria ser responsavel por carregar os membros
  // NOTE: e apenas chamar uma função "onMembersSelected" que passa a lista de members selecionados

  // NOTE: Aposto q no futuro vc vai precisar selecionar os membros pra alguma coisa, vc já conseguiria reutilizar esse componente
  const onChange = (memberId: number) => {
    setSelectedMembers((prevSelectedMembers: User[]) => {
      if (prevSelectedMembers.some((member: User) => member.id === memberId)) {
        return prevSelectedMembers.filter(
          (member: User) => member.id !== memberId
        );
      }
      const memberToAdd = members.find(
        (member: User) => member.id === memberId
      );
      return [...prevSelectedMembers, memberToAdd];
    });
  };

  return (
    <>
      <FormGroup>
        Members
        {members.map((member: User) => (
          <FormControlLabel
            key={member.id}
            label={member.name}
            control={
              <Checkbox
                disabled={member.id === userId}
                checked={selectedMembers.some(
                  (selectedMember) => selectedMember.id === member.id
                )}
                onChange={() => onChange(member.id)}
              />
            }
          />
        ))}
      </FormGroup>
    </>
  );
}
