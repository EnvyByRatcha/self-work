import { Stack } from "@mui/material";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import CustomTextField from "../../components/input/CustomTextField";
import CustomModal from "../../components/Modal/CustomModal";
import { useState } from "react";
import useCategory from "../../hook/category.hook";
import CustomTable from "../../components/table/CustomTable";
import { categoryColumn } from "../../constants/categoryColumn";
import CustomButton from "../../components/button/CustomButton";
import type { Category, CategoryFormData } from "../../interface/ICategory";
import { Notyf } from "notyf";
import SearchBox from "../../components/common/SearchBox";

import FilterDropDown from "../../components/common/FilterDropDown";
import CustomModalV2 from "../../components/Modal/CustomModalV2";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TablePaginate from "../../components/common/TablePaginate";

const notyf = new Notyf();

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CategoryListPage = () => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    createCategory,
    updateCategoryById,
    inactiveCategory,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useCategory();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
  });

  const [selectdCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectdCategorytoInactive, setSelectedCategoryToInactive] =
    useState<string>("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await createCategory(formData);
    if (data?.success) {
      setFormData({ name: "" });
      setOpenModal(false);
      notyf.success(data.message);
      return;
    }

    notyf.error(data.message);
  };

  const selectedCategory = (item: Category) => {
    setSelectedCategory(item);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectdCategory) {
      const data = await updateCategoryById(
        selectdCategory._id,
        selectdCategory
      );
      if (data.success) {
        notyf.success(data.message);
        setSelectedCategory(null);
        setEditModalOpen(false);
        return;
      }
      notyf.error(data?.message);
      return;
    }
    notyf.error("Id && Product-unit is invalid");
  };

  const handleInactive = async (id: string) => {
    setSelectedCategoryToInactive(id);
    setDialogOpen(true);
  };

  const handleConfirmInactive = async () => {
    if (!setSelectedCategoryToInactive) return;

    try {
      const data = await inactiveCategory(selectdCategorytoInactive);
      if (data.success) {
        notyf.success(data.message);
      } else {
        notyf.error(data.message);
      }
    } catch (error) {
      notyf.error("Something went wrong while inactive the category.");
    } finally {
      setDialogOpen(false);
      setSelectedCategoryToInactive("");
    }
  };

  return (
    <>
      <TitleBox title={"Category list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <CustomModal
              title="Add category"
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
                <CustomTextField
                  label="Category name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <CustomButton type="submit" title="Proceed" />
              </form>
            </CustomModal>
            <SearchBox
              label="category"
              type="text"
              searchTerm={searchTerm}
              onSearchChange={(value) => setSearchTerm(value)}
              onClear={() => setSearchTerm("")}
            />
          </Stack>

          <FilterDropDown
            title="Status"
            options={statusOptions}
            onSelect={(value) => setStatusFilter(value)}
          />
        </Stack>

        <CustomTable
          data={categories}
          columns={categoryColumn}
          onEdit={selectedCategory}
          onRemove={handleInactive}
        />
        <TablePaginate
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />

        <CustomModalV2
          title="Edit Category"
          open={editModalOpen}
          setOpen={setEditModalOpen}
        >
          {selectdCategory && (
            <form
              onSubmit={handleEditSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <CustomTextField
                label="Category name"
                name="name"
                type="text"
                required
                value={selectdCategory.name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectdCategory,
                    name: e.target.value,
                  })
                }
              />
              <CustomButton type="submit" title="Save changes" />
            </form>
          )}
        </CustomModalV2>
        <ConfirmDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedCategoryToInactive("");
          }}
          onConfirm={handleConfirmInactive}
          title={`Inactive category`}
          description="Please confirm for inactive category"
          confirmText="Confirm"
          cancelText="Cancle"
        />
      </ContentBox>
    </>
  );
};

export default CategoryListPage;
