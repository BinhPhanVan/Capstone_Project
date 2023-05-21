import firebase from 'firebase/compat/app';
import { v4 as uuidv4 } from 'uuid';
import 'firebase/compat/database';
const firebaseConfig = {
    apiKey: "AIzaSyA9yobIeWcRlZDJLni6_wmqHQ6XLV77C8w",
    authDomain: "project-base-learning-f8e6e.firebaseapp.com",
    databaseURL: "https://project-base-learning-f8e6e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-base-learning-f8e6e",
    storageBucket: "project-base-learning-f8e6e.appspot.com",
    messagingSenderId: "939470734749",
    appId: "1:939470734749:web:2f3e4474cf719754989b74",
    measurementId: "G-3M43RPTGYC"
};
  
firebase.initializeApp(firebaseConfig);

const sendMessage = (conversationId, senderId, avatar, message) => {
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const newMessageRef = messagesRef.push();
    const uniqueId = uuidv4();
    newMessageRef.set({
      sender_id: uniqueId,
      avatar: avatar,
      message: message,
    });
  };

const sendMessage1 = (conversationId, senderId, receiverId, content) => {
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const newMessageRef = messagesRef.push();
    const timestamp = Date.now();
    
    const messageData = {
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      timestamp: timestamp,
    };
    newMessageRef.set(messageData);
};

const createConversation = (senderId, receiverId) => {
    const conversationId = `${senderId}_${receiverId}`;
    const conversationsRef = firebase.database().ref(`conversations/${conversationId}`);    
    const initialData = {
      users: {
        [senderId]: true,
        [receiverId]: true
      }
    };
    
    conversationsRef.set(initialData);
};

const initializeConversation = (senderId, receiverId) => {
  const conversationsRef = firebase.database().ref('conversations');

  // Query to check if conversation with specified users exists
  const conversationQuery = conversationsRef
    .orderByChild(`users/${senderId}`)
    .equalTo(true)
    .orderByChild(`users/${receiverId}`)
    .equalTo(true)
    .limitToFirst(1);

  conversationQuery.once('value', (snapshot) => {
    const conversation = snapshot.val();

    if (conversation) {
      console.log('Conversation already exists.');
    } else {
      createConversation(senderId, receiverId);
    }
  });
};

const getMessagesForUser = (userId) => {
  const messagesRef = firebase.database().ref('messages');
  const userMessagesRef = messagesRef.orderByChild(`users/${userId}`).equalTo(true);

  userMessagesRef.on('value', (snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      console.log('Messages for User', userId);
      console.log(messages);
    } else {
      console.log('No messages found for User', userId);
    }
  });
};

const getAllMessage = async (conversationId, callback) => {
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const snapshot = await messagesRef.once('value');
    const messagesData = snapshot.val();
  
    if (messagesData) {
      const messagesList = Object.entries(messagesData).map(([messageId, message]) => ({
        id: messageId,
        ...message,
      }));
      return messagesList;
    }
  
    return [];
  };



const firebaseService = {sendMessage, getAllMessage, sendMessage1, initializeConversation, getMessagesForUser};

export default firebaseService;
