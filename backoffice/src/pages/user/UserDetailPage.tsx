import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useUser from "../../hook/user.hook";
import { useEffect, useState } from "react";
import { User } from "../../interface/IUser";
import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "../../components/common/CustomCard";
import InfoIcon from "@mui/icons-material/Info";

const UserDetailPage = () => {
  const { id } = useParams();

  const { getUserById } = useUser();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (id: string) => {
    const data = await getUserById(id);
    if (data?.success) {
      setUser(data.data.user);
    }
  };

  const renderUser = (
    <Box>
      <Grid container spacing={{ xs: 4, md: 0 }} rowGap={2}>
        <Stack direction={"row"} gap={2}>
          <InfoIcon sx={{ color: "custom.linkButton" }} />
          <Typography
            fontSize={"1rem"}
            fontWeight={700}
            mb={"20px"}
            color="text.primary"
          >
            Personal info
          </Typography>
        </Stack>

        <Grid size={{ xs: 12 }}>
          <CustomCard>
            <Stack direction={"row"} lineHeight={1.3}>
              <Typography
                minWidth={"120px"}
                fontSize={"0.875rem"}
                fontWeight={700}
              >
                First name
              </Typography>
              <Typography fontSize={"0.875rem"} fontWeight={400}>
                {user?.firstName}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              <Typography
                minWidth={"120px"}
                fontSize={"0.875rem"}
                fontWeight={700}
              >
                Last name
              </Typography>
              <Typography fontSize={"0.875rem"} fontWeight={400}>
                {user?.lastName}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomCard>
            <Stack direction={"row"} lineHeight={1.3}>
              <Typography
                minWidth={"120px"}
                fontSize={"0.875rem"}
                fontWeight={700}
              >
                Address
              </Typography>
              <Typography fontSize={"0.875rem"} fontWeight={400}>
                {"16/72"}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomCard>
            <Stack direction={"row"} lineHeight={1.3}>
              <Typography
                minWidth={"120px"}
                fontSize={"0.875rem"}
                fontWeight={700}
              >
                Number
              </Typography>
              <Typography fontSize={"0.875rem"} fontWeight={400}>
                {"(+66) 960193880"}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomCard>
            <Stack direction={"row"} lineHeight={1.3}>
              <Typography
                minWidth={"120px"}
                fontSize={"0.875rem"}
                fontWeight={700}
              >
                Primary Email
              </Typography>
              <Typography fontSize={"0.875rem"} fontWeight={400}>
                {user?.email}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      <TitleBox title={"User detail"} />
      <ContentBox padding>{user && renderUser}</ContentBox>
    </>
  );
};

export default UserDetailPage;
