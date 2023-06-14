import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

function EventItem({ event }) {
  return (
    <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
      <Typography variant="h6" gutterBottom>
        {event.title}
      </Typography>
      <Typography variant="body1">{event.description}</Typography>
      <Typography variant="body2">
        Start Time: {event.hour_start}:{event.minute_start}
      </Typography>
      <Typography variant="body2">
        End Time: {event.hour_end}:{event.minute_end}
      </Typography>
    </Paper>
  );
}
export default EventItem;
