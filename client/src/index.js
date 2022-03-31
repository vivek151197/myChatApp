import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain='dev-qz-k1foy.us.auth0.com'
      clientId='yvk2O8a5mNWI4IvqhTxB5WahwEMtny5v'
      redirectUri={'http://localhost:3000/chat'}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
