import {useState, useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Expense,User } from '@prisma/client';

interface SelectUserProps{
  users:User[];
  payer:number|undefined;
  setEditPayer:Function
  userId:Number
}

export default function EditSelectPayer({users,payer, setEditPayer}:SelectUserProps) {

  const handleChange = (event: SelectChangeEvent) => {
    setEditPayer(Number(event.target.value));
  };


  return (
    <div>
      <FormControl margin='dense' variant="standard" sx={{minWidth: 120 }} fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Payer</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={String(payer)}
          onChange={handleChange}
          label="Payer"
          required
        >
          {users.map((user: User) => (
            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

