import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Expense, User } from "@prisma/client";

interface SelectUserProps {
  usersSelection: User[];
  setUserToAdd: Function;
  userToAdd: number | null;
}

// NOTE: usersSelection poderia ser carregado internamente tb
export default function AddUserSelection({
  usersSelection,
  setUserToAdd,
  userToAdd,
}: SelectUserProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setUserToAdd(parseInt(event.target.value));
  };

  return (
    <div>
      <FormControl
        margin="dense"
        variant="standard"
        sx={{ minWidth: 120 }}
        fullWidth
      >
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={String(userToAdd)}
          onChange={handleChange}
          label="Payer"
          required
        >
          {usersSelection.map((user: User) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
