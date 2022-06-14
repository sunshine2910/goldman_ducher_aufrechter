import './App.css';
import React, { useState, useEffect, useRef } from "react";

const URL = 'ws://127.0.0.1:5000/chat';

const App =() => {
	const [user, setUser] = useState('Tarzan');
  	const [message, setMessage] = useState("");
  	const [messages, setMessages] = useState([]);
	const ws = useRef()

  	const submitMessage = (usr, msg) => {
  		const message = { user: usr, message: msg };
  		ws.current.send(JSON.stringify(message));
  	}
	useEffect(()=>{
		ws.current = new WebSocket(URL)
		ws.current.onopen = () => {
			console.log('WebSocket Connected');
		  }
			ws.current.onclose = () => {
			  console.log('WebSocket Disconnected');
			}
	  return()=>{
		  if(ws.current){
			ws.current.close()
		  }
	  }
	},[])

  	useEffect(() => {
		  if(ws.current){
			  ws.current.onmessage = (e) => {
				const message = JSON.parse(e.data);
				setMessages([message.payload, ...messages]);
			  }
		  }
  	}, [ws.current, messages]);

  	return (
	    <div>
	        <label htmlFor="user">
	          Name :
	          <input
	            type="text"
	            id="user"
	            placeholder="User"
	            value={user}
	            onChange={e => setUser(e.target.value)}
	          />
	        </label>

	        <ul>
	          {messages.reverse().map((message, index) =>
	            <li key={index}>
	              <b>{message.user}</b>: <em>{message.message}</em>
	            </li>
	          )}
	        </ul>

	        <form
	          action=""
	          onSubmit={e => {
	            e.preventDefault();
	            submitMessage(user, message);
	            setMessage("");
	          }}
	        >
	          <input
	            type="text"
	            placeholder={'Type a message ...'}
	            value={message}
	            onChange={e => setMessage(e.target.value)}
	          />
	          <input type="submit" value={'Send'} />
	        </form>
	    </div>
  	)
}

export default App;