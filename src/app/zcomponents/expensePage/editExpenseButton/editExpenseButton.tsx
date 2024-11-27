"use client";
import Button from "@mui/material/Button";
import { Grid2 } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";

interface formProps {
  // setUpdateList: Function;
  editing: boolean;
  expenseId: number;
  onChangeEditing: ()=>void;
}

export default function EditExpenseButton({
  // setUpdateList,
  expenseId,
  onChangeEditing,
  editing
}: //setUpdateSplitExpensesList
formProps) {

  return (
    <Grid2 container width={80} sx={{ color: "text-primary" }} key={expenseId}>
      <Button disabled={editing} variant="contained" onClick={onChangeEditing}>
        <EditSharpIcon />
      </Button>
    </Grid2>
  );
}