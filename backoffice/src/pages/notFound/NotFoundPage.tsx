import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import { Typography } from "@mui/material";

function NotFoundPage() {
  return (
    <>
      <TitleBox title={"Page not found"} />
      <ContentBox padding>
        <Typography>
          No worries! Let’s take you back while our bear is searching everywhere
        </Typography>
      </ContentBox>
    </>
  );
}

export default NotFoundPage;
