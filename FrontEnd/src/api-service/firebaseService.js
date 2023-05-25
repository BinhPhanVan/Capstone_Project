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

const sendMessage1 = async (conversationId, user_info, message) => {
    // const conversationId = await getConversationId(senderId, receiverId);
    // console.log(conversationId)
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const newMessageRef = messagesRef.push();
    console.log(user_info);
    const messageData = {
      senderId: user_info.account.id,
      name: user_info.account.first_name + " " + user_info.account.last_name,
      avatar: user_info.avatar_url,
      message: message,
      timestamp : firebase.database.ServerValue.TIMESTAMP
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
      },
      messages: []
    };
    
    conversationsRef.set(initialData);
};

const getConversationId = async (senderId, receiverId) => {
  const conversationsRef = firebase.database().ref('conversations');

  const conversationQuery = conversationsRef.orderByChild(`users/${senderId}`).equalTo(true);

  try {
    const snapshot = await conversationQuery.once('value');
    const conversationData = snapshot.val();

    if (conversationData) {
      for (const conversationId in conversationData) {
        if (conversationData[conversationId].users[receiverId]) {
          return conversationId;
        }
      }
    }
    console.log('Conversation does not exist.');
    return false;
  } catch (error) {
    return false;
  }
};


const initializeConversation = async (senderId, receiverId) => {
  const conversationId = await getConversationId(senderId, receiverId);
  
  if (conversationId) {
    console.log('Conversation already exists.');
  } else {
    createConversation(senderId, receiverId);
  }
};

const getAllMessage = async (senderId, receiverId, callback) => {
    const conversationId = await getConversationId(senderId, receiverId);
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

  const getAllMessageWithID = async (conversationId, callback) => {
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



const firebaseService = {getConversationId, sendMessage, getAllMessage, sendMessage1, initializeConversation, getAllMessageWithID};

export default firebaseService;
