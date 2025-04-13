import { Button, Grid, SelectChangeEvent, Typography } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";
import useCategory from "../../hook/category.hook";
import CustomButton from "../button/CustomButton";
import type { InventorytransitionFormData } from "../../interface/IInventory";

const transitionTypes = [
  {
    label: "stock-in",
    value: "stock-in",
  },
];

const itemTypes = [
  {
    label: "product",
    value: "product",
  },
  {
    label: "spare-part",
    value: "sparepart",
  },
];

const InventoryForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<InventorytransitionFormData>({
    transitionType: "stock-in",
    from: "",
    to: "",
  });
  const [formDataDetail, setFormDataDetail] = useState([
    {
      Type: "product",
    },
  ]);

  const { categories } = useCategory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddMoreItem = () => {
    setFormDataDetail([
      ...formDataDetail,
      {
        Type: "product",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          borderBottom: "1px solid rgb(195, 211, 219)",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            size={12}
            padding={"40px"}
            sx={{
              borderBottom: "1px solid rgb(195, 211, 219)",
            }}
          >
            <Typography fontSize={"1rem"} fontWeight={700} mb={"20px"}>
              Transition details
            </Typography>
            <CustomSelect
              label="Transition type  "
              name="transitionType"
              options={transitionTypes.map((type) => {
                return type;
              })}
              value={formData.transitionType}
              onChange={handleSelectChange}
            />
          </Grid>
          <Grid size={12} paddingX={"40px"} paddingBottom={2}>
            {formDataDetail.map((detail) => {
              return (
                <CustomSelect
                  label="Product type"
                  name="type"
                  options={itemTypes.map((type) => {
                    return type;
                  })}
                  value={detail.Type}
                  onChange={handleSelectChange}
                />
              );
            })}

            <CustomButton title="add more" handleClick={handleAddMoreItem} />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default InventoryForm;
