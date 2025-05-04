import { useNavigate } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import CustomerForm from "../../components/form/CustomerForm";
import useCustomer from "../../hook/customer.hook";
import type { CustomerFormData } from "../../interface/ICustomer";

const CustomerCreatePage = () => {
  const navigate = useNavigate();
  const { createCustomer } = useCustomer();

  const handleCustomerFormSubmit = (userFormData: CustomerFormData) => {
    createCustomer(userFormData).then((data) => {
      if (data?.message == "success") {
        navigate("/customer");
      }
    });
  };

  return (
    <>
      <TitleBox title="Add customer" />
      <ContentBox padding>
        <CustomerForm onSubmit={handleCustomerFormSubmit} />
      </ContentBox>
    </>
  );
};

export default CustomerCreatePage;
