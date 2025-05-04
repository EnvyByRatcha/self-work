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
import { ProductBash } from "../../interface/IProductBash";
import useProductBash from "../../hook/productBash.hook";
import useProductUnit from "../../hook/productUnit.hook";
import dayjs from "dayjs";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { getProductById } = useProduct();
  const { getBashByProductId } = useProductBash();
  const { getProductUnitByProductId, createProductUnit } = useProductUnit();

  const [product, setProduct] = useState<Product>();
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [productBashes, setProductBashes] = useState<ProductBash[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<ProductUnitFormData>({
    productId: id!,
    serialNumber: "",
    productBashId: "",
  });

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (id: string) => {
    fetchProduct(id);
    fetchProductBash(id);
    fetchProductUnit(id);
    setLoading(false);
  };

  const fetchProduct = (id: string) => {
    getProductById(id).then((result) => {
      if (result) {
        setProduct(result.product);
      }
    });
  };

  const fetchProductBash = (id: string) => {
    getBashByProductId(id).then((result) => {
      if (result) {
        setProductBashes(result.productBashes);
      }
    });
  };

  const fetchProductUnit = (id: string) => {
    getProductUnitByProductId(id).then((result) => {
      if (result) {
        setProductUnits(result?.productUnits);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductUnit(formData).then((result) => {
      console.log(result);
    });
  };

  return (
    <>
      <TitleBox title={product?.name || "Product name"} />
      <ContentBox padding>
        {product && !loading && (
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
              label="Bash-Id"
              name="productBashId"
              options={productBashes.map((bash) => {
                return { label: bash._id, value: bash._id };
              })}
              value={formData.productBashId}
              onChange={(e) =>
                setFormData({ ...formData, productBashId: e.target.value })
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
        {productUnits.map((item, index) => {
          return (
            <Typography key={index} color="textPrimary" mt={2}>{`${
              index + 1
            }. ${item.serialNumber}`}</Typography>
          );
        })}
      </ContentBox>
    </>
  );
};

export default ProductDetailPage;
