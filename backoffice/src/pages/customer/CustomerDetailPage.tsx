import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useCustomer from "../../hook/customerHook/customer.hook";
import type {
  Customer,
  CustomerFormDataForUpdate,
} from "../../interface/ICustomer";
import { useEffect, useState } from "react";
import CustomTable from "../../components/table/CustomTable";
import { productUnitColumn } from "../../constants/productUnitColumn";
import CustomerDetailForm from "../../components/form/CustomerDetailForm";
import CustomButton from "../../components/button/CustomButton";
import { Notyf } from "notyf";
import { userColumn } from "../../constants/userColumn";
import { Stack } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import TablePaginate from "../../components/common/TablePaginate";
import FilterDropDown from "../../components/common/FilterDropDown";
import useCustomerProduct from "../../hook/customerHook/customerProduct.hook";
import useCustomerTechnician from "../../hook/customerHook/customerTechnician.hook";

const notyf = new Notyf();

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Onsite", value: "onsite" },
];

const technicianStatusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];
const levelOptions = [
  { label: "All", value: "all" },
  { label: "Technician", value: "technician" },
  { label: "Lead-technician", value: "lead-technician" },
];

const CustomerDetailPage = () => {
  const { id } = useParams();

  const {
    productUnits,
    totalPage: totalPageProductUnit,
    currentPage: currentPageProductUnit,
    setCurrentPage: setCurrentPageProductUnit,
    searchTerm: searchTermProductUnit,
    setSearchTerm: setSearchTermProductUnit,
    setStatusFilter: setStatusFilterProductUnit,
  } = useCustomerProduct(id!);

  const {
    technicians,
    totalPage: totalPageTechnician,
    currentPage: currentPageTechnician,
    setCurrentPage: setCurrentPageTechnician,
    searchTerm: searchTermTechnician,
    setSearchTerm: setSearchTermTechnician,
    setStatusFilter: setStatusFilterTechnician,
    setLevelFilter: setLevelFilterTechnician,
  } = useCustomerTechnician(id!);

  const { getCustomerById, updateCustomerById } = useCustomer();

  const [customer, setCustomer] = useState<Customer>();

  const [selectedMenu, setSelectedMenu] = useState<String>("product");

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchCustomer = async (id: string) => {
    const data = await getCustomerById(id);
    if (data?.success) {
      setCustomer(data.data.customer);
    }
  };

  const updateCustomer = async (payload: CustomerFormDataForUpdate) => {
    if (id) {
      const data = await updateCustomerById(id, payload);
      if (data.success) {
        notyf.success(data.message);
        fetchCustomer(id);
        return;
      }
      notyf.error(data?.message);
      return;
    }
    notyf.error("User id is undifine");
  };

  const renderProductUnitSection = productUnits &&
    selectedMenu === "product" && (
      <>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <SearchBox
              label="serial number"
              type="text"
              searchTerm={searchTermProductUnit}
              onSearchChange={(value) => setSearchTermProductUnit(value)}
              onClear={() => setSearchTermProductUnit("")}
            />
          </Stack>
          <Stack direction={"row"} gap={1}>
            <FilterDropDown
              title="Status"
              options={statusOptions}
              onSelect={(value) => setStatusFilterProductUnit(value)}
            />
          </Stack>
        </Stack>
        <CustomTable data={productUnits} columns={productUnitColumn} />
        <TablePaginate
          currentPage={currentPageProductUnit}
          totalPage={totalPageProductUnit}
          onChangePage={(page) => setCurrentPageProductUnit(page)}
        />
      </>
    );

  const renderTechnicianSection = technicians &&
    selectedMenu == "technician" && (
      <>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <SearchBox
              label="technician"
              type="text"
              searchTerm={searchTermTechnician}
              onSearchChange={(value) => setSearchTermTechnician(value)}
              onClear={() => setSearchTermTechnician("")}
            />
          </Stack>
          <Stack direction={"row"} gap={1}>
            <FilterDropDown
              title="level"
              options={levelOptions}
              onSelect={(value) => setLevelFilterTechnician(value)}
            />
            <FilterDropDown
              title="Status"
              options={technicianStatusOptions}
              onSelect={(value) => setStatusFilterTechnician(value)}
            />
          </Stack>
        </Stack>
        <CustomTable data={technicians} columns={userColumn} />
        <TablePaginate
          currentPage={currentPageTechnician}
          totalPage={totalPageTechnician}
          onChangePage={(page) => setCurrentPageTechnician(page)}
        />
      </>
    );

  return (
    <>
      <TitleBox title={customer?.name || "Customer name"}>
        <CustomButton
          title="Info"
          handleClick={() => setSelectedMenu("info")}
        />
        <CustomButton
          title="Product"
          handleClick={() => setSelectedMenu("product")}
        />
        <CustomButton
          title="Technician"
          handleClick={() => setSelectedMenu("technician")}
        />
      </TitleBox>
      <ContentBox padding>
        {customer && selectedMenu === "info" && (
          <CustomerDetailForm customer={customer} onSubmit={updateCustomer} />
        )}

        {renderProductUnitSection}

        {renderTechnicianSection}
      </ContentBox>
    </>
  );
};

export default CustomerDetailPage;
