import { React, useState, useRef, useEffect } from 'react';
import {
  App,
  Page,
  Navbar,
  NavbarBackLink,
  Messagebar,
  Messages,
  Message,
  MessagesTitle,
  Link,
  Icon,
  Block
} from 'konsta/react';
import { CameraFill, ArrowUpCircleFill } from 'framework7-icons/react';
import { MdCameraAlt, MdSend } from 'react-icons/md';

export default function MessagesPage() {
  const [messageText, setMessageText] = useState('');
  const [messagesData, setMessagesData] = useState([
    {
      type: 'sent',
      text: 'Hi, Kate',
    },
    {
      type: 'sent',
      text: 'How are you?',
    },
    {
      name: 'Kate',
      type: 'received',
      text: 'Hi, I am good!',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
    },
    {
      name: 'Blue Ninja',
      type: 'received',
      text: 'Hi there, I am also fine, thanks! And how are you?',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    },
    {
      type: 'sent',
      text: 'Hey, Blue Ninja! Glad to see you ;)',
    },
    {
      type: 'sent',
      text: 'How do you feel about going to the movies today?',
    },
    {
      name: 'Kate',
      type: 'received',
      text: ' Oh, great idea!',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
    },
    {
      name: 'Kate',
      type: 'received',
      text: ' What cinema are we going to?',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
    },
    {
      name: 'Blue Ninja',
      type: 'received',
      text: 'Great. And what movie?',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    },
    {
      name: 'Blue Ninja',
      type: 'received',
      text: 'What time?',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    },
  ]);

  const pageRef = useRef();
  const initiallyScrolled = useRef(false);

  // const scrollToBottom = () => {
  //   const pageElement = pageRef.current.current || pageRef.current.el;
  //   pageElement.scrollTo({
  //     top: pageElement.scrollHeight - pageElement.offsetHeight,
  //     behavior: initiallyScrolled.current ? 'smooth' : 'auto',
  //   });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  //   initiallyScrolled.current = true;
  // }, [messagesData]);

  const handleSendClick = () => {
    const text = messageText.replace(/\n/g, '<br>').trim();
    const type = 'sent';
    const messagesToSend = [];
    if (text.length) {
      messagesToSend.push({
        text,
        type,
      });
    }
    if (messagesToSend.length === 0) {
      return;
    }
    setMessagesData([...messagesData, ...messagesToSend]);
    setMessageText('');
  };

  const inputOpacity = messageText ? 1 : 0.3;
  const isClickable = messageText.trim().length > 0;

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
    .formatToParts(new Date())
    .map((part) => {
      if (['weekday', 'month', 'day'].includes(part.type)) {
        return <b key={part.type}>{part.value}</b>;
      }
      return part.value;
    });

  return (
    <App theme="ios">
      <Page>
        <Navbar title="My App" />
        <h1 className="text-3xl font-bold underline">
      Hello world!
</h1>
        <Block strong>Hello world!</Block>

        <div
  className="max-w-md m-5 mx-auto overflow-hidden bg-white shadow-md rounded-xl md:max-w-2xl"
>
  <div className="md:flex">
    <div className="md:flex-shrink-0">
      <img
        className="object-cover w-full h-48 md:w-48"
        src="/img/store.jpg"
        alt="A cool store"
      />
    </div>
    <div className="p-8">
      <div
        className="text-sm font-semibold tracking-wide text-indigo-500 uppercase"
      >
        The cool store
      </div>
      <p className="mt-2 text-gray-500">
        Visit our cool store and find the best products for you.
      </p>
    </div>
  </div>
</div>
      </Page></App>
  );
}
