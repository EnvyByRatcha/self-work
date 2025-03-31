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
import { Product } from "../../interface/IProduct";

interface TableProductProps {
  products: Product[];
  onRemove?: (id: string) => void;
}

function ProductTable({ products, onRemove }: TableProductProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "40px", borderRadius: "12px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ bgcolor: "#F7FAFC" }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {product.name}
              </TableCell>
              <TableCell>
                {product.categoryId ? product.categoryId : "none"}
              </TableCell>
              <TableCell>{product.qty}</TableCell>
              <TableCell>{product.cost}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell align="center">
                <Button>
                  <ArticleOutlinedIcon />
                </Button>
                <Button>
                  <BorderColorOutlinedIcon />
                </Button>
                <Button>
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

export default ProductTable;
