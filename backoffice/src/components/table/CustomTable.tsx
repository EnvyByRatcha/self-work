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
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    align?: "left" | "center" | "right";
  }[];
  onRemove?: (id: string) => void;
  isLinkButton?: boolean;
  onEdit?: (item: T) => void;
}

function CustomTable<T extends { _id: string }>({
  data,
  columns,
  onRemove,
  isLinkButton,
  onEdit,
}: TableProps<T>) {
  const location = useLocation();

  const renderColumns = columns.map((col) => (
    <TableCell key={col.key as string} align={col.align}>
      {col.label}
    </TableCell>
  ));

  const renderData = data.map((item) => {
    return (
      <TableRow
        key={item._id}
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "outline.color",
        }}
      >
        {columns.map((col) => {
          const value = item[col.key];
          let displayValue = value as string;

          if (col.key === "updatedAt") {
            displayValue = dayjs(value as string).format("DD/MM/YYYY");
          }
          if (col.key === "createdAt") {
            displayValue = dayjs(value as string).format("DD/MM/YYYY");
          }

          return <TableCell key={col.key as string}>{displayValue}</TableCell>;
        })}
        <TableCell align="center" sx={{ width: "240px" }}>
          {isLinkButton && (
            <Button href={`${location.pathname}/${item._id}`}>
              <ArticleOutlinedIcon />
            </Button>
          )}
          {onEdit && (
            <Button onClick={() => onEdit?.(item)}>
              <BorderColorOutlinedIcon />
            </Button>
          )}
          {onRemove && (
            <Button onClick={() => onRemove(item._id)}>
              <DoDisturbAltOutlinedIcon color="error" />
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ marginTop: "20px", borderRadius: "12px 12px 0px 0px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "table.color" }}>
            <TableRow>
              {renderColumns}
              <TableCell align="center">Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderData}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default CustomTable;
