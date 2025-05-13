import ContentBox from "../../components/common/ContentBox";
import AssignmentForm from "../../components/form/AssignmentForm";

function AssignmentCreatePage() {
  const handleAssignmentFormSubmit = () => {
    console.log("handleAssignmentFormSubmit");
  };

  return (
    <ContentBox padding>
      <AssignmentForm onSubmit={handleAssignmentFormSubmit} />
    </ContentBox>
  );
}

export default AssignmentCreatePage;
