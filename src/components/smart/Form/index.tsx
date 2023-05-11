import { Box, Button, TextField } from "@mui/material";
import { postTodo, updateTodo } from "../../../core/store/slices/todosSlice";
import { useThunkDispatch } from "../../../core/store/store";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validationSchema } from "../../../core/schemes/validationSchema";

interface FormProps {
  title?: string;
  deadline?: Dayjs;
  buttonName: "save" | "add todo";
}

const Form: FC<FormProps> = ({ title, deadline, buttonName }) => {
  const dispatch = useThunkDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const deadlineValue = deadline ? dayjs(deadline) : dayjs("");

  const formik = useFormik({
    initialValues: {
      title: title || "",
      deadline: deadlineValue || dayjs(""),
    },
    validationSchema: validationSchema,
    onSubmit: (value) => {
      if (buttonName === "save" && id) {
        dispatch(
          updateTodo({ id, title: value.title, deadline: value.deadline })
        );
      } else {
        dispatch(postTodo({ title: value.title, deadline: value.deadline }));
      }
      formik.handleReset(value);
      navigate("/");
    },
  });

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap="20px"
      width="100%"
      justifyContent="center"
      alignSelf="center"
      paddingBottom="20px"
      onSubmit={formik.handleSubmit}
    >
      <TextField
        value={formik.values.title}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        onChange={formik.handleChange("title")}
        label="Enter value"
        variant="outlined"
        name="title"
        id="title"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Choose date"
          value={formik.values.deadline}
          format="YYYY-MM-DD"
          onChange={(value) => formik.setFieldValue("deadline", value, true)}
          slotProps={{
            textField: {
              variant: "outlined",
              error: false,
            },
          }}
        />
      </LocalizationProvider>
      <Button
        type="submit"
        variant="contained"
        sx={{ width: "200px", alignSelf: "center" }}
      >
        {buttonName}
      </Button>
    </Box>
  );
};

export default Form;
