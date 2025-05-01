import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import ChatSidebar from '../ChatSidebar';
import MobileHeader from './MobileHeader';
import ChatHeader from './ChatHeader';
import ErrorNotification from './ErrorNotification';

const ChatLayout = ({
  children,
  darkMode,
  user,
  sidebarOpen,
  setSidebarOpen,
  credits,
  toggleTheme,
  isMobile,
  selectedModelName,
  handleModelSelect,
  chatSessions,
  groupedChatSessions,
  currentChatId,
  sessionsLoading,
  startNewChat,
  navigateToChat,
  handleRenameSession,
  handleDeleteSession,
  sessionToEdit,
  setSessionToEdit,
  editSessionTitle,
  setEditSessionTitle,
  prefersReducedMotion,
  error,
  errorMessage,
}) => {
  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar */}
      <ChatSidebar 
        chatSessions={chatSessions}
        groupedChatSessions={groupedChatSessions}
        currentChatId={currentChatId}
        sidebarOpen={sidebarOpen}
        sessionsLoading={sessionsLoading}
        user={user}
        startNewChat={startNewChat}
        navigateToChat={navigateToChat}
        handleRenameSession={handleRenameSession}
        handleDeleteSession={handleDeleteSession}
        sessionToEdit={sessionToEdit}
        setSessionToEdit={setSessionToEdit}
        editSessionTitle={editSessionTitle}
        setEditSessionTitle={setEditSessionTitle}
        prefersReducedMotion={prefersReducedMotion}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden shadow-xl">
        {/* Mobile header with menu toggle */}
        {isMobile && (
          <MobileHeader 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            selectedModelName={selectedModelName}
            handleModelSelect={handleModelSelect}
            credits={credits}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
          />
        )}

        {/* Chat header (on desktop) */}
        {!isMobile && (
          <ChatHeader 
            selectedModelName={selectedModelName}
            handleModelSelect={handleModelSelect}
            credits={credits}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
          />
        )}

        {/* Chat content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
          {/* Error notifications */}
          <ErrorNotification error={error} errorMessage={errorMessage} />
          
          {/* Main content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout; 