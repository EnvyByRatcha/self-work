import { Box, Grid, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CustomSelect from "../input/CustomSelect";
import CustomButton from "../button/CustomButton";
import type {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
} from "../../interface/IInventory";
import useProduct from "../../hook/product.hook";
import useSparePart from "../../hook/sparePart.hook";
import CustomTextField from "../input/CustomTextField";
import InfoIcon from "@mui/icons-material/Info";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const transitionTypes = [
  {
    label: "stock-in",
    value: "stock-in",
  },
  {
    label: "stock-out",
    value: "stock-out",
  },
  {
    label: "return-stock",
    value: "return-stock",
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
  const [formData, setFormData] = useState<InventoryTransitionFormData>({
    transitionType: "stock-in",
    from: "",
    to: "",
  });
  const [formDataDetail, setFormDataDetail] = useState<
    InventoryTransitionDetailFormData[]
  >([
    {
      type: "product",
      productId: "",
      sparePartId: "",
      qty: 1,
      cost: 0,
    },
  ]);

  const { products } = useProduct();
  const { spareParts } = useSparePart();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeInArr = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormDataDetail((prevData) =>
      prevData.map((item, i) =>
        i == index ? { ...item, [name]: value } : item
      )
    );
  };

  const handleSelectChangeInArr = (
    event: SelectChangeEvent<String>,
    index: number
  ) => {
    const { name, value } = event.target;
    setFormDataDetail((prevData) =>
      prevData.map((item, i) =>
        i == index ? { ...item, [name]: value } : item
      )
    );
  };

  const handleAddMoreItem = () => {
    setFormDataDetail([
      ...formDataDetail,
      {
        type: "product",
        productId: "",
        sparePartId: "",
        qty: 1,
        cost: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (formDataDetail.length > 1) {
      setFormDataDetail((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, formDataDetail);
  };

  const renderForm = formDataDetail.map((detail, index) => {
    return (
      <Stack
        key={index}
        direction={"row"}
        alignItems={"center"}
        gap={2}
        marginBottom={2}
      >
        <CustomSelect
          label="Product type"
          name="type"
          options={itemTypes.map((type) => {
            return type;
          })}
          value={detail.type}
          onChange={(e) => handleSelectChangeInArr(e, index)}
        />
        {detail.type == "product" ? (
          <CustomSelect
            label="Product name"
            name="productId"
            required
            options={products.map((product) => {
              return { label: product.name, value: product._id };
            })}
            value={detail.productId}
            onChange={(e) => handleSelectChangeInArr(e, index)}
          />
        ) : (
          <CustomSelect
            label="Sparepart name"
            name="sparePartId"
            required
            options={spareParts.map((sparePart) => {
              return { label: sparePart.name, value: sparePart._id };
            })}
            value={detail.sparePartId}
            onChange={(e) => handleSelectChangeInArr(e, index)}
          />
        )}
        <CustomTextField
          label="QTY"
          name="qty"
          type="number"
          required
          value={detail.qty}
          onChange={(e) => handleInputChangeInArr(e, index)}
        />
        <CustomTextField
          label="Cost"
          name="cost"
          type="number"
          required
          value={detail.cost}
          onChange={(e) => handleInputChangeInArr(e, index)}
        />
        <CustomButton
          icon={<ClearOutlinedIcon />}
          color="text.secondary"
          backgroundColor="custom.dangerButton"
          handleClick={() => handleRemoveItem(index)}
        />
      </Stack>
    );
  });

  return (
    <Box sx={{ width: "100%", marginX: "auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Grid container spacing={2}>
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
          <Grid size={12} mt={"20px"}>
            <Stack direction={"row"} gap={2}>
              <PostAddOutlinedIcon sx={{ color: "custom.linkButton" }} />
              <Typography
                fontSize={"1rem"}
                fontWeight={700}
                mb={"20px"}
                color="text.primary"
              >
                Transition detai
              </Typography>
            </Stack>
            {renderForm}
          </Grid>
        </Grid>
        <Stack direction={"row"} gap={2}>
          <CustomButton title="add more" handleClick={handleAddMoreItem} />
          <CustomButton title="Proceed" type="submit" />
        </Stack>
      </form>
    </Box>
  );
};

export default InventoryForm;
