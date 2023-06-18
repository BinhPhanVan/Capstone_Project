import React from 'react';
import Button from '@mui/material/Button';
import { Avatar, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { update_interview_status } from '../../../store/InterviewSlice';
import { toast } from 'react-toastify';
import { APPROVAL, CANCEL, PENDING } from '../../../constants/interviewtype';
import firebaseService from '../../../api-service/firebaseService';
import { useParams } from 'react-router-dom';

function MessageSchedule({ message, align }) {
  const user_info = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const containerClass = align === 'left' ? 'messageitem_container_left' : 'messageitem_container_right';
  const { chatId } = useParams();
  const emebed =  (timestamp) =>
  {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getDate();
    var month = date.getMonth() + 1; 
    var year = date.getFullYear();
    return hours +":"+ minutes + ", "+ day + "/"+ month + "/" + year;
  };
  const handleApprove = async (message) => {
    const data = {
      id: message.message.interview_id,
      status : APPROVAL,
    }
    const actionResult = await dispatch(update_interview_status(data))
    if (update_interview_status.fulfilled.match(actionResult))
    {
      firebaseService.updateMessagesStatusByInterviewId(chatId, message.message.interview_id, APPROVAL)
      toast.success("Approve interview");
    }
    if (update_interview_status.rejected.match(actionResult))
    {
      toast.error("Approve failed");
    }
  };

  const handleCancel = async (message) => {
    const data = {
      id: message.message.interview_id,
      status : CANCEL,
    }
    const actionResult = await dispatch(update_interview_status(data))
    if (update_interview_status.fulfilled.match(actionResult))
    {
      firebaseService.updateMessagesStatusByInterviewId(chatId, message.message.interview_id, CANCEL)
      toast.success("Cancel interview");
    }
    if (update_interview_status.rejected.match(actionResult))
    {
      toast.error("Cancel failed");
    }
  };

  return (
    <Box className="messageitem_container" mb={1}>
      {align === 'left' ? (
        <Avatar src={message.avatar} alt={message.name} />
      ) : (
        <Box flex="0 0 40px" />
      )}
      <div className={`${containerClass}`}>
        <Box ml={align === 'left' ? 2 : 'auto'} className="message_content">
        <div className="message_schedule_container">
            <h4 className='schedule-title' >Interview</h4>
            <Typography variant="body1" className='schedule-content'><b>Time: </b>{message.message.hour_start.toString().padStart(2, '0')}:{message.message.minute_start.toString().padStart(2, '0')}  
             <span> - </span>{message.message.hour_end.toString().padStart(2, '0')}:{message.message.minute_end.toString().padStart(2, '0')} </Typography>
            <Typography variant="body1" className='schedule-content'><b>Date: </b>{message.message.date}</Typography>
            {message.message.status === PENDING ? (
                <>
                    {user_info.account.id === message.senderId ? 
                    <>
                      <Button variant="contained" color="primary" disabled className='btn btn-approve'>
                        Approve
                      </Button>
                    </> : 
                    <>
                      <Button variant="contained" color="primary" className='btn btn-approve' onClick={()=>handleApprove(message)}>
                        Approve
                      </Button>
                    </>}
                    
                    <Button variant="contained" className='btn btn-cancel' onClick={()=>handleCancel(message)}>
                    Cancel
                    </Button>
                </>
            ) : message.message.status === APPROVAL ? (
                <>
                    <Button variant="contained" color="primary" className='btn btn-approval'>
                    Approval
                    </Button>
                    <Button variant="contained" className='btn btn-cancel' disabled>
                    Cancel
                    </Button>
                </>
            ) : 
                <>
                    <Button variant="contained" color="primary" className='btn btn-approve' disabled >
                    Approval
                    </Button>
                    <Button variant="contained" className='btn btn-cancelled'>
                    Cancelled
                    </Button>
                </>
            }


            </div>
        </Box>
        <Typography variant="caption" color="textSecondary" className="timestamp">
          {emebed(message.timestamp)}
        </Typography>
      </div>
    </Box>
  );
}

export default MessageSchedule;
