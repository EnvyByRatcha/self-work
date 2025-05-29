import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

interface CustomCardProps {
  children: React.ReactNode;
  href?: string;
}

function CustomCard({ children, href }: CustomCardProps) {
  const cardRender = (
    <Card
      sx={{
        borderRadius: "8px",
        cursor: href ? "pointer" : "default",
      }}
    >
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );

  return href ? <Link to={href}>{cardRender}</Link> : cardRender;
}

export default CustomCard;
