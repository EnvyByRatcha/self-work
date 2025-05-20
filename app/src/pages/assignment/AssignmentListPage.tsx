import useAssignment from "../../hook/assignment.hook";

function AssignmentListPage() {
  const { assignments } = useAssignment();

  return <div>AssignmentListPage</div>;
}

export default AssignmentListPage;
