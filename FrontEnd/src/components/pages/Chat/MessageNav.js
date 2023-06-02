import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { selectIsAdmin } from '../../../store/AuthSlice';
import { useSelector } from 'react-redux';
import { Tooltip } from '@material-ui/core';
function MessageNav({ user }) {
  const isAdmin = useSelector(selectIsAdmin);
  return (
    <Box display="flex" alignItems="center" mb={1} className='message-user-nav'>
      <Typography variant="h6" className='nav-name-text'>{user?.name}</Typography>
      {isAdmin ? 
        <Tooltip title="Schedule">
            <CalendarMonthIcon className='schedule-icon'/>
        </Tooltip> : <></>
      }
      <Tooltip title="Option">
        <MoreHorizIcon className='more-icon'/>
      </Tooltip>  
      
    </Box>
  );
}

export default MessageNav;
