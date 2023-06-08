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
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const newMessageRef = messagesRef.push();
    const messageData = {
      senderId: user_info.account.id,
      name: user_info.account.first_name + " " + user_info.account.last_name,
      avatar: user_info.avatar_url,
      message: message,
      timestamp : Date.now()
    };
    newMessageRef.set(messageData);
    await Promise.all([newMessageRef.set(messageData), updateLastMessage(conversationId, messageData)]);
    async function updateLastMessage(conversationId, messageData) {
      const conversationRef = firebase.database().ref(`conversations/${conversationId}`);
      await conversationRef.update({ lastMessage: messageData });
    }
};

const createConversation = (senderId, receiverId, senderName, senderAvatar, receiverName, receiverAvatar) => {
    const conversationId = `${senderId}_${receiverId}`;
    const conversationsRef = firebase.database().ref(`conversations/${conversationId}`);    
    const initialData = {
      users: {
        [senderId]: {
          name: senderName,
          avatar: senderAvatar
        },
        [receiverId]: {
          name: receiverName,
          avatar: receiverAvatar
        }
      },
      messages: []
    };
    
    conversationsRef.set(initialData);
};

const getConversationId = async (senderId, receiverId) => {
  const conversationsRef = firebase.database().ref('conversations');

  const conversationQuery = conversationsRef.orderByChild(`users`);

  try {
    const snapshot = await conversationQuery.once('value');
    const conversationData = snapshot.val();

    if (conversationData) {
      for (const conversationId in conversationData) {
        if (conversationData[conversationId].users[receiverId] && conversationData[conversationId].users[senderId]) {
          return conversationId;
        }
      }
    }
    // console.log('Conversation does not exist.');
    return false;
  } catch (error) {
    console.error('Error retrieving conversation ID:', error);
    return false;
  }
};


const initializeConversation = async (senderId, receiverId, senderName, senderAvatar, receiverName, receiverAvatar) => {
  const conversationId = await getConversationId(senderId, receiverId);
  if (conversationId) {
    console.log('Conversation already exists.');
  } else {
    createConversation(senderId, receiverId, senderName, senderAvatar, receiverName, receiverAvatar);
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


  const getUsersInConversationsByUser = (userId) => {
    const conversationsRef = firebase.database().ref('conversations');
  
    return conversationsRef.once('value')
      .then((snapshot) => {
        const conversationsData = snapshot.val();
        if (conversationsData) {
          const conversationList = Object.entries(conversationsData).map(([conversationId, conversation]) => ({
            id: conversationId,
            ...conversation,
          }));
          // Filter the conversationList based on userId
          const filteredConversations = conversationList.filter(conversation => userId in conversation.users);
          // Extract the users from the filtered conversations
          const users = filteredConversations.reduce((userList, conversation) => {
            const conversationUsers = Object.keys(conversation.users);
            return userList.concat(conversationUsers);
          }, []);
          // Remove duplicates and return the unique users
          const uniqueUsers = [...new Set(users.filter(user => user !== userId))];
          return uniqueUsers;
        } else {
          return [];
        }
      })
      .catch((error) => {
        console.error('Error retrieving users in conversations:', error);
        throw error;
      });
}; 

const getAllUsersInChatWithUser = (userId) => {
  const conversationsRef = firebase.database().ref('conversations');
  
  return conversationsRef.once('value')
    .then((snapshot) => {
      const conversationsData = snapshot.val();
      if (conversationsData) {
        const conversationList = Object.entries(conversationsData).map(([conversationId, conversation]) => ({
          id: conversationId,
          ...conversation,
        }));
        // Filter the conversationList based on userId
        const filteredConversations = conversationList.filter(conversation => userId in conversation.users);
        // Extract the users from the filtered conversations
        const users = filteredConversations.reduce((userList, conversation) => {
          const conversationUsers = conversation.users;
          const conversationUserIds = Object.keys(conversationUsers).filter(user => user !== userId);
          const conversationUserDetails = conversationUserIds.map(userId => ({
            id: userId,
            name: conversationUsers[userId].name,
            avatar: conversationUsers[userId].avatar,
            lastMessage: conversation.lastMessage,
          }));
          return userList.concat(conversationUserDetails);
        }, []);
        return users;
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error('Error retrieving users in conversations:', error);
      throw error;
    });
};

const getUserInChatWithId = (chatId, userId) => {
  const conversationsRef = firebase.database().ref('conversations');
  return conversationsRef
    .child(chatId)
    .once('value')
    .then((snapshot) => {
      const conversationData = snapshot.val();
      if (conversationData) {
        const conversationUsers = conversationData.users;
        const user = Object.entries(conversationUsers)
          .filter(([key]) => key !== userId)
          .map(([userId, user]) => ({
            id: userId,
            name: user.name,
            avatar: user.avatar,
          }))[0];
        return user;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error retrieving user:', error);
      throw error;
    });
};



  


const firebaseService = {getUserInChatWithId, getAllUsersInChatWithUser, getConversationId, sendMessage, getAllMessage, sendMessage1, initializeConversation, getAllMessageWithID, getUsersInConversationsByUser};

export default firebaseService;
