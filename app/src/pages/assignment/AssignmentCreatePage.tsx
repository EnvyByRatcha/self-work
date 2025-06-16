import { useNavigate } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import AssignmentForm from "../../components/form/AssignmentForm";
import useAssignment from "../../hook/assignment.hook";
import { AssignmentFormData } from "../../interface/IAssignment";

function AssignmentCreatePage() {
  const navigate = useNavigate();
  const { createAssignment } = useAssignment();

  const handleAssignmentFormSubmit = async (payload: AssignmentFormData) => {
    const data = await createAssignment(payload);
    if (data.success) {
      navigate("/assignment");
    }
  };

  return (
    <ContentBox padding>
      <AssignmentForm onSubmit={handleAssignmentFormSubmit} />
    </ContentBox>
  );
}

export default AssignmentCreatePage;
