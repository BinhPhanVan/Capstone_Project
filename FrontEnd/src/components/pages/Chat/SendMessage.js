import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import firebaseService from '../../../api-service/firebaseService';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
function SendMessage() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const user_info = useSelector(selectUserInfo);
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      firebaseService.sendMessage1(chatId, user_info, message);
      setMessage('');
    }
  };
  return (
    <TextField
        className='input-send-container'
        label="Type a message..."
        variant="outlined"
        value = {message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <Box display="flex" alignItems="center">
                    <LinkIcon className='link-icon icon'/>
                    <ImageIcon className='image-icon icon'/>
                    <SendIcon className='send-icon icon' 
                    onClick={sendMessage}
                    />
                </Box>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SendMessage;
