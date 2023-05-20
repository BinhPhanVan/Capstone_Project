import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import ChatContent from './ChatContent';
import MessageList from './MessageList';
function ChatApp() {
  useEffect(() => {
    document.title = "Chat | Hire IT"
  }, []);
  return (
    <div className='chat-container'>
        <Grid container spacing={2} className="custom-grid-container">
            <Grid item xs={3} className="chat-message-user">
                <MessageList/>
            </Grid>
            <Grid item xs={9} className="chat-message-content">
                <ChatContent/>
            </Grid>
        </Grid>
    </div>
  );
}

export default ChatApp;
