import { Notyf } from "notyf";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAssignment from "../../hook/assignment.hook";
import { AssignmentWithParts } from "../../interface/IAssignment";
import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import { Paper, Stack, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CustomButton from "../../components/button/CustomButton";

const notyf = new Notyf();

function AssignmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getAssignmentDetailById, approveAssignment, loading } =
    useAssignment();

  const [assignment, setAssignment] = useState<AssignmentWithParts>();

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id: string) => {
    const data = await getAssignmentDetailById(id);
    if (data?.success) {
      setAssignment(data.data.assignmentWithParts);
    }
  };

  const handleApprove = async (id: string) => {
    const data = await approveAssignment(id);
    if (data.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/assignment");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Assignment detail" />
      <ContentBox padding>
        <Stack direction={"row"} gap={2}>
          <InfoIcon sx={{ color: "custom.linkButton" }} />
          <Typography
            fontSize={"1rem"}
            fontWeight={700}
            mb={"20px"}
            color="text.primary"
          >
            Transition info
          </Typography>
        </Stack>

        {assignment && !loading && (
          <Paper
            elevation={0}
            sx={{
              paddingX: "24px",
              paddingY: "16px",
              backgroundColor: "custom.customButton",
            }}
          >
            <Stack>
              <Stack direction={"row"} gap={2}>
                <Typography fontSize={"0.9rem"} fontWeight={700}>
                  Assignment_id :
                </Typography>
                <Typography fontSize={"0.9rem"}>{assignment._id}</Typography>
              </Stack>
            </Stack>
          </Paper>
        )}
        <Stack direction={"row"} mt={2}>
          <CustomButton
            title="Approve"
            type="submit"
            handleClick={() => handleApprove(assignment!._id)}
          />
        </Stack>
      </ContentBox>
    </>
  );
}

export default AssignmentDetailPage;
