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
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    align?: "left" | "center" | "right";
  }[];
  onRemove?: (id: string) => void;
}

function CustomTable<T extends { _id: string }>({
  data,
  columns,
  onRemove,
}: TableProps<T>) {
  const renderColumns = columns.map((col) => (
    <TableCell key={col.key as string} align={col.align}>
      {col.label}
    </TableCell>
  ));

  const renderData = data.map((item) => {
    return (
      <TableRow
        key={item._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {columns.map((col) => {
          return (
            <TableCell key={col.key as string}>
              {item[col.key] as string}
            </TableCell>
          );
        })}
        <TableCell align="center">
          <Button>
            <ArticleOutlinedIcon />
          </Button>
          <Button>
            <BorderColorOutlinedIcon />
          </Button>
          {onRemove && (
            <Button onClick={() => onRemove(item._id)}>
              <DoDisturbAltOutlinedIcon />
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "40px", borderRadius: "12px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ bgcolor: "#F7FAFC" }}>
          <TableRow>
            {renderColumns}
            <TableCell align="center">Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderData}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable;
