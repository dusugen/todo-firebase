import * as yup from "yup";
import { object } from "yup";

export const validationSchema = object({
  title: yup
    .string()
    .required("Field can't be empty")
    .min(3, "Min length 3 symbols"),
});
