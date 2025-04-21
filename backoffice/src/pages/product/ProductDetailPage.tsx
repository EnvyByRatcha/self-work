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
import { Box, Paper, Stack, Typography } from "@mui/material";
import CustomModal from "../../components/Modal/CustomModal";
import CustomTextField from "../../components/input/CustomTextField";
import CustomButton from "../../components/button/CustomButton";
import CustomSelect from "../../components/input/CustomSelect";
import { ProductBash } from "../../interface/IProductBash";
import useProductBash from "../../hook/productBash.hook";
import useProductUnit from "../../hook/productUnit.hook";

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
      <ContentBox>
        <Stack direction={"row"}>
          {product && !loading && (
            <>
              <Paper>
                <Box style={{ marginTop: "20px" }}>
                  <img
                    src={product.photoUrl}
                    alt="Product Preview"
                    style={{
                      width: "100%",
                      maxWidth: "160px",
                      marginTop: "10px",
                      objectFit: "contain",
                      border: "1px solid rgb(195, 211, 219)",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Paper>
              <Paper>
                <Typography>{product.name}</Typography>
                <Typography>{product.status}</Typography>
                <Typography>{product.createdAt}</Typography>
                <Typography>{product.updatedAt}</Typography>
              </Paper>
            </>
          )}
        </Stack>
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
              gap: 2,
              marginTop: "12px",
            }}
          >
            <CustomSelect
              label="Category"
              name="categoryName"
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
            <CustomButton type="submit" title="register product" />
          </form>
        </CustomModal>
        {productUnits.map((item, index) => {
          return (
            <Typography>{`${index + 1} / ${item.serialNumber}`}</Typography>
          );
        })}
      </ContentBox>
    </>
  );
};

export default ProductDetailPage;
