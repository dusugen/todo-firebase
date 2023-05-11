import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Form from "../../components/smart/Form";
import {
  deleteTodo,
  fetchSingleTodo,
  resetField,
  selectSingleTodo,
} from "../../core/store/slices/todosSlice";
import { useThunkDispatch } from "../../core/store/store";

const TodoPage: FC = () => {
  const dispatch = useThunkDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(resetField());
      dispatch(fetchSingleTodo(id));
    }
  }, [dispatch, id]);

  const { data } = useSelector(selectSingleTodo);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {data && id && (
        <Card
          variant="outlined"
          sx={{
            backgroundColor: `${data.isDone ? "#dbfdd8" : "white"}`,
            width: "60%",
          }}
        >
          <CardContent>
            <Form
              title={data.title}
              deadline={dayjs(data.deadline)}
              buttonName="save"
            />
            <Button
              onClick={() => dispatch(deleteTodo(data.id))}
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Typography paddingTop="10px" fontSize="12px">
              {data.deadline !== "Invalid Date"
                ? `Need to make until ${data.deadline}`
                : "No date"}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TodoPage;
