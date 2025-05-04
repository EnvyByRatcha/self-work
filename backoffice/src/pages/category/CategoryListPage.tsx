import { Pagination } from "@mui/material";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import CustomTextField from "../../components/input/CustomTextField";
import CustomModal from "../../components/Modal/CustomModal";
import { useState } from "react";
import useCategory from "../../hook/category.hook";
import CustomTable from "../../components/table/CustomTable";
import { categoryColumn } from "../../constants/categoryColumn";
import CustomButton from "../../components/button/CustomButton";
import type { CategoryFormData } from "../../interface/ICategory";
import { Notyf } from "notyf";

const notyf = new Notyf();

const CategoryListPage = () => {
  const {
    categories,
    createCategory,
    totalPage,
    setCurrentPage,
    loading,
    error,
  } = useCategory();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

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

  return (
    <>
      <TitleBox title={"Category list"} />
      <ContentBox padding>
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
        <CustomTable data={categories} columns={categoryColumn} />
        <Pagination
          count={totalPage}
          color="primary"
          sx={{
            marginTop: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default CategoryListPage;
