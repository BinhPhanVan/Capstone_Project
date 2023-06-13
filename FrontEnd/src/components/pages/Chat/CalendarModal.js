import React, { useState } from 'react';
import { Modal, Button } from '@mui/material';
import { Input } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { interview_setup, selectIsLoading } from '../../../store/InterviewSlice';
import { toast } from 'react-toastify';
import SpinnerLoading from '../../commons/SpinnerLoading';

const CalendarModal = ({ showModal, handleCloseModal, user }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const dispatch = useDispatch();
  const user_info = useSelector(selectUserInfo);
  const handleChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
  };

  const startTime = '07:00';
  const endTime = '17:30';
  const interval = 30;
  const [selectedStartTime, setSelectedStartTime] = useState(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);

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
        toast.success(actionResult.payload["message"]);
    }
    if (interview_setup.rejected.match(actionResult)) {
        toast.error(actionResult.payload);
    }
    handleCloseModal();
  };
  const loading = useSelector(selectIsLoading);

  return loading?<SpinnerLoading loading={loading}/> :(
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
        </div>
        <div className="modal-btn-calendar">
          <Button variant="contained" onClick={handleSchedule} disabled={selectedDate === ""}>
            Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
