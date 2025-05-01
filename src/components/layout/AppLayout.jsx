import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useHistory } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Fetch user's profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData && !profileError) {
            setProfile(profileData);
          }
          
          // Fetch recent chats
          const { data: chats, error: chatsError } = await supabase
            .from('chat_history')
            .select('id, prompt, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (chats && !chatsError) {
            // Group chats by date
            const groupedChats = chats.reduce((acc, chat) => {
              const date = new Date(chat.created_at).toLocaleDateString();
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push(chat);
              return acc;
            }, {});
            
            setChatList(groupedChats);
          }
        } else {
          // Redirect to login if no user
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleStartNewChat = () => {
    clearChatState();
    history.push('/chat');
  };

  const handleSessionClick = (sessionId) => {
    history.push(`/chat/${sessionId}`);
    loadMessages(sessionId);
  };

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Format date to relative time (today, yesterday, or actual date)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white focus:outline-none"
        >
          {sidebarOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col bg-white border-r border-gray-200`}>
        {/* Logo and new chat button */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-xl font-bold text-indigo-600">PentaCopy</Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleStartNewChat}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </button>
        </div>
        
        {/* Recent chats */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h3>
          <div className="space-y-4">
            {Object.entries(chatList).length > 0 ? (
              Object.entries(chatList).map(([date, chats]) => (
                <div key={date} className="space-y-1">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">{formatDate(date)}</h4>
                  {chats.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/chat/${chat.id}`}
                      className={`block px-3 py-2 rounded-md text-sm ${isActive(`/chat/${chat.id}`) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="truncate">{chat.prompt}</div>
                    </Link>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent chats</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="p-4 border-t border-gray-200">
          <nav className="space-y-1">
            <Link
              to="/chat"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/chat') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className={`mr-3 h-5 w-5 ${isActive('/chat') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat
            </Link>
            <Link
              to="/history"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/history') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className={`mr-3 h-5 w-5 ${isActive('/history') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </Link>
            <Link
              to="/account"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/account') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className={`mr-3 h-5 w-5 ${isActive('/account') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </Link>
          </nav>
        </div>
        
        {/* User profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none p-2"
            >
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {profile?.credits || 0} credits
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg py-1 z-10">
                <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Account Settings</Link>
                <Link to="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Pricing Plans</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
} 