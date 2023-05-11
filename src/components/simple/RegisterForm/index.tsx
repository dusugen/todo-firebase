import { Box, TextField } from "@mui/material";

const RegisterForm = () => {
  return (
    <Box component="form">
      <TextField label="Email" variant="filled" />
      <TextField label="Password" variant="filled" />
    </Box>
  );
};

export default RegisterForm;
