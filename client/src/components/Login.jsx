import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Login = () => {
  const { loginWithRedirect } = useAuth0()

  useEffect(loginWithRedirect(), [])

  return null
}

export default Login
