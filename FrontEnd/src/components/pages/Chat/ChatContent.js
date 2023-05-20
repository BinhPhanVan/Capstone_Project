import React from 'react';
import MessageItem from './MessageItem';
import MessageNav from './MessageNav';
import SendMessage from './SendMessage';

function ChatContent() {
  const messages = [
    {
      id: 1,
      user: {
        avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
        name: 'John Doe',
      },
      message: 'Hello!',
      align: 'left',
      timestamp: '2023-05-19 09:30',
    },
    {
      id: 2,
      user: {
        avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
        name: 'Jane Smith',
      },
      message: 'Hi there!',
      align: 'right',
      timestamp: '2023-05-19 09:35',
    },
    {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Hello!',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Hi there!',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
      {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Hello!',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Quo rerum quis est impedit maiores aut cumque cupiditate est ipsa nemo ea necessitatibus voluptatibus eum quidem dignissimos ut harum eligendi. Est autem velit ab sint obcaecati non natus aperiam. Ut praesentium autem sit perferendis dolor est debitis ipsa aut cumque totam.!',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
      {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Hello!',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Hi there!',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
      {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Quo rerum quis est impedit maiores aut cumque cupiditate est ipsa nemo ea necessitatibus voluptatibus eum quidem dignissimos ut harum eligendi. Est autem velit ab sint obcaecati non natus aperiam. Ut praesentium autem sit perferendis dolor est debitis ipsa aut cumque totam.!',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Hi there!',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
      {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Quo rerum quis est impedit maiores aut cumque cupiditate est ipsa nemo ea necessitatibus voluptatibus eum quidem dignissimos ut harum eligendi. Est autem velit ab sint obcaecati non natus aperiam. Ut praesentium autem sit perferendis dolor est debitis ipsa aut cumque totam.',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Quo rerum quis est impedit maiores aut cumque cupiditate est ipsa nemo ea necessitatibus voluptatibus eum quidem dignissimos ut harum eligendi. Est autem velit ab sint obcaecati non natus aperiam. Ut praesentium autem sit perferendis dolor est debitis ipsa aut cumque totam.',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
      {
        id: 1,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'John Doe',
        },
        message: 'Hello!',
        align: 'left',
        timestamp: '2023-05-19 09:30',
      },
      {
        id: 2,
        user: {
          avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
          name: 'Jane Smith',
        },
        message: 'Hi there!sdsdsdsdsdsdasds',
        align: 'right',
        timestamp: '2023-05-19 09:35',
      },
  ];
  const user =
    {
      avatar: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      name: 'John Doe',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam venenatis tincidunt dui eget hendrerit.'
    }
    ;

  return (
    <>
            <MessageNav avatar={user.avatar} name={user.name}/>
            <div className='chat_container'>
                {messages.map((message) => (
                <MessageItem
                key={message.id}
                avatar={message.user.avatar}
                name={message.user.name}
                message={message.message}
                align={message.align}
                timestamp={message.timestamp}
                />
            ))}
            </div>
            <SendMessage/>
    </>

  );
}

export default ChatContent;
