import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function MessageUser({ avatar, name, message }) {
  return (
    <Box display="flex" alignItems="center" mb={1} className='message-user-item'>
      <Avatar src={avatar} alt="Avatar" />
      <Box ml={2}>
        <Typography variant="h6" className='name-text'>{name}</Typography>
        <Typography variant="body1" className='new-message'>{message}</Typography>
      </Box>
    </Box>
  );
}

export default MessageUser;
