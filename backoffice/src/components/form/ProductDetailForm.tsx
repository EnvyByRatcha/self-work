import { useState } from "react";
import { Product } from "../../interface/IProduct";
import EditFieldModal from "../Modal/EditFieldModal";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CustomCard from "../common/CustomCard";
import CustomFile from "../input/CustomFile";
import useCategory from "../../hook/category.hook";

interface ProductDetailFormProps {
  product: Product;
  onSubmit: any;
}

interface EditForm {
  field: keyof Product | "";
  label: string;
  value: string;
  type: "text" | "email" | "password" | "number" | "tel";
  inputField: "textField" | "selector";
  options?: { label: string; value: string }[];
}

const ProductDetailForm = ({ product, onSubmit }: ProductDetailFormProps) => {
  const { categories } = useCategory();

  const [modalOpen, setModalOpen] = useState(false);

  const [editState, setEditState] = useState<EditForm>({
    field: "",
    label: "",
    value: "",
    type: "text",
    inputField: "textField",
    options: [],
  });

  const handleOpenEditor = (
    field: keyof Product,
    label: string,
    value: string,
    type: "text" | "email" | "password" | "number" | "tel",
    inputField: "textField" | "selector",
    options?: { label: string; value: string }[]
  ) => {
    setEditState({ field, label, value, type, inputField, options });
    setModalOpen(true);
  };

  const setDefaultEditState = () => {
    setEditState({
      field: "",
      label: "",
      value: "",
      type: "text",
      inputField: "textField",
      options: [],
    });
  };

  const [propImg, setPropImg] = useState({
    name: "",
    url: "",
  });

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) => {
      return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });
    };
    reader(file).then((result: string) => {
      setPropImg({ name: file.name, url: result });
    });
  };

  const handleSubmit = (field: string, data: string) => {
    const payload = { [field]: data };
    console.log(payload);
    return;
    onSubmit(payload);
    setDefaultEditState();
  };

  return (
    <>
      <Box sx={{ width: "100%", mx: "auto" }}>
        <Grid container spacing={{ xs: 4, md: 0 }}>
          <Grid
            size={{ xs: 12, md: 4 }}
            padding={"40px"}
            sx={{
              outline: "solid 1px",
              outlineColor: "outline.color",
              borderRadius: "8px",
            }}
          >
            <CustomFile
              handleImageChange={handleImageChange}
              propsImage={propImg}
            />
            {product.photoUrl && (
              <Box style={{ marginTop: "20px" }}>
                <img
                  src={product.photoUrl}
                  alt="Product Preview"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginTop: "10px",
                    objectFit: "contain",
                    border: "1px solid rgb(195, 211, 219)",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} paddingX={{ xs: "40px" }}>
            <Stack direction={"row"} gap={2}>
              <Inventory2OutlinedIcon
                sx={{ color: "custom.linkButton", mt: "4px" }}
              />
              <Typography
                fontSize={"1.3125rem"}
                fontWeight={700}
                mb={"20px"}
                color="text.primary"
              >
                Product info
              </Typography>
            </Stack>

            <Grid size={{ xs: 12 }} mb={2}>
              <CustomCard
                handleClick={() =>
                  handleOpenEditor(
                    "name",
                    "name",
                    product?.name,
                    "text",
                    "textField"
                  )
                }
              >
                <Stack direction={"row"} lineHeight={1.3}>
                  <Typography
                    minWidth={"120px"}
                    fontSize={"0.875rem"}
                    fontWeight={700}
                  >
                    Product name
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {product.name}
                  </Typography>
                </Stack>
              </CustomCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomCard
                handleClick={() =>
                  handleOpenEditor(
                    "categoryName",
                    "category",
                    product.categoryName,
                    "text",
                    "selector",
                    categories.map((category) => {
                      return { label: category.name, value: category.name };
                    })
                  )
                }
              >
                <Stack direction={"row"} lineHeight={1.3}>
                  <Typography
                    minWidth={"120px"}
                    fontSize={"0.875rem"}
                    fontWeight={700}
                  >
                    Category
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {product.categoryName || ""}
                  </Typography>
                </Stack>
              </CustomCard>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <EditFieldModal
        title={`Edit ${editState.label}`}
        open={modalOpen}
        setOpen={setModalOpen}
        label={editState.label}
        value={editState.value}
        onSubmit={handleSubmit}
        type={editState.type}
        field={editState.field}
        inputField={editState.inputField}
        options={editState.options || []}
      />
    </>
  );
};

export default ProductDetailForm;
