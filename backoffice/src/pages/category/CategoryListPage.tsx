import { Pagination, setRef } from "@mui/material";
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

const CategoryListPage = () => {
  const { categories, createCustomer, totalPage, setCurrentPage } =
    useCategory();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer(formData).then((data) => {
      if (data?.message == "success") {
        setFormData({ name: "" });
        setOpenModal(false);
        categories.unshift(data.category!);
      }
    });
  };

  return (
    <>
      <TitleBox title={"Category list"} />
      <ContentBox>
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
              gap: 2,
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
            <CustomButton type="submit" title="Add category" />
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
