import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function MessageItem({ avatar, name, message, align, timestamp }) {
  const containerClass = align === 'left' ? 'messageitem_container_left' : 'messageitem_container_right';

  return (
    <Box className="messageitem_container" mb={1}>
      {align === 'left' ? (
        <Avatar src={avatar} alt={name} />
      ) : (
        <Box flex="0 0 40px" />
      )}
      <div className={`${containerClass}`}>
        <Box ml={align === 'left' ? 2 : 'auto'} className="message_content">
          <Typography variant="body1">{message}</Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" className="timestamp">
          {timestamp}
        </Typography>
      </div>
    </Box>
  );
}

export default MessageItem;
