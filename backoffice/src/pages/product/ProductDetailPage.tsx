import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useProduct from "../../hook/product.hook";
import React, { useEffect, useState } from "react";
import {
  Product,
  ProductUnit,
  ProductUnitFormData,
} from "../../interface/IProduct";
import { Box, Stack, Typography } from "@mui/material";
import CustomModal from "../../components/Modal/CustomModal";
import CustomTextField from "../../components/input/CustomTextField";
import CustomButton from "../../components/button/CustomButton";
import CustomSelect from "../../components/input/CustomSelect";
import type { ProductBatch } from "../../interface/IProductBatch";
import useProductBash from "../../hook/productBatch.hook";
import useProductUnit from "../../hook/productUnit.hook";
import dayjs from "dayjs";
import { Notyf } from "notyf";
import CustomTable from "../../components/table/CustomTable";
import { productUnitColumn } from "../../constants/productUnitColumn";
import CustomModalV2 from "../../components/Modal/CustomModalV2";
import useCustomer from "../../hook/customer.hook";

const notyf = new Notyf();

const ProductDetailPage = () => {
  const { id } = useParams();

  const { getProductById } = useProduct();
  const { getBashByProductId } = useProductBash();
  const { getProductUnitByProductId, createProductUnit, updateProductUnit } =
    useProductUnit();
  const { customers } = useCustomer();

  const [product, setProduct] = useState<Product>();
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [productBatch, setProductBatch] = useState<ProductBatch[]>([]);

  const [selectedProductUnit, setSelectedProductUnit] =
    useState<ProductUnit | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
    fetchProductUnit(id);
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

  const fetchProductUnit = async (id: string) => {
    const data = await getProductUnitByProductId(id);
    if (data?.success) {
      setProductUnits(data.data.productUnits);
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
      return;
    }
    notyf.error(data?.message);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductUnit) {
      const data = await updateProductUnit(
        selectedProductUnit._id,
        selectedProductUnit
      );
      if (data.success) {
        notyf.success(data.message);
        setSelectedProductUnit(null);
        setEditModalOpen(false);
        return;
      }
      notyf.error(data?.message);
      return;
    }
    notyf.error("Id && Product-unit is invalid");
  };

  return (
    <>
      <TitleBox title={product?.name || "Product name"} />
      <ContentBox padding>
        {product && (
          <Stack direction={"row"} gap={2}>
            <Box>
              <img
                src={product.photoUrl}
                alt="Product Preview"
                style={{
                  width: "100%",
                  maxWidth: "160px",
                  objectFit: "contain",
                  border: "1px solid rgb(195, 211, 219)",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Box>
              <Typography color="textPrimary">{product.name}</Typography>
              <Typography color="textPrimary">{product.status}</Typography>
              <Typography color="textPrimary">
                {`Create: ${dayjs(product.createdAt).format("DD/MM/YYYY")}`}
              </Typography>
              <Typography color="textPrimary">
                {`Update: ${dayjs(product.updatedAt).format("DD/MM/YYYY")}`}
              </Typography>
            </Box>
          </Stack>
        )}
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
                setFormData({ ...formData, productBatchId: e.target.value })
              }
            />

            <CustomTextField
              label="Serial number"
              name="name"
              type="text"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
            />
            <CustomButton type="submit" title="Proceed" />
          </form>
        </CustomModal>

        <CustomModalV2
          title="Edit Product Unit"
          open={editModalOpen}
          setOpen={setEditModalOpen}
        >
          {selectedProductUnit && (
            <form
              onSubmit={handleEditSubmit}
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
                options={productBatch.map((batch) => ({
                  label: batch._id,
                  value: batch._id,
                }))}
                value={selectedProductUnit.productBatchId}
                onChange={(e) =>
                  setSelectedProductUnit({
                    ...selectedProductUnit,
                    productBatchId: e.target.value,
                  })
                }
              />
              <CustomTextField
                label="Serial number"
                name="serialNumber"
                type="text"
                required
                value={selectedProductUnit.serialNumber}
                onChange={(e) =>
                  setSelectedProductUnit({
                    ...selectedProductUnit,
                    serialNumber: e.target.value,
                  })
                }
              />
              <CustomSelect
                label="Customer"
                name="customerId"
                options={customers.map((customer) => ({
                  label: customer.name,
                  value: customer._id,
                }))}
                value={selectedProductUnit.customerId || ""}
                onChange={(e) =>
                  setSelectedProductUnit({
                    ...selectedProductUnit,
                    customerId: e.target.value,
                  })
                }
              />
              <CustomButton type="submit" title="Save changes" />
            </form>
          )}
        </CustomModalV2>

        {productUnits.length > 0 && (
          <CustomTable
            data={productUnits}
            columns={productUnitColumn}
            onEdit={handleEdit}
          />
        )}
      </ContentBox>
    </>
  );
};

export default ProductDetailPage;
