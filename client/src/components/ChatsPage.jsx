import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Profile from './Profile'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'

//replace the below with http://localhost:5000 ur to test for localhost server
const socket = io.connect('https://my-chat-app-viv.herokuapp.com/')

const ChatsPage = () => {
  const { isLoading, user, logout } = useAuth0()
  const [data, setData] = useState({ message: '', name: '', email: '' })
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  if (!isLoading && !user) {
    navigate('/')
  }

  useEffect(() => {
    if (user !== undefined)
      setData({ message: '', name: user.name, email: user.email })
  }, [isLoading])

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages'))
    storedMessages && setMessages(storedMessages)
    socket.on('message', ({ name, message, email }) => {
      setMessages(messages => [...messages, { name, message, email }])
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
    const chatscroll = document.getElementsByClassName('chat')
    if (chatscroll[0]) chatscroll[0].scrollTop = chatscroll[0].scrollHeight
  }, [messages])

  const messageHandler = e => {
    setData({ message: e.target.value, name: data.name, email: data.email })
  }

  const submitMessage = () => {
    if (data.message) {
      const { name, message, email } = data

      socket.emit('message', { name, message, email })
      setData({ name, email, message: '' })
    }
  }

  const renderChat = () => {
    return (
      user !== undefined &&
      messages.map(({ name, message, email }, index) => (
        <div
          key={index}
          className={`eachMessage ${
            email === user.email ? 'myMessage' : 'othersMessage'
          }`}
        >
          {email === user.email ? (
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
    )
  }

  //replace the below with http://localhost:3000 ur to test for localhost server

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
              <button onClick={logOutHandler} className='logOut'>
                Log Out
              </button>
            </div>
            <div className='messages'>{renderChat()}</div>
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
            <button onClick={submitMessage} className='send'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatsPage
