import React from 'react';
import Button from '@mui/material/Button';
import { Avatar, Box, Typography } from '@mui/material';

function MessageSchedule({ message, align }) {
    
  const containerClass = align === 'left' ? 'messageitem_container_left' : 'messageitem_container_right';
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
  const handleApprove = () => {
    // Handle approve button click
  };

  const handleCancel = () => {
    // Handle cancel button click
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
            <Typography variant="body1" className='schedule-content'><b>Time: </b>{message.message.hour_start}:{message.message.minute_start} to {message.message.hour_end}:{message.message.minute_end} </Typography>
            <Typography variant="body1" className='schedule-content'><b>Date: </b>{message.message.date}</Typography>
            {message.message.status === 'pending' ? (
                <>
                    <Button variant="contained" color="primary" className='btn btn-approve' onClick={handleApprove}>
                    Approve
                    </Button>
                    <Button variant="contained" className='btn btn-cancel' onClick={handleCancel}>
                    Cancel
                    </Button>
                </>
            ) : message.message.status === 'approve' ? (
                <>
                    <Button variant="contained" color="primary" className='btn btn-approval' onClick={handleApprove}>
                    Approval
                    </Button>
                    <Button variant="contained" className='btn btn-cancel' disabled onClick={handleCancel}>
                    Cancel
                    </Button>
                </>
            ) : 
                <>
                    <Button variant="contained" color="primary" className='btn btn-approve' disabled onClick={handleApprove}>
                    Approval
                    </Button>
                    <Button variant="contained" className='btn btn-cancelled' onClick={handleCancel}>
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
