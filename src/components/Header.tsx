import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Header = () => {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <header>
      <div className="container">
        <h1><Link to="/" style={{ textDecoration: 'none', color: '#333' }}>博客</Link></h1>
        <nav>
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/archive">归档</Link></li>
            <li><Link to="/friends">友链</Link></li>
            {user ? (
              <>
                <li><Link to="/edit">写文章</Link></li>
                <li><button onClick={handleLogout} className="btn btn-secondary">退出</button></li>
              </>
            ) : (
              <li><Link to="/login">登录</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header