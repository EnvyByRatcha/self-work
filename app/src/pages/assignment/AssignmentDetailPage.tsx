import { useEffect, useState } from "react";
import ContentBox from "../../components/common/ContentBox";
import useAssignment from "../../hook/assignment.hook";
import {
  AssignmentDetailFormData,
  AssignmentWithParts,
} from "../../interface/IAssignment";
import { useNavigate, useParams } from "react-router-dom";
import CustomCard from "../../components/common/CustomCard";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import AssignmentDetailForm from "../../components/form/AssignmentDetailForm";

function AssignmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getAssignmentDetailById, createAssignmentDetail } = useAssignment();

  const [assignmentWithParts, setAssignmentwithParts] =
    useState<AssignmentWithParts>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id]);

  const fetchAssignment = async (id: string) => {
    setLoading(true);
    const data = await getAssignmentDetailById(id);
    if (data?.success) {
      setAssignmentwithParts(data.data.assignmentWithParts);
    }
    setLoading(false);
  };

  const handleCreateAssignmentDetail = async (
    payload: AssignmentDetailFormData
  ) => {
    const data = await createAssignmentDetail(id!, payload);
    if (data.success) {
      navigate("/assignment");
    }
  };

  const renderAssignmentDetail = assignmentWithParts && (
    <CustomCard>
      <Typography variant="h6" gutterBottom>
        รายละเอียดงาน: {assignmentWithParts.title}
      </Typography>

      <Box mb={2}>
        <Typography>
          Serial Number: {assignmentWithParts.serialNumber}
        </Typography>
        <Typography>
          Customer Code: {assignmentWithParts.customerCode}
        </Typography>
        <Typography>Solution: {assignmentWithParts.solution}</Typography>
        <Typography>
          Address Remark: {assignmentWithParts.addressRemark}
        </Typography>
        <Typography>Status: {assignmentWithParts.status}</Typography>
        <Typography>
          Created At:{" "}
          {dayjs(assignmentWithParts.createdAt).format("DD/MM/YYYY HH:mm")}
        </Typography>
      </Box>
    </CustomCard>
  );

  return (
    <ContentBox padding>
      <Box>
        {loading ? (
          <Typography>กำลังโหลดข้อมูล...</Typography>
        ) : (
          renderAssignmentDetail || <Typography>ไม่พบข้อมูลงานนี้</Typography>
        )}
      </Box>

      <Box mt={2}>
        {assignmentWithParts && assignmentWithParts.status == "pending" && (
          <AssignmentDetailForm onSubmit={handleCreateAssignmentDetail} />
        )}
      </Box>
    </ContentBox>
  );
}

export default AssignmentDetailPage;
