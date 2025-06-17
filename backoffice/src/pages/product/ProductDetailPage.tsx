import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useProduct from "../../hook/productHook/product.hook";
import React, { useEffect, useState } from "react";
import {
  Product,
  ProductBatch,
  ProductUnit,
  ProductUnitFormData,
} from "../../interface/IProduct";
import CustomModal from "../../components/Modal/CustomModal";
import CustomTextField from "../../components/input/CustomTextField";
import CustomButton from "../../components/button/CustomButton";
import CustomSelect from "../../components/input/CustomSelect";
import useProductBash from "../../hook/productBatch.hook";
import useProductUnit from "../../hook/productUnit.hook";
import { Notyf } from "notyf";
import CustomTable from "../../components/table/CustomTable";
import { productUnitColumn } from "../../constants/productUnitColumn";
import CustomModalV2 from "../../components/Modal/CustomModalV2";
import ProductDetailForm from "../../components/form/ProductDetailForm";
import TablePaginate from "../../components/common/TablePaginate";
import { Stack, Typography } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import CustomCard from "../../components/common/CustomCard";
import useAllProductUnit from "../../hook/productHook/allProductUnti.hook";

const notyf = new Notyf();

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Onsite", value: "onsite" },
];

const ProductDetailPage = () => {
  const { id } = useParams();

  const { getProductById } = useProduct();
  const { getBashByProductId } = useProductBash();
  const { createProductUnit } = useProductUnit();

  const {
    productUnits,
    totalPage,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
  } = useAllProductUnit(id!);

  const [product, setProduct] = useState<Product>();
  const [productBatch, setProductBatch] = useState<ProductBatch[]>([]);

  const [selectedProductUnit, setSelectedProductUnit] =
    useState<ProductUnit | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [selectedMenu, setSelectedMenu] = useState<String>("product");

  const [formData, setFormData] = useState<ProductUnitFormData>({
    productId: id!,
    serialNumber: "",
    productBatchId: "",
  });

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (id: string) => {
    fetchProduct(id);
    fetchProductBatch(id);
  };

  const fetchProduct = async (id: string) => {
    const data = await getProductById(id);
    if (data?.success) {
      setProduct(data.data.product);
    }
  };

  const fetchProductBatch = async (id: string) => {
    const data = await getBashByProductId(id);
    if (data?.success) {
      setProductBatch(data.data.productBatches);
    }
  };

  const handleEdit = (item: ProductUnit) => {
    setSelectedProductUnit(item);
    setEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createProductUnit(formData);
    if (data.success) {
      notyf.success(data.message);
      setFormData({
        productId: id!,
        serialNumber: "",
        productBatchId: "",
      });
      setOpenModal(false);
      fetchProductBatch(id!);
      setCurrentPage(1);
      return;
    }
    notyf.error(data?.message);
  };

  const updateProduct = async () => {};

  return (
    <>
      <TitleBox title={product?.name || "Product name"}>
        <CustomButton
          title="Info"
          handleClick={() => setSelectedMenu("info")}
        />
        <CustomButton
          title="All product"
          handleClick={() => setSelectedMenu("product")}
        />
      </TitleBox>
      <ContentBox padding>
        <CustomModalV2
          title="Product Unit detail"
          open={editModalOpen}
          setOpen={setEditModalOpen}
        >
          {selectedProductUnit && (
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
                    {selectedProductUnit.productBatchId}
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
                    {selectedProductUnit.serialNumber}
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
                    Customer
                  </Typography>
                  <Typography fontSize={"0.875rem"} fontWeight={400}>
                    {selectedProductUnit.customerId
                      ? selectedProductUnit.customerId.name
                      : "-"}
                  </Typography>
                </Stack>
              </CustomCard>
            </Stack>
          )}
        </CustomModalV2>

        {productUnits && selectedMenu === "product" && (
          <>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"row"} gap={1}>
                <CustomModal
                  title={"Register product"}
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
                        Array.isArray(productBatch)
                          ? productBatch.map((batch) => ({
                              label: batch._id,
                              value: batch._id,
                            }))
                          : []
                      }
                      value={formData.productBatchId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productBatchId: e.target.value,
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
              data={productUnits}
              columns={productUnitColumn}
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

        {product && selectedMenu === "info" && (
          <ProductDetailForm product={product} onSubmit={updateProduct} />
        )}
      </ContentBox>
    </>
  );
};

export default ProductDetailPage;
