import { useParams } from "react-router-dom";
import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { useEffect, useState } from "react";
import {
  InventoryTransitionDetail,
  InventoryTransitions,
} from "../../interface/IInventory";
import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "../../components/button/CustomButton";

function InventoryTransitionDetailPage() {
  const { id } = useParams();
  const { fetchInventoryTransitionDetail } = useInventoryTransition();

  const [transition, setTransition] = useState<InventoryTransitions>();
  const [transitionDetail, setTransitionDetail] = useState<
    InventoryTransitionDetail[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (id: string) => {
    fetchInventoryTransitionDetail(id).then((result) => {
      if (result) {
        setTransition(result.inventoryTransition);
        setTransitionDetail(result.inventoryTransitionDetail);
      }
      setLoading(false);
    });
  };

  const handleConfirm = () => {};

  return (
    <>
      <TitleBox title={"Transition Detail"} />
      <ContentBox>
        <Stack gap={2}>
          {transition && !loading && (
            <Paper>
              <Typography>{transition.transitionType}</Typography>
              <Typography>{transition.cost.toLocaleString("th-TH")}</Typography>
              <Typography>{transition.createdAt}</Typography>
              <Typography>{transition.status}</Typography>
            </Paper>
          )}

          {transitionDetail && !loading && (
            <Paper>
              {transitionDetail.map((item) => {
                return (
                  <Typography>
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
        </Stack>
        <CustomButton title="confirm" handleClick={handleConfirm} />
      </ContentBox>
    </>
  );
}

export default InventoryTransitionDetailPage;
