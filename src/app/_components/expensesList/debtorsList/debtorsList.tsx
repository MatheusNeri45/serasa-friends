"use client";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { User } from "@prisma/client";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface expenseListProps {
  debtors: User[];
  setSelectedDebtors: Function;
  selectedDebtors: User[];
}

export default function DebtorsList({
  debtors,
  setSelectedDebtors,
  selectedDebtors,
}: expenseListProps) {
  const onChange = (debtorId: number) => {
    setSelectedDebtors((prevSelectedDebtors: User[]) => {
      if (prevSelectedDebtors.some((debtor: User) => debtor.id === debtorId)) {
        return prevSelectedDebtors.filter(
          (debtor: User) => debtor.id !== debtorId
        );
      }
      const debtorToAdd = debtors.find(
        (debtor: User) => debtor.id === debtorId
      );
      return [...prevSelectedDebtors, debtorToAdd];
    });
  };

  return (
    <FormGroup>
      Debtors
      {debtors.map((debtor: User) => (
        <FormControlLabel
          key={debtor.id}
          label={debtor.name}
          control={
            <Checkbox
              checked={selectedDebtors.some(
                (selectedDebtor) => selectedDebtor.id === debtor.id
              )}
              onChange={() => onChange(debtor.id)}
            />
          }
        />
      ))}
    </FormGroup>
  );
}
