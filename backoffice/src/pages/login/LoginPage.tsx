import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import authService from "../../service/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      await authService.login(email, password).then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        }
      });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#309898",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 4, sm: 5 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Back<span style={{ color: theme.palette.primary.main }}>O</span>ffice
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            size="small"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
