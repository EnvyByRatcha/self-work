import {
  Box,
  Grid,
  Paper,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import CustomSelect from "../input/CustomSelect";
import CustomButton from "../button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import useTechnician from "../../hook/technician.hook";
import CustomModalV2 from "../Modal/CustomModalV2";
import useSparePart from "../../hook/sparePart.hook";
import useSparePartUnit from "../../hook/sparePartUnit.hook";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SparePart, SparePartUnit } from "../../interface/ISparePart";
import { TechnicianIssuedFormData } from "../../interface/ITechnicianUssued";
import { TransitionFormData } from "../../interface/IInventory";
import { Notyf } from "notyf";

const notyf = new Notyf();

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 400 },
  { field: "qty", headerName: "qty" },
];

const sparePartUnitcolumns: GridColDef[] = [
  { field: "serialNumber", headerName: "Serial number", width: 400 },
];

const paginationModel = { page: 0, pageSize: 5 };

function TechnicianIssuedForm({ onSubmit }: any) {
  const [formData, setFormData] = useState<TechnicianIssuedFormData>({
    transitionType: "technician-issued",
    technicianId: "",
    spareParts: [],
  });

  const [selectedSpareParts, setSelectedSpareParts] = useState<SparePart[]>([]);
  const [selectedSparePartId, setSelectedSparePartId] = useState<string[]>([]);

  const [currentSparePartId, setCurrentSparePartId] = useState<string | null>(
    null
  );

  const [sparePartUnits, setSparePartUnits] = useState<SparePartUnit[]>([]);
  const [selectedSparePartUnitsMap, setSelectedSparePartUnitsMap] = useState<
    Record<string, string[]>
  >({});

  const { spareParts } = useSparePart();
  const { getSparePartUnitBySparePartId } = useSparePartUnit();
  const { technicians } = useTechnician();

  const [sparePartModalOpen, setSparePartModalOpen] = useState(false);
  const [sparePartUnitModalOpen, setSparePartUnitModalOpen] = useState(false);

  const [loadingSparePartUnits, setLoadingSparePartUnits] = useState(false);

  useEffect(() => {
    if (currentSparePartId) {
      fetchSparePartUnitBySparePartId(currentSparePartId);
    }
  }, [currentSparePartId]);

  const fetchSparePartUnitBySparePartId = async (id: string) => {
    setLoadingSparePartUnits(true);
    try {
      const data = await getSparePartUnitBySparePartId(id);
      if (data?.success) {
        setSparePartUnits(data.data.sparePartUnits);
      }
    } finally {
      setLoadingSparePartUnits(false);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openMenuAddSparePart = () => {
    setSparePartModalOpen(true);
  };

  const handleMenuAddSparePart = () => {
    setSparePartModalOpen(false);

    const sparePartWithUnits = selectedSpareParts.map((item) => ({
      _id: item._id,
      name: item.name,
      sparePartUnits: [],
    }));

    setFormData((prev) => ({
      ...prev,
      spareParts: sparePartWithUnits,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredSpareParts = formData.spareParts.filter(
      (sparePart) => sparePart.sparePartUnits.length > 0
    );

    if (filteredSpareParts.length === 0) {
      notyf.error("Please add more Spare-part");
      return;
    }

    const details = filteredSpareParts.flatMap((sparePart) =>
      sparePart.sparePartUnits.map((unit) => ({
        type: "sparepart" as const,
        sparePartId: sparePart._id,
        sparePartUnitId: unit._id,
        serialNumber: unit.serialNumber,
        sparePartBatchId: unit.sparePartBatchId,
        qty: 1,
        cost: 0,
      }))
    );

    const payload: TransitionFormData = {
      transition: {
        transitionType: formData.transitionType,
        technicianId: formData.technicianId,
      },
      details,
    };

    onSubmit(payload);
  };

  const handleOpenUnitModal = (sparePartId: string) => {
    setCurrentSparePartId(sparePartId);
    setSparePartUnitModalOpen(true);
  };

  const handleAddSparePartUnits = () => {
    if (!currentSparePartId) return;

    const selectedUnitIds = selectedSparePartUnitsMap[currentSparePartId] || [];
    const selectedUnits = sparePartUnits.filter((unit) =>
      selectedUnitIds.includes(unit._id)
    );

    setFormData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.map((item) =>
        item._id === currentSparePartId
          ? { ...item, sparePartUnits: selectedUnits }
          : item
      ),
    }));

    setSparePartUnitModalOpen(false);
  };

  const handleRemoveSparePart = (sparePartId: string) => {
    setFormData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.filter((sp) => sp._id !== sparePartId),
    }));

    setSelectedSparePartId((prev) => prev.filter((id) => id !== sparePartId));
    setSelectedSpareParts((prev) =>
      prev.filter((part) => part._id !== sparePartId)
    );
  };

  const renderSelectedSparePart = formData.spareParts.map((part) => {
    return (
      <Box
        key={part._id}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "custom.borderColor",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={600} color="text.primary">
            {` ${part.sparePartUnits.length} x ${part.name}`}
          </Typography>
          <Stack direction="row" spacing={1}>
            <CustomButton
              title="Select Units"
              handleClick={() => handleOpenUnitModal(part._id)}
            />
            <CustomButton
              title="Remove"
              color="error"
              handleClick={() => handleRemoveSparePart(part._id)}
            />
          </Stack>
        </Stack>

        <Stack mt={2} spacing={1}>
          {part.sparePartUnits.length > 0 ? (
            part.sparePartUnits.map((unit) => (
              <Typography key={unit._id} fontSize="0.9rem" color="text.primary">
                • SN: {unit.serialNumber}
              </Typography>
            ))
          ) : (
            <Typography fontSize="0.9rem" color="text.primary">
              No units selected.
            </Typography>
          )}
        </Stack>
      </Box>
    );
  });

  return (
    <Box sx={{ maxWidth: "900px", marginX: "auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Grid container rowSpacing={2} spacing={2}>
          <Grid
            size={12}
            sx={(theme) => ({
              paddingBottom: "40px",
              borderBottom: "1px solid",
              borderColor: theme.palette.custom.borderColor,
            })}
          >
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
            <Stack direction={"row"} gap={2}>
              <Typography
                fontSize={"1rem"}
                fontWeight={600}
                mb={"20px"}
                color="text.primary"
              >
                Transition-type :{" "}
              </Typography>
              <Typography
                fontSize={"1rem"}
                fontWeight={400}
                mb={"20px"}
                color="text.primary"
              >
                Technician-issued
              </Typography>
            </Stack>
            <CustomSelect
              label="Technician"
              name="technicianId"
              required
              options={technicians.map((technician) => {
                return { label: technician.email, value: technician._id };
              })}
              value={formData.technicianId}
              onChange={handleSelectChange}
            />
          </Grid>
          <Grid
            size={12}
            sx={(theme) => ({
              paddingY: "20px",
              borderBottom: "1px solid",
              borderColor: theme.palette.custom.borderColor,
            })}
          >
            {formData.spareParts.length > 0 ? (
              renderSelectedSparePart
            ) : (
              <Stack
                sx={{
                  p: 2,
                  mb: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 40,
                }}
              >
                <Typography color="text.primary">
                  No spare-part selected.
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>

        <Stack direction={"row"} gap={2}>
          <CustomButton title="add more" handleClick={openMenuAddSparePart} />
          <CustomButton title="Proceed" type="submit" />
        </Stack>
      </form>

      <CustomModalV2
        title="Add Spare-part"
        open={sparePartModalOpen}
        setOpen={setSparePartModalOpen}
      >
        <Stack gap={2} mt={2}>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={spareParts}
              getRowId={(spareParts) => spareParts._id}
              isRowSelectable={(params) => params.row.qty > 0}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(id) => {
                const selectedId = id as string[];
                setSelectedSparePartId(selectedId);
                const selectedItems = spareParts.filter((item) =>
                  id.includes(item._id)
                );
                setSelectedSpareParts(selectedItems);
              }}
              rowSelectionModel={selectedSparePartId}
              sx={{ border: 0 }}
            />
          </Paper>
          <CustomButton title="Proceed" handleClick={handleMenuAddSparePart} />
        </Stack>
      </CustomModalV2>

      <CustomModalV2
        title="Add Spare-part unit"
        open={sparePartUnitModalOpen}
        setOpen={setSparePartUnitModalOpen}
      >
        <Stack gap={2} mt={2}>
          <Paper sx={{ height: 400, width: "100%" }}>
            {loadingSparePartUnits ? (
              <Stack height="100%" justifyContent="center" alignItems="center">
                <Typography color="text.primary">
                  Loading spare part units...
                </Typography>
              </Stack>
            ) : (
              <DataGrid
                rows={sparePartUnits}
                getRowId={(spareParts) => spareParts._id}
                columns={sparePartUnitcolumns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(id) => {
                  const selectedId = id as string[];
                  if (currentSparePartId) {
                    setSelectedSparePartUnitsMap((prev) => ({
                      ...prev,
                      [currentSparePartId]: selectedId,
                    }));
                  }
                }}
                rowSelectionModel={
                  selectedSparePartUnitsMap[currentSparePartId || ""] || []
                }
                sx={{ border: 0 }}
              />
            )}
          </Paper>
          <CustomButton title="Proceed" handleClick={handleAddSparePartUnits} />
        </Stack>
      </CustomModalV2>
    </Box>
  );
}

export default TechnicianIssuedForm;
