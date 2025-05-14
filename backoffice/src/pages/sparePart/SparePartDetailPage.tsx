import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useSparePart from "../../hook/sparePart.hook";
import { useEffect, useState } from "react";
import type {
  SparePart,
  SparePartBatch,
  SparePartUnit,
  SparePartUnitFormData,
} from "../../interface/ISparePart";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import CustomModal from "../../components/Modal/CustomModal";
import CustomSelect from "../../components/input/CustomSelect";
import useSparePartBatch from "../../hook/sparePartBatch.hook";
import CustomTextField from "../../components/input/CustomTextField";
import CustomButton from "../../components/button/CustomButton";
import CustomTable from "../../components/table/CustomTable";
import { sparePartUnitColumn } from "../../constants/sparePartUnitColumn";
import useSparePartUnit from "../../hook/sparePartUnit.hook";
import { Notyf } from "notyf";

const notyf = new Notyf();

const SparePartDetailPage = () => {
  const { id } = useParams();

  const { getSparePartById } = useSparePart();
  const { getBatchBySparePartId } = useSparePartBatch();
  const { getSparePartUnitBySparePartId, createSparePartUnit } =
    useSparePartUnit();

  const [sparePart, setSparePart] = useState<SparePart>();
  const [sparePartBatches, setSparePartBatches] = useState<SparePartBatch[]>(
    []
  );
  const [sparePartUnits, setSparePartUnits] = useState<SparePartUnit[]>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<SparePartUnitFormData>({
    sparePartId: id!,
    serialNumber: "",
    sparePartBatchId: "",
  });

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (id: string) => {
    fetchSparePart(id);
    fetchSparePartBatch(id);
    fetchSparePartUnit(id);
  };

  const fetchSparePart = async (id: string) => {
    const data = await getSparePartById(id);
    if (data?.success) {
      setSparePart(data.data.sparePart);
    }
  };

  const fetchSparePartBatch = async (id: string) => {
    const data = await getBatchBySparePartId(id);
    if (data?.success) {
      setSparePartBatches(data.data.sparePartBatches);
    }
  };

  const fetchSparePartUnit = async (id: string) => {
    const data = await getSparePartUnitBySparePartId(id);
    if (data?.success) {
      setSparePartUnits(data.data.sparePartUnits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createSparePartUnit(formData);
    if (data.success) {
      notyf.success(data.message);
      setFormData({
        sparePartId: id!,
        serialNumber: "",
        sparePartBatchId: "",
      });
      setOpenModal(false);
      return;
    }
    notyf.error(data?.message);
  };

  const handleEdit = (item: SparePartUnit) => {};

  return (
    <>
      <TitleBox title={"Sparepart Detail"} />
      <ContentBox padding>
        {sparePart && (
          <Stack direction={"row"} gap={2}>
            <Box>
              <img
                src={sparePart.photoUrl}
                alt="Product Preview"
                style={{
                  width: "100%",
                  maxWidth: "160px",
                  objectFit: "contain",
                  border: "1px solid rgb(195, 211, 219)",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Box>
              <Typography color="textPrimary">{sparePart.name}</Typography>
              <Typography color="textPrimary">{sparePart.status}</Typography>
              <Typography color="textPrimary">
                {`Create: ${dayjs(sparePart.createdAt).format("DD/MM/YYYY")}`}
              </Typography>
              <Typography color="textPrimary">
                {`Update: ${dayjs(sparePart.updatedAt).format("DD/MM/YYYY")}`}
              </Typography>
            </Box>
          </Stack>
        )}
        <CustomModal
          title={"Register spare-part"}
          open={openModal}
          setOpen={setOpenModal}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <CustomSelect
              label="Batch-Id"
              name="productBatchId"
              required
              options={
                Array.isArray(sparePartBatches)
                  ? sparePartBatches.map((batch) => ({
                      label: batch._id,
                      value: batch._id,
                    }))
                  : []
              }
              value={formData.sparePartBatchId}
              onChange={(e) =>
                setFormData({ ...formData, sparePartBatchId: e.target.value })
              }
            />

            <CustomTextField
              label="Serial number"
              name="name"
              type="text"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
            />
            <CustomButton type="submit" title="Proceed" />
          </form>
        </CustomModal>

        {sparePartUnits.length > 0 && (
          <CustomTable
            data={sparePartUnits}
            columns={sparePartUnitColumn}
            onEdit={handleEdit}
          />
        )}
      </ContentBox>
    </>
  );
};

export default SparePartDetailPage;
