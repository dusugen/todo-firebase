import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Form from "../../components/smart/Form";
import TodoList from "../../components/smart/TodosList";

const HomePage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap="30px"
    >
      <Box alignSelf="end" paddingRight="10px">
        <Link to="/calendar">
          <Button variant="contained">Calendar</Button>
        </Link>
      </Box>
      <TodoList />
      <Box
        width="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
      >
        <Form buttonName="add todo" />
      </Box>
    </Box>
  );
};

export default HomePage;
