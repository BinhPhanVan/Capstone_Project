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

const sendMessage1 = async (conversationId, user_info, message, type) => {
    const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
    const newMessageRef = messagesRef.push();
    const messageData = {
      senderId: user_info.account.id,
      name: user_info.account.first_name + " " + user_info.account.last_name,
      avatar: user_info.avatar_url,
      message: message,
      timestamp : Date.now(),
      type: type,
    };
    newMessageRef.set(messageData);
    await Promise.all([newMessageRef.set(messageData), updateLastMessage(conversationId, messageData)]);
    async function updateLastMessage(conversationId, messageData) {
      const conversationRef = firebase.database().ref(`conversations/${conversationId}`);
      await conversationRef.update({ lastMessage: messageData });
    }
};

const updateMessagesStatusByInterviewId = async (conversationId, interviewId, newStatus) => {
  const messagesRef = firebase.database().ref(`conversations/${conversationId}/messages`);
  const query = messagesRef.orderByChild("message/interview_id").equalTo(interviewId);
  const snapshot = await query.once("value");

  snapshot.forEach(childSnapshot => {
    const messageRef = childSnapshot.ref.child("message");
    messageRef.update({ status: newStatus });
  });
};


const createConversation = (senderId, receiverId, senderName, senderAvatar, senderEmail, receiverName, receiverAvatar, receiverEmail) => {
    const conversationId = `${senderId}_${receiverId}`;
    const conversationsRef = firebase.database().ref(`conversations/${conversationId}`);    
    const initialData = {
      users: {
        [senderId]: {
          name: senderName,
          avatar: senderAvatar,
          email: senderEmail
        },
        [receiverId]: {
          name: receiverName,
          avatar: receiverAvatar,
          email: receiverEmail
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


const initializeConversation = async (senderId, receiverId, senderName, senderAvatar, senderEmail,  receiverName, receiverAvatar, receiverEmail) => {
  const conversationId = await getConversationId(senderId, receiverId);
  if (conversationId) {
    console.log('Conversation already exists.');
  } else {
    createConversation(senderId, receiverId, senderName, senderAvatar, senderEmail, receiverName, receiverAvatar, receiverEmail);
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

const updateUsersInConversations = (userId, name, avatar) => {
  const conversationsRef = firebase.database().ref('conversations');

  return conversationsRef.once('value')
    .then((snapshot) => {
      const conversationsData = snapshot.val();
      if (conversationsData) {
        const updatedConversations = {};

        Object.entries(conversationsData).forEach(([conversationId, conversation]) => {
          const updatedUsers = { ...conversation.users };
          const updatedMessages = { ...conversation.messages };

          if (userId in updatedUsers) {
            updatedUsers[userId] = {
              ...updatedUsers[userId],
              name: name,
              avatar: avatar,
            };
          }
          Object.entries(updatedMessages).forEach(([messageId, message]) => {
            if (message.senderId === userId) {
              updatedMessages[messageId] = {
                ...message,
                name: name,
                avatar: avatar,
              };
            }
          });
          updatedConversations[conversationId] = {
            ...conversation,
            users: updatedUsers,
            messages: updatedMessages,
          };
        });

        // Update the conversations in the database
        return conversationsRef.set(updatedConversations)
          .then(() => {
            console.log('Users updated in conversations successfully.');
          })
          .catch((error) => {
            console.error('Error updating users in conversations:', error);
            throw error;
          });
      } else {
        return;
      }
    })
    .catch((error) => {
      console.error('Error retrieving conversations:', error);
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
            email: user.email,
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



  


const firebaseService = {updateUsersInConversations, getUserInChatWithId, getAllUsersInChatWithUser, getConversationId, sendMessage, getAllMessage, sendMessage1, initializeConversation, getAllMessageWithID, getUsersInConversationsByUser, updateMessagesStatusByInterviewId};

export default firebaseService;
