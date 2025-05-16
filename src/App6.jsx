import React, { useState, useEffect, useRef } from "react";
import HttpCallerService from './services/http-caller.service.ts';
import ParentIdContext from './context/ParentIdContext.js';
import './App.css';
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
} from 'konsta/react';
import { CameraFill, ArrowUpCircleFill } from 'framework7-icons/react';
import { MdCameraAlt, MdSend } from 'react-icons/md';

// const API_URL = "https://hansel-api-service-ntupraf2qa-uc.a.run.app";
const API_URL = "http://localhost:8000";


function MyApp() {
    const [messagesData, setMessagesData] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [userInput, setUserInput] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [parentId, setParentId] = useState(null);
    const [contextType, setContextType] = useState("new");
    const httpCallerService = new HttpCallerService(API_URL);
    const messagesEndRef = useRef(null);

    const pageRef = useRef();

    useEffect(() => {
        if (!isAuthenticated) return;
        let ws = new WebSocket(`${API_URL.replace("https://", "wss://")}/ws/chat?token=${token}`);

        ws.onmessage = (event) => {
            console.log("WebSocket Message:", event.data);
            const newMessage = JSON.parse(event.data);
            setMessagesData((prevMessages) => [...prevMessages, newMessage]);
        };

        ws.onclose = () => {
            console.log("WebSocket closed. Reconnecting in 3 seconds...");
            setTimeout(() => {
                let ws = new WebSocket(`${API_URL.replace("https://", "wss://")}/ws/chat?token=${token}`);
            }, 8080);
        };

        return () => {
            ws.close();
        };
    }, [isAuthenticated, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesData]);

    const handleLogin = async () => {
        try {
            const body = new URLSearchParams({ username, password });
            const response = await httpCallerService.login('/api/login', body);

            if (response.access_token) {
                setToken(response.access_token);
                localStorage.setItem("token", response.access_token);
                setIsAuthenticated(true);
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed");
        }
    };

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

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


    const handleSendClick = () => {
        const content = messageText.replace(/\n/g, '<br>').trim();
        const type = 'sent';
        const role = "User";
        const messagesToSend = [];
        if (content.length) {
            messagesToSend.push({
                content,
                type,
                role,
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

    const sendMessage = async (event, parentId) => {

        event.preventDefault();
        if (!userInput.trim() || !isAuthenticated) return;

        let newMessage = {
            sender: "User",
            receiver: "Agent",
            message: userInput,
            message_type: "query",
            inserted_at: new Date().toISOString(),
            context: contextType
        };

        setMessagesData((prevMessages) => [...prevMessages, { role: "User", content: userInput }]);
        setUserInput("");

        if (parentId) {
            newMessage = { ...newMessage, parent_id: parentId };
        }

        try {
            const response = await httpCallerService.post('/api/trigger-ai', newMessage, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.response) {
                if (response.parent_id) {
                    setParentId(response.parent_id);
                }
                setContextType("old");
                setMessagesData((prevMessages) => [
                    ...prevMessages,
                    { role: "Hansel", content: response.response },
                ]);
            }

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <ParentIdContext.Provider value={parentId}>
            <div className="container">
                <h2>Hansel Chatbot</h2>

                {!isAuthenticated ? (
                    <div className="login-container">
                        <h3>Login</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="login" onClick={handleLogin}>Login</button>
                    </div>
                ) : (
                    <>
                        <button className="logout" onClick={handleLogout}>Logout</button>
                        <div className="messages-container">
                            {messagesData.map((msg, index) => (
                                <div key={index} className={`message ${msg.role.toLowerCase()}`}>
                                    {msg.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="message-input-container" onSubmit={($event) => sendMessage($event, parentId)}>
                            <input
                                type="text"
                                className="message-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button
                                type="button"
                                className={`reset ${contextType == "new" ? 'active' : ''}`}
                                onClick={() => setContextType("new")}
                            >
                                &#8634;
                            </button>
                            <button className="send" type="submit">Send</button>
                        </form>

                    {/* here */}
<App theme="ios">
    <Page className="ios:bg-white ios:dark:bg-black" ref={pageRef}>
      <Navbar
        title="Messages"
      />
      <Messages>
        <MessagesTitle>{currentDate}</MessagesTitle>
        {messagesData.map((message, index) => (
          <Message
            key={index}
            type={message.type}
            name={message.name}
            text={message.content}
            avatar={
              message.type === 'received' && (
                <img
                  alt="avatar"
                  src={message.avatar}
                  className="w-8 h-8 rounded-full"
                />
              )
            }
          />
        ))}
      </Messages>
      <Messagebar
        placeholder="Message"
        value={messageText}
        onInput={(e) => setMessageText(e.target.value)}
        left={
          <Link onClick={() => console.log('click')} toolbar iconOnly>
            <Icon
              ios={<CameraFill className="w-7 h-7" />}
              material={
                <MdCameraAlt className="w-6 h-6 fill-black dark:fill-md-dark-on-surface" />
              }
            />
          </Link>
        }
        right={
          <Link
            onClick={isClickable ? handleSendClick : undefined}
            toolbar
            style={{
              opacity: inputOpacity,
              cursor: isClickable ? 'pointer' : 'default',
            }}
          >
            <Icon
              ios={<ArrowUpCircleFill className="w-7 h-7" />}
              material={
                <MdSend className="w-6 h-6 fill-black dark:fill-md-dark-on-surface" />
              }
            />
          </Link>
        }
      />
    </Page>
      </App>
                    {/*                    <-- end here -->*/}
                    </>
                )}
            </div>
        </ParentIdContext.Provider>
    );
}

export default MyApp;
