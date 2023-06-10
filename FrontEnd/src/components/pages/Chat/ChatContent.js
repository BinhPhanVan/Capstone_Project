import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import firebaseService from '../../../api-service/firebaseService';
import { selectUserInfo } from '../../../store/UserSlice';
import MessageItem from './MessageItem';
import MessageNav from './MessageNav';
import SendMessage from './SendMessage';
import firebase from 'firebase/compat/app';
import firebaseService from '../../../api-service/firebaseService';
function ChatContent() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const chatContainerRef = useRef(null);
  const user_info = useSelector(selectUserInfo);
  useEffect(() => {
    const messagesRef = firebase.database().ref(`conversations/${chatId}/messages`);
    const listener = messagesRef.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.entries(messagesData).map(([messageId, message]) => ({
          id: messageId,
          ...message,
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });
    const fetchUser = async () => {
      try {
        if (user_info && user_info.account && user_info.account.id && chatId) {
          const user = await firebaseService.getUserInChatWithId(chatId, user_info.account.id);
          if (user) {
            setUser(user);
          } else {
            console.log('User not found.');
          }
        }
      } catch (error) {
        console.log('Error retrieving user:', error);
      }
    };
    
    if (chatId) {
      fetchUser();
    }
    return () => {
      messagesRef.off('value', listener);
    };
  }, [chatId, user_info]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return chatId ? (
    <>
            <MessageNav user={user}/>
            <div className='chat_container' ref={chatContainerRef}>
                {messages.map((message) => (
                <MessageItem
                key={message.id}
                avatar={message.avatar}
                name={message.name}
                message={message.message}
                align={user_info.account.id === message.senderId ? 'right': 'left'}
                timestamp={message.timestamp}
                />
            ))}
            </div>
            <SendMessage/>
    </>

  ): <></>;
}

export default ChatContent;
