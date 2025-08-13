import { useNavigate, useParams } from "react-router-dom";
import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { useEffect, useState } from "react";
import {
  InventoryTransitionDetail,
  InventoryTransition,
} from "../../interface/IInventory";
import { Paper, Stack, TableCell, TableRow, Typography } from "@mui/material";
import CustomButton from "../../components/button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";
import { Notyf } from "notyf";
import CustomTable from "../../components/table/CustomTable";
import { transitionDetailColumn } from "../../constants/transitionDetailColumn";
import dayjs from "dayjs";

const notyf = new Notyf();

function InventoryTransitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getInventoryTransitionDetailById,
    approveTransition,
    rejectTransition,
    loading,
  } = useInventoryTransition();

  const [transition, setTransition] = useState<InventoryTransition>();
  const [transitionDetail, setTransitionDetail] = useState<
    InventoryTransitionDetail[]
  >([]);

  const tax = 0.07;

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id: string) => {
    const data = await getInventoryTransitionDetailById(id);
    if (data?.success) {
      setTransition(data.data.inventoryTransition);
      setTransitionDetail(data.data.inventoryTransitionDetail);
    }
  };

  const handleApprove = async (id: string) => {
    const data = await approveTransition(id);
    if (data.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/inventory");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  const handleReject = async (id: string) => {
    const data = await rejectTransition(id);
    if (data.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/inventory");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  const InfomationDetail = ({
    labels,
    values,
  }: {
    labels: string[];
    values: string[];
  }) => (
    <>
      <Stack>
        {labels.map((label, i) => (
          <Typography key={i} fontSize={"0.875rem"} fontWeight={700}>
            {label}
          </Typography>
        ))}
      </Stack>
      <Stack mx={4}>
        {labels.map((_, i) => (
          <Typography key={i} fontSize={"0.875rem"} fontWeight={700}>
            :
          </Typography>
        ))}
      </Stack>
      <Stack>
        {values.map((value, i) => (
          <Typography key={i} fontSize={"0.875rem"} fontWeight={400}>
            {value}
          </Typography>
        ))}
      </Stack>
    </>
  );

  const sumPrice: number = transitionDetail.reduce(
    (acc, curr) => acc + curr.total,
    0
  );
  const taxPrice: number = parseFloat((sumPrice * tax).toFixed(2));

  const renderTableDetail = (
    <CustomTable data={transitionDetail} columns={transitionDetailColumn}>
      <TableRow>
        <TableCell colSpan={2} sx={{ borderBottom: "none" }} />
        <TableCell align="right" sx={{ borderBottom: "none" }}>
          Subtotal
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: "none" }}>
          {sumPrice.toLocaleString("th-TH")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} sx={{ borderBottom: "none" }} />
        <TableCell align="right">Tax 7%</TableCell>
        <TableCell align="right">{taxPrice.toLocaleString("th-TH")}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} sx={{ borderBottom: "none" }} />
        <TableCell align="right">Total</TableCell>
        <TableCell align="right">
          {(sumPrice - taxPrice).toLocaleString("th-TH")}
        </TableCell>
      </TableRow>
    </CustomTable>
  );

  const renderTransitionDetail = (
    <Stack sx={{ maxWidth: 900, mx: "auto" }} gap={2}>
      <Stack direction={"row"} gap={2}>
        <InfoIcon sx={{ color: "custom.linkButton" }} />
        <Typography
          fontSize={"1rem"}
          fontWeight={700}
          mb={"20px"}
          color="text.primary"
        >
          Transition info
        </Typography>
      </Stack>
      {transition && !loading && (
        <Paper
          elevation={0}
          sx={{
            px: 3,
            py: 3,
            backgroundColor: "custom.customButton",
            borderRadius: 2,
          }}
        >
          <Stack direction={"row"} sx={{ mx: 2, mt: 2 }}>
            <Stack direction={"row"} width={"50%"}>
              <InfomationDetail
                labels={["Transition ID", "Transition type", "Status"]}
                values={[
                  transition._id?.slice(0, 5),
                  transition.transitionType,
                  transition.status,
                ]}
              />
            </Stack>
            <Stack direction={"row"} width={"50%"}>
              <InfomationDetail
                labels={["User", "Auditor", "Date"]}
                values={[
                  transition._id?.slice(0, 5),
                  transition.userId,
                  dayjs(transition.createdAt).format("DD/MM/YYYY"),
                ]}
              />
            </Stack>
          </Stack>
          {renderTableDetail}
          {transition.status == "pending" && (
            <Stack direction={"row"} mt={2}>
              <CustomButton
                title="Reject"
                color="custom.dangerButton"
                handleClick={() => handleReject(transition._id)}
              />
              <CustomButton
                title="Approve"
                color="custom.successButton"
                handleClick={() => handleApprove(transition._id)}
              />
            </Stack>
          )}
        </Paper>
      )}
    </Stack>
  );

  return (
    <>
      <TitleBox title={"Transition Detail"} />
      <ContentBox padding>{renderTransitionDetail}</ContentBox>
    </>
  );
}

export default InventoryTransitionDetailPage;
