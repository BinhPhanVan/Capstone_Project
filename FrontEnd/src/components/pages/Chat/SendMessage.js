import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import firebaseService from '../../../api-service/firebaseService';
function SendMessage() {
  const [message, setMessage] = useState("");
  return (
    <TextField
        className='input-send-container'
        label="Type a message..."
        variant="outlined"
        value = {message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <Box display="flex" alignItems="center">
                    <LinkIcon className='link-icon icon'/>
                    <ImageIcon className='image-icon icon'/>
                    <SendIcon className='send-icon icon' onClick={(e) =>{
                      e.preventDefault();
                      alert("dsadasdasdsdas");
                      // firebaseService.initializeConversation("aaaaaaaaaaaa", '2', '1');
                      firebaseService.sendMessage1("aaaaaaaaaaaa", '2', '1', "aaaaabbbbbba");
                    }}/>
                </Box>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SendMessage;
