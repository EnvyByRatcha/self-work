import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

interface CustomCardProps {
  children: React.ReactNode;
  href?: string;
  handleClick?: () => void;
}

function CustomCard({ children, href, handleClick }: CustomCardProps) {
  const cardRender = (
    <Card
      onClick={handleClick}
      sx={{
        borderRadius: "8px",
        cursor: href ? "pointer" : "default",
      }}
    >
      <CardContent sx={{ p: "16px 24px" }}>{children}</CardContent>
    </Card>
  );

  return href ? <Link to={href}>{cardRender}</Link> : cardRender;
}

export default CustomCard;
