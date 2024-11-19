"use client";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
interface GroupListProps {
  groups: Group[];
  setSelectedGroup: Function;
}

// NOTE: mesma coisa sobre a lista de groups
export default function GroupsList({
  groups,
  setSelectedGroup,
}: GroupListProps) {
  const router = useRouter();
  const [groupsList, setGroupsList] = useState<Group[]>([]);
  const [clicked, setClicked] = useState<Number | null>(null);

  useEffect(() => {
    setGroupsList(groups);
  }, [groups]);

  const handleClickGroup = (group: Group) => {
    setSelectedGroup(group);
    setClicked(group.id);
    setTimeout(() => setClicked(null), 200);
  };

  const onPressHome = () => {
    router.push("/");
  };

  return (
    <Fragment>
      <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
        <Table sx={{ maxWidth: 900 }} aria-label="simple table">
          <TableBody>
            {groupsList.map((group) => (
              <TableRow
                key={group.id}
                onClick={() => handleClickGroup(group)}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  backgroundColor:
                    clicked === group.id
                      ? "rgba(128,128,128,0.2"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(128,128,128,0.1)",
                  },
                }}
              >
                <TableCell align="center" component="th" scope="row">
                  <ListItemAvatar>
                    <Avatar alt={group.name} src="">
                      {" "}
                    </Avatar>
                  </ListItemAvatar>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {group.name}
                </TableCell>
                <TableCell align="center">{group.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined" sx={{}} onClick={onPressHome}>
        <HomeSharpIcon sx={{ width: 30 }} />
      </Button>
      <Button variant="contained" style={{ fontSize: "large" }}>
        <GroupsIcon></GroupsIcon>
      </Button>
      <Button variant="outlined" sx={{}}>
        <PlaylistAddOutlinedIcon sx={{ width: 30 }} />
      </Button>
      <Button variant="outlined">
        <AccountCircleSharpIcon />
      </Button>
    </Fragment>
  );
}
