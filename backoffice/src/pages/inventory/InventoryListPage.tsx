import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { inventoryTransitionColumn } from "../../constants/inventoryTransitionColumn";
import CustomTable from "../../components/table/CustomTable";

const InventoryListPage = () => {
  const { inventoryTransitions } = useInventoryTransition();

  return (
    <>
      <TitleBox title={"Inventory management"} />
      <ContentBox>
        <LinkButton title="Add Transition" to="/inventory/create" />
        <CustomTable
          data={inventoryTransitions}
          columns={inventoryTransitionColumn}
          isLinkButton
        />
      </ContentBox>
    </>
  );
};

export default InventoryListPage;
