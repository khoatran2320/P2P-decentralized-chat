import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'

// initialize gun locally
const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})

const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
}

export default function App() {
    const [formState, setForm] = useState({
    name: '', message: ''
  })

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const messages = gun.get('messages')
    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      })
    })
  }, [])

  function saveMessage() {
    const messages = gun.get('messages')
    const date =  new Date(Date.now());
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: date.toUTCString()
    })
    setForm({
      name: '', message: ''
    })
  }

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }

  return (
    <div style={{ padding: 30 }}>
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send Message</button>
      {
        state.messages.map(message => (
          
<div key={message.createdAt} style={{dislay:'flex', alignContent: 'space-between'}} >
            <p><b>{message.name}</b>: {message.message}</p>
            <p style={{fontSize: '10px'}}>{message.createdAt}</p>
            <hr></hr>
          </div>
        ))
      }
    </div>
  );
}

