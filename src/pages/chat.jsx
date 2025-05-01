import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { callAIAPI, generateAISummary, AI_MODELS } from '../lib/aiModels';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatConversation from '../components/chat/ChatConversation';
import ChatInput from '../components/chat/ChatInput';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ChatLayout from '../components/chat/ChatLayout';

const Chat = () => {
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [groupedChatSessions, setGroupedChatSessions] = useState([]);
  const [credits, setCredits] = useState(0);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [responseGenerationPhase, setResponseGenerationPhase] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [isSummarizingInBackground, setIsSummarizingInBackground] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS.GEMINI_PRO);
  
  // Refs
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const isTabActive = useRef(true);
  
  // Media query for responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Load user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Fetch user's profile for credits
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setCredits(profileData.credits || 0);
          }
          
          // Load chat sessions
          await loadChatSessions(user.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      }
    };
    
    fetchUserData();
    
    // Track if tab is active
    const handleVisibilityChange = () => {
      isTabActive.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  // Handle URL params to load specific chat
  useEffect(() => {
    if (chatId && user) {
      setCurrentChatId(chatId);
      loadMessages(chatId);
    }
  }, [chatId, user]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, optimisticMessages, responseGenerationPhase]);

  // Close sidebar on mobile when navigating to a chat
  useEffect(() => {
    if (isMobile && chatId) {
      setSidebarOpen(false);
    }
  }, [chatId, isMobile]);

  // Group chat sessions by date
  useEffect(() => {
    if (chatSessions.length > 0) {
      const grouped = groupSessionsByDate(chatSessions);
      setGroupedChatSessions(grouped);
    }
  }, [chatSessions]);

  // Helper functions
  const groupSessionsByDate = (sessions) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const groups = [
      { id: 'today', label: 'Today', sessions: [] },
      { id: 'yesterday', label: 'Yesterday', sessions: [] },
      { id: 'previous', label: 'Previous 7 Days', sessions: [] },
      { id: 'older', label: 'Older', sessions: [] }
    ];
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at).toDateString();
      
      if (sessionDate === today) {
        groups[0].sessions.push(session);
      } else if (sessionDate === yesterdayStr) {
        groups[1].sessions.push(session);
      } else if (new Date(session.created_at) > oneWeekAgo) {
        groups[2].sessions.push(session);
      } else {
        groups[3].sessions.push(session);
      }
    });
    
    // Only return groups that have sessions
    return groups.filter(group => group.sessions.length > 0);
  };

  const loadChatSessions = async (userId) => {
    try {
      setSessionsLoading(true);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the sessions for display
      const formattedSessions = data.map(session => ({
        ...session,
        displayTitle: session.title || 'New Chat',
        hasSummary: !!session.conversation_summary
      }));
      
      setChatSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setError('Failed to load chat history');
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadMessages = async (sessionId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data);
      setCurrentChatId(sessionId);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const saveToLocalStorage = (chatId, messagesData, isPending) => {
    try {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify({
        messages: messagesData,
        isPending
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const updatePendingStatus = (chatId, isPending) => {
    try {
      const storedData = localStorage.getItem(`chat_${chatId}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        localStorage.setItem(`chat_${chatId}`, JSON.stringify({
          ...parsedData,
          isPending
        }));
      }
    } catch (error) {
      console.error('Failed to update pending status:', error);
    }
  };

  const prepareConversationContext = (allMessages, limit = 5) => {
    if (!allMessages || allMessages.length === 0) return [];
    
    // For short conversations, return all messages
    if (allMessages.length <= limit) return allMessages;
    
    // For longer conversations, return only the most recent messages
    return allMessages.slice(-limit);
  };

  const createConversationSummary = (previousSummary, existingSummary, userPrompt, aiResponse) => {
    // Create a very basic summary if we can't generate one with AI
    let newSummary = existingSummary || '';
    
    if (!newSummary) {
      // Just create a very simple summary based on the first few words of the conversation
      newSummary = `Conversation about ${userPrompt.substring(0, 50)}...`;
    }
    
    return newSummary;
  };

  // Event handlers
  const startNewChat = async () => {
    setCurrentChatId(null);
    setMessages([]);
    setPrompt('');
    setError(null);
    setErrorMessage(null);
    
    // Create new chat session in database
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          { user_id: user.id, model: selectedModel.id }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCurrentChatId(data[0].id);
        navigate(`/chat/${data[0].id}`);
        
        // Update sessions list
        await loadChatSessions(user.id);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat');
    }
  };

  const navigateToChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
  };

  const handleRenameSession = async (e) => {
    e.preventDefault();
    
    if (!sessionToEdit || !editSessionTitle.trim()) {
      setSessionToEdit(null);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: editSessionTitle.trim() })
        .eq('id', sessionToEdit.id);
      
      if (error) throw error;
      
      // Update local state
      setChatSessions(prev => 
        prev.map(session => 
          session.id === sessionToEdit.id
            ? { ...session, title: editSessionTitle.trim(), displayTitle: editSessionTitle.trim() }
            : session
        )
      );
      
      setSessionToEdit(null);
    } catch (error) {
      console.error('Error renaming session:', error);
      setError('Failed to rename chat');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat? This cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      
      // Update local state
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If currently viewing the deleted chat, start a new one
      if (currentChatId === sessionId) {
        startNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Failed to delete chat');
    }
  };

  const handleSendButtonClick = (e) => {
    e.preventDefault();
    handleSendPrompt(e);
  };

  const handleSendPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading || !user) return;
    
    if (credits <= 0) {
      setErrorMessage('You have no credits remaining. Upgrade your plan.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setErrorMessage(null);
    setPendingResponse(true);
    setUnsavedChanges(true);
    
    const userMessageContent = prompt;
    setPrompt('');

    let targetChatId = currentChatId;
    let newSessionCreated = false;
    let conversationSummary = null;

    try {
      // Add user message optimistically
      const optimisticUserMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: userMessageContent,
        created_at: new Date().toISOString()
      };
      
      // Update messages state with user message
      const updatedMessages = [...messages, optimisticUserMessage];
      setMessages(updatedMessages);

      // Create new chat session if needed
      if (!currentChatId) {
        try {
          setResponseGenerationPhase('thinking');
          
          const { data, error } = await supabase
            .from('chat_sessions')
            .insert([
              { 
                user_id: user.id,
                title: userMessageContent.substring(0, 50),
                model: selectedModel.id
              }
            ])
            .select();
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            targetChatId = data[0].id;
            setCurrentChatId(targetChatId);
            newSessionCreated = true;
            navigate(`/chat/${targetChatId}`);
          }
        } catch (error) {
          console.error('Error creating chat session:', error);
          setError('Failed to create chat session');
          setLoading(false);
          setPendingResponse(false);
          return;
        }
      }

      // Save the user message to database
      try {
        const { error: messageError } = await supabase
          .from('chat_messages')
          .insert([
            {
              chat_session_id: targetChatId,
              user_id: user.id,
              role: 'user',
              content: userMessageContent,
              model: selectedModel.id
            }
          ]);
        
        if (messageError) throw messageError;
      } catch (error) {
        console.error('Error saving user message:', error);
      }

      // Add temporary AI message as pending
      const tempAiMessage = {
        id: `pending-${Date.now()}`,
        role: 'assistant',
        content: '...',
        isPending: true,
        created_at: new Date().toISOString()
      };
      
      setOptimisticMessages([tempAiMessage]);
      
      // Get API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      try {
        // Change response phase for better UX
        setResponseGenerationPhase('generating');
        
        // Get recent messages for immediate context
        const recentMessages = prepareConversationContext(updatedMessages, 5);
        
        // Call AI API with conversation history, summary, and streaming callback
        const aiResponse = await callAIAPI(
          userMessageContent, 
          apiKey, 
          selectedModel.id, 
          recentMessages,
          conversationSummary,
          null,
          (streamText) => {
            setStreamingText(streamText);
          }
        );
        
        // Check if there was an error
        if (aiResponse.error) {
          setErrorMessage(aiResponse.text);
          setMessages(updatedMessages);
          setOptimisticMessages([]);
          setLoading(false);
          setPendingResponse(false);
          setResponseGenerationPhase(null);
          return;
        }
        
        // Start background summarization
        setIsSummarizingInBackground(true);
        setResponseGenerationPhase('summarizing');
        
        // Save AI response to database
        try {
          const { data: aiMessageData, error: aiMessageError } = await supabase
            .from('chat_messages')
            .insert([
              {
                chat_session_id: targetChatId,
                user_id: user.id,
                role: 'assistant',
                content: aiResponse.text,
                tokens_used: selectedModel.creditsPerRequest,
                model: selectedModel.id,
                metadata: { finishReason: aiResponse.metadata?.finishReason }
              }
            ])
            .select();
          
          if (aiMessageError) throw aiMessageError;
          
          // Add the AI assistant message to the messages array
          const assistantMessage = aiMessageData?.[0] || {
            id: `temp-${Date.now() + 1}`,
            role: 'assistant',
            content: aiResponse.text,
            tokens_used: selectedModel.creditsPerRequest,
            model: selectedModel.id,
            created_at: new Date().toISOString()
          };
          
          setOptimisticMessages([]);
          setMessages([...updatedMessages, assistantMessage]);
          
          // Generate conversation summary in the background
          try {
            const newSummary = await generateAISummary(
              [...updatedMessages, { role: 'assistant', content: aiResponse.text }],
              apiKey,
              selectedModel.id
            );
            
            // Update the session with the new summary
            if (newSummary) {
              await supabase
                .from('chat_sessions')
                .update({ conversation_summary: newSummary })
                .eq('id', targetChatId);
              
              // Save to localStorage for future use
              localStorage.setItem(`summary_${targetChatId}`, newSummary);
            }
          } catch (summaryError) {
            console.error('Error generating summary:', summaryError);
          } finally {
            setIsSummarizingInBackground(false);
          }
          
          // Update credits
          try {
            // Deduct credits from user account
            const { error: creditError } = await supabase
              .from('profiles')
              .update({ 
                credits: credits - selectedModel.creditsPerRequest 
              })
              .eq('id', user.id);
            
            if (!creditError) {
              setCredits(prev => prev - selectedModel.creditsPerRequest);
            }
          } catch (creditError) {
            console.error('Error updating credits:', creditError);
          }
          
          // If this was a new session, update the sessions list
          if (newSessionCreated) {
            await loadChatSessions(user.id);
          }
        } catch (error) {
          console.error('Error saving AI response:', error);
          setError('Failed to save AI response');
        }
      } catch (apiError) {
        console.error('Error calling AI API:', apiError);
        setError('Failed to generate AI response');
      }
    } catch (error) {
      console.error('Error in chat process:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setPendingResponse(false);
      setResponseGenerationPhase(null);
      setStreamingText('');
      setUnsavedChanges(false);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  return (
    <ChatLayout
      darkMode={darkMode}
      user={user}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      credits={credits}
      toggleTheme={toggleTheme}
      isMobile={isMobile}
      selectedModelName={selectedModel.name}
      handleModelSelect={handleModelChange}
      chatSessions={chatSessions}
      groupedChatSessions={groupedChatSessions}
      currentChatId={currentChatId}
      sessionsLoading={sessionsLoading}
      startNewChat={startNewChat}
      navigateToChat={navigateToChat}
      handleRenameSession={handleRenameSession}
      handleDeleteSession={handleDeleteSession}
      sessionToEdit={sessionToEdit}
      setSessionToEdit={setSessionToEdit}
      editSessionTitle={editSessionTitle}
      setEditSessionTitle={setEditSessionTitle}
      prefersReducedMotion={prefersReducedMotion}
      error={error}
      errorMessage={errorMessage}
    >
      <div className="h-full flex flex-col">
        {/* Main chat area */}
        <div className="flex-1 overflow-hidden">
          {currentChatId ? (
            <ChatConversation 
              messages={messages}
              optimisticMessages={optimisticMessages}
              loadingMoreMessages={false}
              responseGenerationPhase={responseGenerationPhase}
              streamingText={streamingText}
              isSummarizingInBackground={isSummarizingInBackground}
              hasMoreMessages={false}
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
              ref={messagesEndRef}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
              <div className="max-w-lg text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-6">Welcome to PentaCopy</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6 md:mb-8">
                  Start a conversation with PentaCopy and explore the power of AI to help with your tasks.
                </p>
                <button
                  onClick={startNewChat}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm md:text-base font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Start a New Chat
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat input */}
        {currentChatId && (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-950">
            <div className="max-w-3xl mx-auto w-full">
              <ChatInput 
                prompt={prompt}
                setPrompt={setPrompt}
                loading={loading || pendingResponse}
                uiLoading={responseGenerationPhase === 'thinking'}
                isTabActive={isTabActive.current}
                handleSendPrompt={handleSendPrompt}
                handleSendButtonClick={handleSendButtonClick}
                credits={credits}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </div>
    </ChatLayout>
  );
};

export default Chat; 