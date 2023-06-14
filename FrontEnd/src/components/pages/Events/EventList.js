import React from "react";
import EventItem from "./EventItem";

function EventList({ events }) {
  return (
    <div>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
