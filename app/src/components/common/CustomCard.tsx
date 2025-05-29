import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

interface CustomCardProps {
  children: React.ReactNode;
  href?: string;
}

function CustomCard({ children, href }: CustomCardProps) {
  const cardRender = (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "8px",
        cursor: href ? "pointer" : "default",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );

  return href ? (
    <Link to={href} style={{ textDecoration: "none", color: "inherit" }}>
      {cardRender}
    </Link>
  ) : (
    cardRender
  );
}

export default CustomCard;
