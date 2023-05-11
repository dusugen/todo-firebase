import {
  EventContentArg,
  EventDropArg
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  EventLeaveArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Box, Button, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  dragTodo,
  selectFiltredTodo,
} from "../../core/store/slices/todosSlice";
import { useThunkDispatch } from "../../core/store/store";
import { ExternalEventProps } from "../../core/types/externalEvent";

const ExternalEvent: FC<ExternalEventProps> = ({ event }) => {
  let elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elRef.current) {
      let draggable = new Draggable(elRef.current, {
        eventData: function () {
          return { ...event, create: true };
        },
      });
      return () => draggable.destroy();
    }
  });

  return (
    <Box
      ref={elRef}
      title={event.title}
      height="20px"
      width="150px"
      borderRadius="5px"
      bgcolor="teal"
      color="white"
      padding="10px"
    >
      <strong>{event.title}</strong>
    </Box>
  );
};

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <Link to={`/${eventInfo.event.id}`} style={{ textDecoration: "none" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="10px"
      >
        <Typography color="white">{eventInfo.event.title}</Typography>
      </Box>
    </Link>
  );
}

const CalendarPage = () => {
  const dispatch = useThunkDispatch();

  const onDrag = (info: EventDropArg) => {
    const event = {
      id: info.event.id,
      deadline: info.event.startStr,
    };
    dispatch(dragTodo(event));
  };

  const { withDate, withoutDate } = useSelector(selectFiltredTodo);

  const eventsWithoutDate = withoutDate.map((item) => {
    return {
      editable: !item.isDone,
      title: item.title,
      id: item.id,
      backgroundColor: item.isDone ? "darkslateblue" : "violet",
    };
  });

  const eventsWithDate = withDate.map((item) => ({
    editable: !item.isDone,
    title: item.title,
    id: item.id,
    start: dayjs(item.deadline).format("YYYY-MM-DD"),
    backgroundColor: item.isDone ? "teal" : "tomato",
  }));

  const [externalEvents, setExternalEvents] = useState<
    typeof eventsWithoutDate
  >([]);

  console.log(externalEvents, "external");

  useEffect(() => {
    if (eventsWithoutDate.length && !externalEvents.length) {
      setExternalEvents(eventsWithoutDate);
    }
  }, [eventsWithoutDate, externalEvents]);

  const handleEventReceive = (event: EventLeaveArg) => {
    const externalId = event.event.id;
    // const externalId = event.event._def.publicId;
    const test = {
      id: externalId,
      deadline: dayjs(event.event.start).format("YYYY-MM-DD"),
    };
    dispatch(dragTodo(test))
      .unwrap()
      .finally(() => {
        setExternalEvents(
          eventsWithoutDate.filter((event) => event.id !== externalId)
        );
      });
  };

  return (
    <>
      <Link
        to="/"
        style={{ alignSelf: "end", marginRight: "10px", cursor: "pointer" }}
      >
        <Button variant="contained">Back</Button>
      </Link>
      <Container maxWidth="lg">
        <Box
          id="external-events"
          display="flex"
          flexDirection="row"
          color="white"
          padding="20px"
          height="100%"
          mb="20px"
          gap="10px"
          minWidth="200px"
        >
          {externalEvents.map((event) => (
            <Box
              sx={{ cursor: "pointer" }}
              bgcolor="teal"
              borderRadius="10px"
              textAlign="center"
            >
              <ExternalEvent key={event.id} event={event} />
            </Box>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap="30px">
          <Box display="flex" justifyContent="end"></Box>
          <FullCalendar
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            plugins={[dayGridPlugin, interactionPlugin]}
            droppable={true}
            initialView="dayGridMonth"
            weekends={true}
            editable={true}
            events={eventsWithDate}
            eventReceive={handleEventReceive}
            eventContent={renderEventContent}
            eventDrop={onDrag}
          />
        </Box>
      </Container>
    </>
  );
};

export default CalendarPage;
