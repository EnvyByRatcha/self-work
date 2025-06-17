import { useNavigate } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import CustomerForm from "../../components/form/CustomerForm";
import useCustomer from "../../hook/customerHook/customer.hook";
import type { CustomerFormData } from "../../interface/ICustomer";
import { Notyf } from "notyf";

const notyf = new Notyf();

const CustomerCreatePage = () => {
  const navigate = useNavigate();
  const { createCustomer } = useCustomer();

  const handleCustomerFormSubmit = (userFormData: CustomerFormData) => {
    createCustomer(userFormData).then((data) => {
      if (data.success) {
        notyf.success(data.message);
        setTimeout(() => {
          navigate("/customer");
        }, 2000);
        return;
      }
      notyf.error(data?.message);
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
