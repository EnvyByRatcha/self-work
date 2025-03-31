import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { User } from "../../interface/IUser";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

interface TableUserProps {
  users: User[];
  onRemove: (id: string) => void;
}

function UserTable({ users, onRemove }: TableUserProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "40px", borderRadius: "12px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ bgcolor: "#F7FAFC" }}>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>First name</TableCell>
            <TableCell>Last name</TableCell>
            <TableCell align="center">Level</TableCell>
            <TableCell align="center">Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.email}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell align="center">{user.level}</TableCell>
              <TableCell align="center">
                <Button>
                  <ArticleOutlinedIcon />
                </Button>
                <Button>
                  <BorderColorOutlinedIcon />
                </Button>
                <Button onClick={(e) => onRemove(user._id)}>
                  <DoDisturbAltOutlinedIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable;
