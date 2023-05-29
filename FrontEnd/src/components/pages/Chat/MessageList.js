import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import MessageUser from './MessageUser';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import firebaseService from '../../../api-service/firebaseService';
import { useDispatch, useSelector } from 'react-redux';
import { get_information, selectUserInfo } from '../../../store/UserSlice';
import firebase from 'firebase/compat/app';
function MessageList() {
    const [searchText, setSearchText] = useState('');
    const user_info = useSelector(selectUserInfo);
    const [messagesItem, setMessagesItem] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(get_information());
    }, [dispatch]);
    useEffect(() => {
      const fetchUsers = () => {
        if (user_info && user_info.account && user_info.account.id) {
          firebaseService.getAllUsersInChatWithUser(user_info.account.id)
            .then((messageslist) => {
              setMessagesItem(messageslist);
            })
            .catch((error) => {
              console.error('Error retrieving users:', error);
            });
        }
      };
    
      fetchUsers();
    
      const conversationsRef = firebase.database().ref('conversations');
      const listener = conversationsRef.on('value', () => {
        fetchUsers();
      });
    
      // Clean up the listener when the component unmounts
      return () => {
        conversationsRef.off('value', listener);
      };
    }, [user_info]);
    
        

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };
    
    const filteredMessages = messagesItem.filter((message) =>
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
        <MessageUser key={index} message={message} />
      ))}
    </>
  );
}

export default MessageList;
