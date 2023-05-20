import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import MessageUser from './MessageUser';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
function MessageList() {
    const [searchText, setSearchText] = useState('');
    const messages = [
        {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam venenatis tincidunt dui eget hendrerit.'
        },
        {
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROBxEUaq3yrhBB_0o7a2sjwPGs7klJsNKWcdeBFz-NBPz39AyTEBm63WL34Ew41ugiRjA&usqp=CAU',
          name: 'Jane Smith',
          message: 'Ut consectetur tristique leo, eget dapibus ex volutpat nec. Nam eu eros et elit maximus mattis.'
        },
        {
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTpKLpuYMpbAQ_G8BhbBscnqnm7d3usjDexiAQTL_aFktEa9xmgKOqZ2MnRjHvpYy5_3k&usqp=CAU',
          name: 'Mark Johnson',
          message: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam id elementum leo.'
        },
        ];

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };
    
    const filteredMessages = messages.filter((message) =>
        message.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <>
        <TextField
        id="standard-basic"
        value={searchText}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon /> 
              </InputAdornment>
            ),
          }}
      />
      {filteredMessages.map((message, index) => (
        <MessageUser key={index} {...message} />
      ))}
    </>
  );
}

export default MessageList;
