import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useCustomer from "../../hook/customer.hook";
import type { Customer } from "../../interface/ICustomer";
import { useEffect, useState } from "react";
import CustomTable from "../../components/table/CustomTable";
import { ProductUnit } from "../../interface/IProduct";
import useProductUnit from "../../hook/productUnit.hook";
import { productUnitColumn } from "../../constants/productUnitColumn";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const { getCustomerById } = useCustomer();
  const { getProductUnitByCustomerId } = useProductUnit();

  const [customer, setCustomer] = useState<Customer>();
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (id: string) => {
    fetchCustomer(id);
    fetchProductUnit(id);
  };

  const fetchCustomer = async (id: string) => {
    const data = await getCustomerById(id);
    if (data?.success) {
      setCustomer(data.data.customer);
    }
  };

  const fetchProductUnit = async (id: string) => {
    const data = await getProductUnitByCustomerId(id);
    if (data?.success) {
      setProductUnits(data.data.productUnits);
    }
  };

  return (
    <>
      <TitleBox title={customer?.name || "Customer name"} />
      <ContentBox padding>
        <CustomTable data={productUnits} columns={productUnitColumn} />
      </ContentBox>
    </>
  );
};

export default CustomerDetailPage;
