import { useEffect, useState } from "react";
import ContentBox from "../../components/common/ContentBox";
import useAssignment from "../../hook/assignment.hook";
import {
  AssignmentDetailFormData,
  AssignmentWithParts,
} from "../../interface/IAssignment";
import { useParams } from "react-router-dom";
import CustomCard from "../../components/common/CustomCard";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import AssignmentDetailForm from "../../components/form/AssignmentDetailForm";

function AssignmentDetailPage() {
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
    console.log(data);
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

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Used Spare Parts</Typography>
      {assignmentWithParts.usedSparePart?.length > 0 ? (
        <List dense>
          {assignmentWithParts.usedSparePart.map((part, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${part.sparePartId || "ไม่ระบุชื่อ"} - จำนวน: ${0}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>ไม่มีการใช้อะไหล่</Typography>
      )}
    </CustomCard>
  );

  return (
    <ContentBox padding>
      {loading ? (
        <Typography>กำลังโหลดข้อมูล...</Typography>
      ) : (
        renderAssignmentDetail || <Typography>ไม่พบข้อมูลงานนี้</Typography>
      )}

      {assignmentWithParts && assignmentWithParts.status == "pending" && (
        <AssignmentDetailForm onSubmit={handleCreateAssignmentDetail} />
      )}
    </ContentBox>
  );
}

export default AssignmentDetailPage;
