import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import { useUpdateData } from "./core/hooks/useUpadateData";
import { FC } from "react";
import TodoPage from "./pages/TodoPage";
import Header from "./components/ordinary/Header";
import { Box } from "@mui/material";

const App: FC = () => {
  useUpdateData();
  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/:id" element={<TodoPage />} />
      </Routes>
    </Box>
  );
};

export default App;
