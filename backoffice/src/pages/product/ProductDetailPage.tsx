import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useProduct from "../../hook/product.hook";
import { useEffect, useState } from "react";
import { Product } from "../../interface/IProduct";
import { Box, Paper, Stack, Typography } from "@mui/material";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { getProductById } = useProduct();

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = (id: string) => {
    getProductById(id).then((result) => {
      if (result) {
        setProduct(result.product);
      }
      setLoading(false);
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
      </ContentBox>
    </>
  );
};

export default ProductDetailPage;
