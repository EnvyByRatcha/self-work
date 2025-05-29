import { Stack, Typography } from "@mui/material";
import useSparePartUnit from "../../hook/sparePartUnit.hook";
import ContentBox from "../../components/common/ContentBox";
import CustomCard from "../../components/common/CustomCard";

function InventoryListPage() {
  const { sparePartUnits } = useSparePartUnit();

  const renderUnitWithBatch = sparePartUnits.map((part) => (
    <CustomCard key={part._id}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack>
          <Typography variant="h6" gutterBottom>
            {part.name}
          </Typography>
        </Stack>
        <Typography variant="h6" gutterBottom>
          {part.units.length}
        </Typography>
      </Stack>
    </CustomCard>
  ));

  return (
    <ContentBox padding>
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Typography fontSize={"1.75rem"} fontWeight={700} color="textPrimary">
          Assignment list
        </Typography>
      </Stack>
      {sparePartUnits.length === 0 && (
        <Typography>No spare part units found.</Typography>
      )}

      {sparePartUnits.length > 0 && renderUnitWithBatch}
    </ContentBox>
  );
}

export default InventoryListPage;
