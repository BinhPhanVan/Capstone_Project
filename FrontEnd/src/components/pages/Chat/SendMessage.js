import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';

function SendMessage() {
  return (
    <TextField
        className='input-send-container'
        label="Type a message..."
        variant="outlined"
        fullWidth
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <Box display="flex" alignItems="center">
                    <LinkIcon className='link-icon icon'/>
                    <ImageIcon className='image-icon icon'/>
                    <SendIcon className='send-icon icon'/>
                </Box>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SendMessage;
