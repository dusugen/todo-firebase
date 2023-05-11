import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { deleteTodo, updateTodo } from "../../../core/store/slices/todosSlice";
import { useThunkDispatch } from "../../../core/store/store";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface TodoItemProps {
  id: string;
  isDone: boolean;
  title: string;
  deadline: string;
}

const TodoItem: FC<TodoItemProps> = ({ id, title, isDone, deadline }) => {
  const dispatch = useThunkDispatch();
  const today = dayjs(Date.now());

  const diff = today.diff(dayjs(deadline, "YYYY-MM-DD"), "day");

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: `${isDone ? "#dbfdd8" : "white"}`,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingBottom="20px"
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onClick={() => dispatch(updateTodo({ id, isDone: !isDone }))}
                  checked={isDone}
                />
              }
              label={title}
            />
          </FormGroup>
          <Link to={id}>
            <EditIcon />
          </Link>
        </Box>
        <Button
          onClick={() => dispatch(deleteTodo(id))}
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Typography
          paddingTop="10px"
          fontSize="12px"
          color={diff < 0 ? "inherit" : diff === 0 ? "orange" : "red"}
        >
          {deadline !== "Invalid Date"
            ? `Need to make until ${deadline}`
            : "No date"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
