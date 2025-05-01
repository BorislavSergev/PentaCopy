import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { callAIAPI, generateAISummary, AI_MODELS, getModelByName } from '../../lib/aiModels';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatConversation from '../../components/chat/ChatConversation';
import ChatInput from '../../components/chat/ChatInput';
import ModelSelector from '../../components/chat/ModelSelector';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import { formatDate, truncateText, getLocalStorageItem, setLocalStorageItem, debugLog } from '../../utils/chat/helpers';
import SuggestedPrompts from '../../components/chat/SuggestedPrompts';

// Layout components
import ChatLayout from '../../components/chat/layout/ChatLayout';
import EmptyStateScreen from '../../components/chat/layout/EmptyStateScreen';
import ChatFooter from '../../components/chat/layout/ChatFooter';

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
  const [selectedModelName, setSelectedModelName] = useState(AI_MODELS.GEMINI_PRO.name);
  const [showNewChatScreen, setShowNewChatScreen] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const isTabActive = useRef(true);
  
  // Media query for responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Theme context
  const { darkMode, toggleTheme } = useTheme();

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
      setShowNewChatScreen(false);
    } else if (!chatId && user) {
      // If there's no chatId, show the new chat screen
      setShowNewChatScreen(true);
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

  // Handle model selection
  const handleModelSelect = (modelName) => {
    const model = getModelByName(modelName);
    if (model) {
      setSelectedModel(model);
      setSelectedModelName(modelName);
    }
  };

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

  const updatePendingStatus = (chatId, isPending) => {
    try {
      const storedData = getLocalStorageItem(`chat_${chatId}`);
      if (storedData) {
        setLocalStorageItem(`chat_${chatId}`, {
          ...storedData,
          isPending
        });
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
      newSummary = `Conversation about ${truncateText(userPrompt, 50)}`;
    }
    
    return newSummary;
  };

  // Retrieve conversation summary from localStorage
  const getConversationSummary = (chatId) => {
    if (!chatId) return null;
    
    try {
      return localStorage.getItem(`summary_${chatId}`);
    } catch (error) {
      console.error('Failed to get conversation summary:', error);
      return null;
    }
  };

  // Event handlers
  const startNewChat = async (createSession = false) => {
    if (!createSession) {
      // Just show the new chat screen with suggestions
      setCurrentChatId(null);
      setMessages([]);
      setPrompt('');
      setError(null);
      setErrorMessage(null);
      setShowNewChatScreen(true);
      navigate('/chat');
      return;
    }
    
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
        setShowNewChatScreen(false);
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

      // Save the messages to localStorage for persistence
      if (targetChatId) {
        setLocalStorageItem(`chat_${targetChatId}`, {
          messages: updatedMessages,
          isPending: true
        });
        updatePendingStatus(targetChatId, true);
        
        // Get the conversation summary if this is an existing chat
        conversationSummary = getConversationSummary(targetChatId);
        debugLog('Retrieved conversation summary for context:', conversationSummary ? 'Available' : 'None');
      }

      // Create new chat session if needed
      if (!currentChatId) {
        try {
          setResponseGenerationPhase('thinking');
          
          const { data, error } = await supabase
            .from('chat_sessions')
            .insert([
              { 
                user_id: user.id,
                title: truncateText(userMessageContent, 50),
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
            // Process streaming text for better handling of Bulgarian characters
            try {
              // Check if the text contains Cyrillic (Bulgarian) characters
              const hasCyrillic = /[А-Яа-я]/.test(streamText);
              
              if (hasCyrillic) {
                // Do extensive preprocessing for Bulgarian text
                console.log("DEBUG: Handling Bulgarian streaming text");
                
                // Clean up and properly format the Bulgarian text
                let processedText = streamText
                  .replace(/\\n/g, '\n')      // Fix escaped newlines
                  .replace(/\\"/g, '"')       // Fix escaped quotes
                  .replace(/\\t/g, '  ')      // Replace tabs with spaces
                  .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
                    // Convert Unicode escape sequences to actual characters
                    return String.fromCharCode(parseInt(hex, 16));
                  });
                  
                // Save the original text for debugging
                console.log("DEBUG: Original Bulgarian text:", streamText.substring(0, 50) + "...");
                console.log("DEBUG: Processed Bulgarian text:", processedText.substring(0, 50) + "...");
                
                // If the processed text is empty but the original had content, use original
                if (!processedText.trim() && streamText.trim()) {
                  console.log("DEBUG: Using original text as fallback");
                  setStreamingText(streamText);
                } else {
                  setStreamingText(processedText);
                }
              } else {
                // Standard handling for non-Bulgarian text
                setStreamingText(streamText);
              }
            } catch (e) {
              console.error("Error processing streaming text:", e);
              setStreamingText(streamText); // Fallback to original text
            }
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
        
        // Immediately show the AI response to the user
        const assistantMessage = {
          id: `temp-${Date.now() + 1}`,
          role: 'assistant',
          content: aiResponse.text,
          tokens_used: selectedModel.creditsPerRequest,
          model: selectedModel.id,
          modelName: selectedModel.name,
          created_at: new Date().toISOString()
        };
        
        // Clear optimistic messages and update with real response
        setOptimisticMessages([]);
        setMessages([...updatedMessages, assistantMessage]);
        setResponseGenerationPhase(null);
        
        // Save to localStorage with the complete conversation
        setLocalStorageItem(`chat_${targetChatId}`, {
          messages: [...updatedMessages, assistantMessage],
          isPending: false
        });
        
        // Start background summarization AFTER showing the response
        setIsSummarizingInBackground(true);
        
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
                metadata: { 
                  finishReason: aiResponse.metadata?.finishReason,
                  modelName: selectedModel.name
                }
              }
            ])
            .select();
          
          if (aiMessageError) throw aiMessageError;
          
          // If we got a database ID, update the message in state
          if (aiMessageData && aiMessageData.length > 0) {
            const dbMessage = aiMessageData[0];
            setMessages(currentMessages => 
              currentMessages.map(msg => 
                msg.id === assistantMessage.id ? {...msg, id: dbMessage.id} : msg
              )
            );
          }
          
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

  const handlePromptSelect = (promptText) => {
    startNewChat(true).then(() => {
      setTimeout(() => {
        setPrompt(promptText);
      }, 300);
    });
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
      selectedModelName={selectedModelName}
      handleModelSelect={handleModelSelect}
      chatSessions={chatSessions}
      groupedChatSessions={groupedChatSessions}
      currentChatId={currentChatId}
      sessionsLoading={sessionsLoading}
      startNewChat={() => startNewChat(false)}
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
      {/* Empty state */}
      {!currentChatId && messages.length === 0 && showNewChatScreen && (
        <EmptyStateScreen 
          showSuggestions={true}
          handlePromptSelect={handlePromptSelect}
          user={user}
        />
      )}
      
      {/* New chat state, but no suggestions */}
      {!currentChatId && messages.length === 0 && !showNewChatScreen && (
        <EmptyStateScreen 
          showSuggestions={false}
          user={user}
        />
      )}

      {/* Chat conversation */}
      {(messages.length > 0 || loading || responseGenerationPhase) && (
        <ChatConversation
          messages={messages}
          optimisticMessages={optimisticMessages}
          loadingMoreMessages={false}
          responseGenerationPhase={responseGenerationPhase}
          streamingText={streamingText}
          isSummarizingInBackground={isSummarizingInBackground}
          hasMoreMessages={false}
          prefersReducedMotion={prefersReducedMotion}
          ref={messagesEndRef}
        />
      )}

      {/* Chat input section */}
      <ChatFooter
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        uiLoading={pendingResponse}
        isTabActive={isTabActive.current}
        handleSendPrompt={handleSendPrompt}
        handleSendButtonClick={handleSendButtonClick}
        credits={credits}
        selectedModelName={selectedModelName}
      />
    </ChatLayout>
  );
};

export default Chat; 