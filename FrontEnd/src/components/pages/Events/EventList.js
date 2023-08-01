import React from "react";
import EventItem from "./EventItem";

function EventList({ events }) {
  return (
    <div className="event-list-row">
      {events.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </div>
  );
}

export default EventList;
