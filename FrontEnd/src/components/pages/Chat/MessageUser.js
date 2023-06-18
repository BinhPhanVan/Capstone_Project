import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { selectIsAdmin } from '../../../store/AuthSlice';
import { useNavigate } from 'react-router-dom';

function MessageUser({ message }) {
  const user_info = useSelector(selectUserInfo);
  const isAdmin = useSelector(selectIsAdmin);
  const navigate = useNavigate();
  return (
    <Box 
      display="flex" 
      alignItems="center" 
      mb={1} 
      className='message-user-item'
      onClick={() => {
        if(isAdmin)
        {
          navigate(`/chat/${message.id}_${user_info.account.id}`);
        }
        else
        {
          navigate(`/chat/${user_info.account.id}_${message.id}`);
        }
        
      }}
    >
      <Avatar src={message.avatar} alt="Avatar" />
      <Box ml={2}>
        <Typography variant="h6" className='name-text'>{message.name}</Typography>
        {
          message.lastMessage?.type === 'message' ? (
            <>
              <Typography variant="body1" className='new-message'>{message.lastMessage?.message}</Typography>
            </>
          ) : (
            message.lastMessage?.type === 'interview' ? (
              <>
                <Typography variant="body1" className='new-message'>Sent Interview</Typography>
              </>
            ) : (
              <></>
            )
          )
        }
      </Box>
    </Box>
  );
}

export default MessageUser;
