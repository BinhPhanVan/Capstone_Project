import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { get_interview_by_email, selectIsInterviewByEmail, selectIsLoading } from '../../../store/InterviewSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';
import EventList from '../Events/EventList';

function Calendar() {
  useEffect(() => {
      document.title = "Calendar | Hire IT"
  }, []);
  const loading = useSelector(selectIsLoading);
  const user_info = useSelector(selectUserInfo);
  const selectEvents = useSelector(selectIsInterviewByEmail);
  const [events, setEvents] = useState(selectEvents);
  const [eventsinday, setEventsInDay] = useState([]);
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
      const data = {
          'email': user_info?.account.email
      }
      if (user_info) {
          dispatch(get_interview_by_email(data)).then((actionResult) => {
            if (get_interview_by_email.fulfilled.match(actionResult)) {
              setEvents(actionResult.payload.data);
            }
          });
        }
  }, [dispatch, user_info]);

  const getEventColor = (status) => {
      switch (status) {
        case 'approval':
          return '#119111';
        case 'cancel':
          return '#b22517';
        case 'pending':
          return '#c0c215';
        default:
          return '#3a516f';
      }};

  const updatedEvents = events.map((event) => ({
      ...event,
      title: event.employee_name,
      backgroundColor: getEventColor(event.status)
    }));

  const handleDateClick = (arg) => {
      const clickedDate = arg.date;
      const clickedDate1 = new Date(clickedDate);
      clickedDate1.setDate(clickedDate.getDate() + 1);
      const clickedDateString = clickedDate1.toISOString().split('T')[0];
      const filteredEvents = events.filter((event) => event.date === clickedDateString);
      setEventsInDay(filteredEvents);
      setDate(clickedDateString);
  };
    
return  loading ? <SpinnerLoading loading={loading}/> : (
    <div className='chat-container'>
        <Grid container spacing={2} className="custom-grid-container">
            <Grid item xs={3} className="chat-message-user">
              <h3 className='title-calendar'>{date}</h3>
              {eventsinday.length !== 0 ? <EventList events={eventsinday} /> : <p style={{ color: '#999' }} className='no-interview-calendar'>There are no interviews.</p>}
            </Grid>
            <Grid item xs={9} className="chat-message-content">
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={updatedEvents}
                    dateClick={handleDateClick}
                />
                </div>
            </Grid>
        </Grid>
    </div>
  );
}

export default Calendar;
