import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Friend {
  id: string
  name: string
  url: string
  description: string
}

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from('friends')
      .select('*')

    if (error) {
      console.error('Error fetching friends:', error)
    } else {
      setFriends(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <h1>友链</h1>
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-card">
            <h3>{friend.name}</h3>
            <p>{friend.description}</p>
            <a href={friend.url} target="_blank" rel="noopener noreferrer">访问</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Friends