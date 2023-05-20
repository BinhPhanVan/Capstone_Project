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



const firebaseService = {sendMessage, getAllMessage};

export default firebaseService;
