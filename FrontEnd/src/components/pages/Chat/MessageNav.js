import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
function MessageNav({ user }) {
  return (
    <Box display="flex" alignItems="center" mb={1} className='message-user-nav'>
      <Typography variant="h6" className='nav-name-text'>{user?.name}</Typography>
      <CalendarMonthIcon className='schedule-icon'/>  
      <MoreHorizIcon className='more-icon'/>
    </Box>
  );
}

export default MessageNav;
