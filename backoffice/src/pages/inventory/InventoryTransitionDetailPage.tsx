import { useNavigate, useParams } from "react-router-dom";
import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { useEffect, useState } from "react";
import {
  InventoryTransitionDetail,
  InventoryTransition,
} from "../../interface/IInventory";
import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "../../components/button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";
import { Notyf } from "notyf";

const notyf = new Notyf();

function InventoryTransitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getInventoryTransitionDetailById, approveTransition, loading } =
    useInventoryTransition();

  const [transition, setTransition] = useState<InventoryTransition>();
  const [transitionDetail, setTransitionDetail] = useState<
    InventoryTransitionDetail[]
  >([]);

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

  return (
    <>
      <TitleBox title={"Transition Detail"} />
      <ContentBox padding>
        <Stack sx={{ maxWidth: "900px", margin: "auto" }}>
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
                paddingX: "24px",
                paddingY: "16px",
                backgroundColor: "custom.customButton",
              }}
            >
              <Stack>
                <Stack direction={"row"} gap={2}>
                  <Typography fontSize={"0.9rem"} fontWeight={700}>
                    Transition-Type
                  </Typography>
                  <Typography fontSize={"0.9rem"}>
                    {transition.transitionType}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          )}

          {transitionDetail && !loading && (
            <Paper>
              {transitionDetail.map((item) => {
                return (
                  <Typography key={item._id}>
                    {`${
                      item.productId
                        ? item.productId.name
                        : item.sparePartId.name
                    } ${item.cost} ${item.qty} ${(
                      item.qty * item.cost
                    ).toLocaleString("th-TH")}`}
                  </Typography>
                );
              })}
            </Paper>
          )}
          <Stack direction={"row"}>
            <CustomButton
              title="Approve"
              type="submit"
              handleClick={() => handleApprove(transition!._id)}
            />
          </Stack>
        </Stack>
      </ContentBox>
    </>
  );
}

export default InventoryTransitionDetailPage;
