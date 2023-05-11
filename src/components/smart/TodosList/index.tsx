import { Container, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTodos } from "../../../core/store/slices/todosSlice";
import TodoItem from "../../simple/TodoItem";

const TodoList = () => {
  const { data } = useSelector(selectTodos);

  return (
    <Container maxWidth="md">
      <Grid container spacing="20px">
        {data.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={item.id}>
              <TodoItem
                id={item.id}
                isDone={item.isDone}
                title={item.title}
                deadline={item.deadline}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default TodoList;
