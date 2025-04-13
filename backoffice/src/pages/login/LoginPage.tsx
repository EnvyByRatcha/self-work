import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import authService from "../../service/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      await authService.login(email, password).then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/user");
        }
      });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Self@Work
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
    </Container>
  );
}

export default LoginPage;
