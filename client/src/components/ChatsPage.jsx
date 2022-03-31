import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Profile from './Profile'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'

const socket = io.connect('https://my-chat-app-viv.herokuapp.com/')

const ChatsPage = () => {
  const { isLoading, user, logout } = useAuth0()
  const [data, setData] = useState({ message: '', name: '' })
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  if (useAuth0().isAuthenticated === false) {
    navigate('/')
  }

  useEffect(() => {
    if (user !== undefined) setData({ message: '', name: user.name })
  }, [isLoading])

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setMessages(messages => [...messages, { name, message }])
    })
  }, [])

  const messageHandler = e => {
    setData({ message: e.target.value, name: data.name })
  }

  const submitMessage = () => {
    if (data.message) {
      const { name, message } = data
      socket.emit('message', { name, message })
      setData({ name, message: '' })
    }
  }

  const renderChat = () => {
    return messages.map(({ name, message }, index) => (
      <div
        key={index}
        className={`eachMessage ${
          name === user.name ? 'myMessage' : 'othersMessage'
        }`}
      >
        {name === user.name ? (
          message
        ) : (
          <div>
            <span className='otherUserName'>{name}</span>
            <br />
            {message}
          </div>
        )}
      </div>
    ))
  }

  const logOutHandler = () => {
    logout({ returnTo: 'https://my-chat-app-viv.herokuapp.com/' })
  }

  return (
    !isLoading && (
      <div className='container'>
        <div className='messageInfo'>
          <div className='chat'>
            <div className='userInfo'>
              <Profile />
              <button
                onClick={logOutHandler}
                style={{ backgroundColor: 'rgb(139, 34, 34)' }}
              >
                Log Out
              </button>
            </div>
            {renderChat()}
          </div>
          <div className='sendMessage'>
            <input
              type='text'
              onChange={e => messageHandler(e)}
              value={data.message}
              placeholder='Type your message'
              className='input'
              onKeyUp={e => (e.key === 'Enter' ? submitMessage() : '')}
            />
            <button onClick={submitMessage}>Send Message</button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatsPage
