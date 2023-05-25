import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import firebaseService from '../../../api-service/firebaseService';
import { selectUserInfo } from '../../../store/UserSlice';
import MessageItem from './MessageItem';
import MessageNav from './MessageNav';
import SendMessage from './SendMessage';
import firebase from 'firebase/compat/app';
function ChatContent() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
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
  
    return () => {
      messagesRef.off('value', listener);
    };
  }, [chatId]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const user =
    {
      avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      name: 'John Doe',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam venenatis tincidunt dui eget hendrerit.'
    }
    ;

  return chatId ? (
    <>
            <MessageNav avatar={user.avatar} name={user.name}/>
            <div className='chat_container' ref={chatContainerRef}>
                {messages.map((message) => (
                <MessageItem
                key={message.senderId}
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
