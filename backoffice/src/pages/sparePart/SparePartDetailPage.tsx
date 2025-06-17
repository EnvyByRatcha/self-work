import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useSparePart from "../../hook/sparePartHook/sparePart.hook";
import { useEffect, useState } from "react";
import type {
  SparePart,
  SparePartBatch,
  SparePartUnit,
  SparePartUnitFormData,
} from "../../interface/ISparePart";
import CustomModal from "../../components/Modal/CustomModal";
import CustomSelect from "../../components/input/CustomSelect";
import useSparePartBatch from "../../hook/sparePartBatch.hook";
import CustomTextField from "../../components/input/CustomTextField";
import CustomButton from "../../components/button/CustomButton";
import CustomTable from "../../components/table/CustomTable";
import { sparePartUnitColumn } from "../../constants/sparePartUnitColumn";
import useSparePartUnit from "../../hook/sparePartUnit.hook";
import { Notyf } from "notyf";
import SparePartDetailForm from "../../components/form/SparePartDetailForm";
import useAllSparePartUnit from "../../hook/sparePartHook/allSparePart.hook";
import { Stack, Typography } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";
import CustomModalV2 from "../../components/Modal/CustomModalV2";
import CustomCard from "../../components/common/CustomCard";

const notyf = new Notyf();

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Issued", value: "issued" },
  { label: "Used", value: "used" },
];

const SparePartDetailPage = () => {
  const { id } = useParams();

  const { getSparePartById } = useSparePart();
  const { getBatchBySparePartId } = useSparePartBatch();
  const { createSparePartUnit } = useSparePartUnit();

  const {
    sparePartUnits,
    totalPage,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
  } = useAllSparePartUnit(id!);

  const [sparePart, setSparePart] = useState<SparePart>();
  const [sparePartBatches, setSparePartBatches] = useState<SparePartBatch[]>(
    []
  );

  const [selectSparePartUnit, setSelectedSparePartUnit] =
    useState<SparePartUnit | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [selectedMenu, setSelectedMenu] = useState<String>("sparepart");

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

  const handleEdit = (item: SparePartUnit) => {
    setSelectedSparePartUnit(item);
    setEditModalOpen(true);
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
      fetchSparePartBatch(id!);
      setCurrentPage(1);
      return;
    }
    notyf.error(data?.message);
  };

  const updateSparePart = () => {};

  return (
    <>
      <TitleBox title={sparePart?.name || "Sparepart name"}>
        <CustomButton
          title="Info"
          handleClick={() => setSelectedMenu("info")}
        />
        <CustomButton
          title="All sparepart"
          handleClick={() => setSelectedMenu("sparepart")}
        />
      </TitleBox>
      <ContentBox padding>
        <CustomModalV2
          title="Product Unit detail"
          open={editModalOpen}
          setOpen={setEditModalOpen}
        >
          {selectSparePartUnit && (
            <Stack gap={2}>
              <CustomCard>
                <Stack direction={"row"} lineHeight={1.3}>
                  <Typography
                    minWidth={"120px"}
                    fontSize={"0.875rem"}
                    fontWeight={700}
                  >
                    Product Batch
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {selectSparePartUnit.sparePartBatchId}
                  </Typography>
                </Stack>
              </CustomCard>
              <CustomCard>
                <Stack direction={"row"} lineHeight={1.3}>
                  <Typography
                    minWidth={"120px"}
                    fontSize={"0.875rem"}
                    fontWeight={700}
                  >
                    Serial number
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {selectSparePartUnit.serialNumber}
                  </Typography>
                </Stack>
              </CustomCard>
              <CustomCard>
                <Stack direction={"row"} lineHeight={1.3}>
                  <Typography
                    minWidth={"120px"}
                    fontSize={"0.875rem"}
                    fontWeight={700}
                  >
                    Technician
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {selectSparePartUnit.technicianId
                      ? selectSparePartUnit.technicianId.email
                      : "-"}
                  </Typography>
                </Stack>
              </CustomCard>
            </Stack>
          )}
        </CustomModalV2>

        {sparePartUnits && selectedMenu === "sparepart" && (
          <>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"row"} gap={1}>
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
                        setFormData({
                          ...formData,
                          sparePartBatchId: e.target.value,
                        })
                      }
                    />

                    <CustomTextField
                      label="Serial number"
                      name="name"
                      type="text"
                      required
                      value={formData.serialNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serialNumber: e.target.value,
                        })
                      }
                    />
                    <CustomButton type="submit" title="Proceed" />
                  </form>
                </CustomModal>
                <SearchBox
                  label="serial number"
                  type="text"
                  searchTerm={searchTerm}
                  onSearchChange={(value) => setSearchTerm(value)}
                  onClear={() => setSearchTerm("")}
                />
              </Stack>
              <Stack direction={"row"} gap={1}>
                <FilterDropDown
                  title="Status"
                  options={statusOptions}
                  onSelect={(value) => setStatusFilter(value)}
                />
              </Stack>
            </Stack>

            <CustomTable
              data={sparePartUnits}
              columns={sparePartUnitColumn}
              onEdit={handleEdit}
            />
            <TablePaginate
              currentPage={currentPage}
              totalPage={totalPage}
              onChangePage={(page) => {
                setCurrentPage(page);
              }}
            />
          </>
        )}

        {sparePart && selectedMenu === "info" && (
          <SparePartDetailForm
            sparePart={sparePart}
            onSubmit={updateSparePart}
          />
        )}
      </ContentBox>
    </>
  );
};

export default SparePartDetailPage;
