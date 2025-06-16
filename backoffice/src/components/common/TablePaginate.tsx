import { Pagination } from "@mui/material";

interface PaginateProps {
  totalPage: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}

function TablePaginate({
  totalPage,
  currentPage,
  onChangePage,
}: PaginateProps) {
  return (
    <Pagination
      page={currentPage}
      count={totalPage}
      color="primary"
      sx={{
        marginTop: "12px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onChange={(_, page) => onChangePage(page)}
      shape="rounded"
      size="small"
    />
  );
}

export default TablePaginate;
