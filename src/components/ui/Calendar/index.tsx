import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { FC } from "react";

interface CalendarProps {
  formik: any;
  onChangeDate: (value: Dayjs | null) => void;
}

const Calendar: FC<CalendarProps> = ({ formik, onChangeDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Choose date"
        value={formik.values.deadline}
        format="YYYY-MM-DD"
        onChange={(newValue) => onChangeDate(newValue)}
        slotProps={{
          textField: {
            helperText: "YYYY-MM-DD",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
