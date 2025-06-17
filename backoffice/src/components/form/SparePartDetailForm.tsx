import { useState } from "react";
import useProduct from "../../hook/productHook/product.hook";
import { SparePart } from "../../interface/ISparePart";
import EditFieldModal from "../Modal/EditFieldModal";
import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomFile from "../input/CustomFile";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import CustomCard from "../common/CustomCard";

interface SparePartDetailFormProps {
  sparePart: SparePart;
  onSubmit: any;
}

interface EditForm {
  field: keyof SparePart | "";
  label: string;
  value: string;
  type: "text" | "email" | "password" | "number" | "tel";
  inputField: "textField" | "selector";
  options?: { label: string; value: string }[];
}

const SparePartDetailForm = ({
  sparePart,
  onSubmit,
}: SparePartDetailFormProps) => {
  const { products } = useProduct();

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
    field: keyof SparePart,
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
            {sparePart.photoUrl && (
              <Box style={{ marginTop: "20px" }}>
                <img
                  src={sparePart.photoUrl}
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
              <PrecisionManufacturingOutlinedIcon
                sx={{ color: "custom.linkButton", mt: "4px" }}
              />
              <Typography
                fontSize={"1.3125rem"}
                fontWeight={700}
                mb={"20px"}
                color="text.primary"
              >
                Sparepart info
              </Typography>
            </Stack>

            <Grid size={{ xs: 12 }} mb={2}>
              <CustomCard
                handleClick={() =>
                  handleOpenEditor(
                    "name",
                    "name",
                    sparePart?.name,
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
                    {sparePart.name}
                  </Typography>
                </Stack>
              </CustomCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomCard
                handleClick={() =>
                  handleOpenEditor(
                    "productName",
                    "product",
                    sparePart.productName,
                    "text",
                    "selector",
                    products.map((product) => {
                      return { label: product.name, value: product.name };
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
                    {sparePart.productName || ""}
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

export default SparePartDetailForm;
