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
import CustomModalV2 from "../Modal/CustomModalV2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Notyf } from "notyf";
import useCustomer from "../../hook/customerHook/customer.hook";
import { TranferFormData } from "../../interface/ITranfer";
import useProduct from "../../hook/productHook/product.hook";
import { Product, ProductUnit } from "../../interface/IProduct";
import useProductUnit from "../../hook/productUnit.hook";
import { TransitionFormData } from "../../interface/IInventory";

const notyf = new Notyf();

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 400 },
  { field: "qty", headerName: "qty" },
];

const productUnitcolumns: GridColDef[] = [
  { field: "serialNumber", headerName: "Serial number", width: 400 },
];

function ProductManagementForm({ onSubmit }: any) {
  const [formData, setFormData] = useState<TranferFormData>({
    transitionType: "product-tranfered",
    customerId: "",
    products: [],
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProducttId, setSelectedProductId] = useState<string[]>([]);

  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [selectedProductUnitsMap, setSelectedProductUnitsMap] = useState<
    Record<string, string[]>
  >({});

  const { products } = useProduct();
  const { getProductUnitByProductId } = useProductUnit();
  const { customers } = useCustomer();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productUnitModalOpen, setProductUnitModalOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalItems, setTotalItem] = useState(0);

  const [loadingProductUnits, setLoadingProductUnits] = useState(false);

  useEffect(() => {
    if (currentProductId) {
      fetchProductUnitByProductId(
        currentProductId,
        paginationModel.page + 1,
        paginationModel.pageSize,
        "",
        "active"
      );
    }
  }, [currentProductId, paginationModel]);

  const fetchProductUnitByProductId = async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoadingProductUnits(true);
    try {
      const data = await getProductUnitByProductId(
        id,
        page,
        limit,
        search,
        status
      );
      if (data?.success) {
        setProductUnits(data.data.productUnits);
        setTotalItem(data.data.pagination.totalItems);
      }
    } finally {
      setLoadingProductUnits(false);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openMenuAddProduct = () => {
    setProductModalOpen(true);
  };

  const handleMenuAddProduct = () => {
    setProductModalOpen(false);

    const productWithUnits = selectedProducts.map((item) => ({
      _id: item._id,
      name: item.name,
      productUnits: [],
    }));

    setFormData((prev) => ({
      ...prev,
      products: productWithUnits,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filterProducts = formData.products.filter(
      (product) => product.productUnits.length > 0
    );

    if (filterProducts.length === 0) {
      notyf.error("Please add more product");
      return;
    }

    const details = filterProducts.flatMap((product) =>
      product.productUnits.map((unit) => ({
        type: "product" as const,
        productId: product._id,
        productUnitId: unit._id,
        serialNumber: unit.serialNumber,
        productBatchId: unit.productBatchId,
        qty: 1,
        cost: 0,
      }))
    );

    const payload: TransitionFormData = {
      transition: {
        transitionType: formData.transitionType,
        customerId: formData.customerId,
      },
      details,
    };

    console.log(payload);

    onSubmit(payload);
  };

  const handleOpenUnitModal = (productId: string) => {
    setCurrentProductId(productId);
    setProductUnitModalOpen(true);
  };

  const handleAddProductUnits = () => {
    if (!currentProductId) return;

    const selectedUnitIds = selectedProductUnitsMap[currentProductId] || [];
    const selectedUnits = productUnits.filter((unit) =>
      selectedUnitIds.includes(unit._id)
    );

    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item._id === currentProductId
          ? { ...item, productUnits: selectedUnits }
          : item
      ),
    }));

    setProductUnitModalOpen(false);
  };

  const handleRemoveSparePart = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item._id !== productId),
    }));
    setSelectedProductId((prev) => prev.filter((id) => id !== productId));
    setSelectedProducts((prev) =>
      prev.filter((product) => product._id !== productId)
    );
  };

  const renderSelectedSparePart = formData.products.map((product) => {
    return (
      <Box
        key={product._id}
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
            {` ${product.productUnits.length} x ${product.name}`}
          </Typography>
          <Stack direction="row" spacing={1}>
            <CustomButton
              title="Select Units"
              handleClick={() => handleOpenUnitModal(product._id)}
            />
            <CustomButton
              title="Remove"
              color="error"
              handleClick={() => handleRemoveSparePart(product._id)}
            />
          </Stack>
        </Stack>

        <Stack mt={2} spacing={1}>
          {product.productUnits.length > 0 ? (
            product.productUnits.map((unit) => (
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
                Product-tranfered
              </Typography>
            </Stack>
            <CustomSelect
              label="Customer"
              name="customerId"
              required
              options={customers.map((customer) => {
                return { label: customer.name, value: customer._id };
              })}
              value={formData.customerId}
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
            {formData.products.length > 0 ? (
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
                  No product selected.
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>

        <Stack direction={"row"} gap={2}>
          <CustomButton title="add more" handleClick={openMenuAddProduct} />
          <CustomButton title="Proceed" type="submit" />
        </Stack>
      </form>

      <CustomModalV2
        title="Add product"
        open={productModalOpen}
        setOpen={setProductModalOpen}
      >
        <Stack gap={2} mt={2}>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={products}
              getRowId={(products) => products._id}
              isRowSelectable={(params) => params.row.qty > 0}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(id) => {
                const selectedId = id as string[];
                setSelectedProductId(selectedId);
                const selectedItems = products.filter((item) =>
                  id.includes(item._id)
                );
                setSelectedProducts(selectedItems);
              }}
              rowSelectionModel={selectedProducttId}
              sx={{ border: 0 }}
            />
          </Paper>
          <CustomButton title="Proceed" handleClick={handleMenuAddProduct} />
        </Stack>
      </CustomModalV2>

      <CustomModalV2
        title="Add product unit"
        open={productUnitModalOpen}
        setOpen={setProductUnitModalOpen}
      >
        <Stack gap={2} mt={2}>
          <Paper sx={{ height: 400, width: "100%" }}>
            {loadingProductUnits ? (
              <Stack height="100%" justifyContent="center" alignItems="center">
                <Typography color="text.primary">
                  Loading product units...
                </Typography>
              </Stack>
            ) : (
              <DataGrid
                rows={productUnits}
                getRowId={(products) => products._id}
                columns={productUnitcolumns}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => {
                  setPaginationModel(model);
                }}
                pageSizeOptions={[5, 10]}
                rowCount={totalItems}
                checkboxSelection
                onRowSelectionModelChange={(id) => {
                  const selectedId = id as string[];
                  if (currentProductId) {
                    setSelectedProductUnitsMap((prev) => ({
                      ...prev,
                      [currentProductId]: selectedId,
                    }));
                  }
                }}
                rowSelectionModel={
                  selectedProductUnitsMap[currentProductId || ""] || []
                }
                sx={{ border: 0 }}
              />
            )}
          </Paper>
          <CustomButton title="Proceed" handleClick={handleAddProductUnits} />
        </Stack>
      </CustomModalV2>
    </Box>
  );
}

export default ProductManagementForm;
