import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'

export default function ChatHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const navigate = useNavigate()
  
  // Get user and chat history on component mount
  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          
          // Fetch user's credits
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single()
          
          if (profileData && !profileError) {
            setCredits(profileData.credits)
          }
          
          // Fetch chat history
          const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          
          setHistory(data || [])
        } else {
          // Redirect to login if no user
          navigate('/login')
        }
      } catch (error) {
        setError(error.message)
        console.error('Error fetching chat history:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserAndHistory()
  }, [navigate])
  
  const handleDeleteHistory = async (id) => {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Update history state after deletion
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting chat history:', error)
    }
  }
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a')
    } catch (e) {
      return dateString
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">PentaCopy</Link>
          
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 px-3 py-1 rounded-full">
              <span className="text-indigo-800 font-medium">{credits} credits</span>
            </div>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                <span>{user?.email?.split('@')[0] || 'User'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/chat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Chat</Link>
                <a 
                  href="#" 
                  onClick={async (e) => {
                    e.preventDefault()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat History</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-1h2V7H9v1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your chat history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No chat history yet</h3>
              <p className="text-gray-500 mb-6">Start a conversation with our AI assistant to see your history here.</p>
              <Link to="/chat" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Start chatting
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((chat) => (
                    <tr key={chat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(chat.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md truncate">{chat.prompt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chat.tokens_used}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/chat?id=${chat.id}`} 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteHistory(chat.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link to="/chat" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
            Back to Chat
          </Link>
          
          {history.length > 0 && (
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
                  try {
                    // This would need to be handled by a backend function for security
                    const { error } = await supabase
                      .from('chat_history')
                      .delete()
                      .eq('user_id', user.id)
                    
                    if (error) throw error
                    
                    setHistory([])
                  } catch (error) {
                    console.error('Error deleting all chat history:', error)
                  }
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete All History
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 