import { useState } from "react";
import CustomButton from "../button/CustomButton";
import CustomDrawerV2 from "../common/CustomDrawerV2";
import useSparePartUnit from "../../hook/sparePartUnit.hook";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import {
  sparePartUnits,
  sparePartUnitsFormData,
} from "../../interface/ISparePart";
import CustomCard from "../common/CustomCard";
import { AssignmentDetailFormData } from "../../interface/IAssignment";

function AssignmentDetailForm({ onSubmit }: any) {
  const { sparePartUnits, setSparePartUnits } = useSparePartUnit();

  const [selectedSparePart, setSelectedSparePart] = useState<
    sparePartUnitsFormData[]
  >([]);

  const [sparePartSelectorOpen, setSparePartSelectorOpen] = useState(false);

  const openSparePartSelectorMenu = () => {
    setSparePartSelectorOpen(true);
  };

  const handleSelectSparePart = (selectedPart: sparePartUnits) => {
    setSparePartSelectorOpen(false);

    const part = sparePartUnits.find((part) => part._id === selectedPart._id);
    if (!part || part.units.length == 0) {
      return;
    }

    const [firstUnit, ...remainingUnits] = part.units;

    setSelectedSparePart((prev) => {
      const existingItem = prev.find(
        (item) => item.sparePartId === selectedPart._id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.sparePartId === selectedPart._id
            ? { ...item, units: [...item.units, { _id: firstUnit._id }] }
            : item
        );
      } else {
        return [
          ...prev,
          {
            sparePartId: selectedPart._id,
            name: selectedPart.name,
            units: [{ _id: firstUnit._id }],
          },
        ];
      }
    });

    const updateSparePartUnits = sparePartUnits
      .map((unit) => {
        if (unit._id === selectedPart._id) {
          return {
            ...unit,
            units: remainingUnits,
          };
        }
        return unit;
      })
      .filter((unit) => unit.units.length > 0);

    setSparePartUnits(updateSparePartUnits);
  };

  const handleSubmit = () => {
    const data: AssignmentDetailFormData = { payload: selectedSparePart };
    onSubmit(data);
  };

  const renderUnitWithBatch = sparePartUnits.map((unit) => (
    <Card
      key={unit._id}
      variant="outlined"
      sx={{ mb: 2 }}
      onClick={() => handleSelectSparePart(unit)}
    >
      <CardContent>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack>
            <Typography>{unit.name}</Typography>
          </Stack>
          <Typography>{unit.units.length}</Typography>
        </Stack>
      </CardContent>
    </Card>
  ));

  const renderSelectedSparePart = selectedSparePart.map((part) => (
    <CustomCard key={part.sparePartId}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography>{part.name}</Typography>
        <Typography>{part.units.length}</Typography>
      </Stack>
    </CustomCard>
  ));

  return (
    <Stack gap={2}>
      {selectedSparePart.length > 0 && renderSelectedSparePart}
      <CustomButton
        handleClick={openSparePartSelectorMenu}
        title="Add spare part"
      />

      <CustomButton title="Proceed" fullWidth handleClick={handleSubmit} />
      <CustomDrawerV2
        open={sparePartSelectorOpen}
        setOpen={setSparePartSelectorOpen}
      >
        {sparePartUnits.length === 0 && (
          <Typography>No spare part units found.</Typography>
        )}

        {sparePartUnits.length > 0 && renderUnitWithBatch}
      </CustomDrawerV2>
    </Stack>
  );
}

export default AssignmentDetailForm;
