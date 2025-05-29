import { Stack, Typography } from "@mui/material";
import useAssignment from "../../hook/assignment.hook";
import LinkButton from "../../components/common/LinkButton";
import CustomCard from "../../components/common/CustomCard";
import ContentBox from "../../components/common/ContentBox";
import dayjs from "dayjs";

function AssignmentListPage() {
  const { assignments } = useAssignment();

  const renderAssignment = assignments.map((assignment) => {
    return (
      <CustomCard key={assignment._id} href={`/assignment/detail/${assignment._id}`}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack>
            <Typography>{assignment.serialNumber}</Typography>
            <Typography>ID: {assignment._id}</Typography>
          </Stack>
          <Stack>
            <Typography>
              Create: {dayjs(assignment.createdAt).format("DD/MM/YYYY")}
            </Typography>
            <Typography>Status: {assignment.status}</Typography>
          </Stack>
        </Stack>
      </CustomCard>
    );
  });

  return (
    <ContentBox padding>
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Typography fontSize={"1.75rem"} fontWeight={700} color="textPrimary">
          Assignment list
        </Typography>
        <LinkButton title="Create" to="/assignment/create" />
      </Stack>
      {assignments.length > 0 && renderAssignment}
    </ContentBox>
  );
}

export default AssignmentListPage;
