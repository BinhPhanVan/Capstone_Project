import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function MessageItem({ message, align}) {
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
  
  return (
    <Box className="messageitem_container" mb={1}>
      {align === 'left' ? (
        <Avatar src={message.avatar} alt={message.name} />
      ) : (
        <Box flex="0 0 40px" />
      )}
      <div className={`${containerClass}`}>
        <Box ml={align === 'left' ? 2 : 'auto'} className="message_content">
          <Typography variant="body1">{message.message}</Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" className="timestamp">
          {emebed(message.timestamp)}
        </Typography>
      </div>
    </Box>
  );
}

export default MessageItem;
