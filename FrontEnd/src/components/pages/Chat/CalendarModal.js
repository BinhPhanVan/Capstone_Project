import React, { useState } from 'react';
import { Modal, Button } from '@mui/material';
import { Input } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { get_interview, interview_setup, selectIsLoading } from '../../../store/InterviewSlice';
import { toast } from 'react-toastify';
import EventList from '../Events/EventList';
import SpinnerLoading from '../../commons/SpinnerLoading';
import firebaseService from '../../../api-service/firebaseService';
import { useParams } from 'react-router-dom';

const CalendarModal = ({ showModal, handleCloseModal, user }) => {
  const { chatId } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const dispatch = useDispatch();
  const user_info = useSelector(selectUserInfo);
  const [events, setEvents] = useState([]);
  const handleChange = async (event) => {
    const date = event.target.value;
    const data = 
    {
      "date": date,
      "recruiter_email": user_info.account.email,
    };
    
    const actionResult = await dispatch(get_interview(data));

    if (actionResult.meta.requestStatus === "fulfilled") {
      setEvents(actionResult.payload.data);
      toast.success(actionResult.payload["message"]);
    }

    if (actionResult.meta.requestStatus === "rejected") {
      toast.error(actionResult.payload);
    }
    setSelectedDate(date);
  };

  const startTime = '07:00';
  const endTime = '17:30';
  const interval = 30;
  const [selectedStartTime, setSelectedStartTime] = useState(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);
  const loading = useSelector(selectIsLoading);

  const generateTimeOptions = () => {
    const options = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let hour = startHour;
    let minute = startMinute;

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(<MenuItem value={time} key={time}>{time}</MenuItem>);

      minute += interval;
      if (minute >= 60) {
        hour += 1;
        minute = 0;
      }
    }

    return options;
  };

  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
  };

  const handleSchedule = async() => {
    const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.split(':').map(Number);
    const data = 
    {
      "employee_email": user.email,
      "recruiter_email": user_info.account.email,
      "hour_start": startHour,
      "minute_start": startMinute,
      "hour_end": endHour,
      "minute_end": endMinute,
      "date": selectedDate,
    };
    
    const actionResult = await dispatch(interview_setup(data));
    if (interview_setup.fulfilled.match(actionResult)) {
        if(actionResult.payload["status"] !== 201)
        {
          toast.error(actionResult.payload["message"]);
        }
        else
        {
          toast.success(actionResult.payload["message"]);
          handleCloseModal();
          setSelectedDate('');
          setEvents([]);
          const interview = {
            interview_id: actionResult.payload.data.interview_id,
            date: selectedDate,
            employee_email: user.email,
            hour_end: endHour,
            hour_start: startHour,
            minute_end: endMinute,
            minute_start: startMinute,
            recruiter_email: user_info.account.email,
            status: "pending",
          };
          firebaseService.sendMessage1(chatId, user_info, interview, 'interview');
        }
    }
    if (interview_setup.rejected.match(actionResult)) {
        toast.error(actionResult.payload);
    }
  };

  return  loading?<SpinnerLoading loading={loading}/>:(
    <Modal
      className="modal-calendar-container"
      open={showModal}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className="modal-calendar-content">
        <button className="close-button" onClick={handleCloseModal}>
          X
        </button>
        <h4>Schedule Interview</h4>
        <div>
          <form className="">
            <div>
              <label className="form-label" htmlFor="interviewDate">
                Interview Date
              </label>
              <br/>
              <div className="date-input">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <br/>
            <div>
              <label className="form-label" htmlFor="interviewTime">
                Interview Time
              </label>
              <div className="time-select-container">
                <span>From</span>
                <Select 
                  value={selectedStartTime} 
                  onChange={handleStartTimeChange}
                  style={{ height: '40px', width: '100px', marginLeft: '1rem'}}
                >
                  {generateTimeOptions()}
                </Select>
                <span style={{ marginLeft: '2rem'}} >To</span>
                <Select 
                  value={selectedEndTime} 
                  onChange={handleEndTimeChange}
                  style={{ height: '40px', width: '100px', marginLeft: '1rem'}}>
                  {generateTimeOptions()}
                </Select>
              </div>
            </div>
          </form>
          <br/>
          <div className='all-interview-container'>
              <label>
                All Interview
              </label>
              <br/>
              <br></br>
              {events.length !== 0 ? <EventList events={events} /> : <p style={{ color: '#999' }}>There are no interviews today.</p>}
          </div>
        </div>
        <div className="modal-btn-calendar">
          <Button 
            className='schedule-btn'
            onClick={handleSchedule} disabled={selectedDate === ""}>
            Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
