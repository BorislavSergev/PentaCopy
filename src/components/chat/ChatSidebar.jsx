import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sidebarItemVariants } from '../../utils/chat/animations';
import { formatDate } from '../../utils/chat/helpers';
import UserProfileSection from './layout/UserProfileSection';

const ChatSidebar = ({ 
  chatSessions, 
  groupedChatSessions,
  currentChatId, 
  sidebarOpen,
  sessionsLoading,
  user,
  startNewChat, 
  navigateToChat,
  handleRenameSession,
  handleDeleteSession,
  sessionToEdit,
  setSessionToEdit,
  editSessionTitle, 
  setEditSessionTitle,
  prefersReducedMotion,
  isMobile,
  setSidebarOpen
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-900 w-64 h-full border-r border-gray-200 dark:border-gray-800 flex-shrink-0 overflow-hidden transition-all duration-300 flex flex-col ${
        sidebarOpen 
          ? 'translate-x-0 fixed md:relative z-20 shadow-lg md:shadow-none' 
          : '-translate-x-full md:translate-x-0 md:w-0'
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PentaCopy
          </span>
          {isMobile && (
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => sidebarOpen && setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={startNewChat}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat sessions list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 sidebar-scrollbar">
        {sessionsLoading ? (
          <div className="flex justify-center my-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-indigo-600 border-opacity-50 border-t-indigo-600 rounded-full"
            />
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedChatSessions.map(group => (
              <div key={group.id} className="space-y-1">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                  {group.label}
                </h3>
                <AnimatePresence>
                  {group.sessions.map((session, index) => (
                    sessionToEdit && sessionToEdit.id === session.id ? (
                      <motion.div
                        key={`edit-${session.id}`}
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        className="p-2"
                      >
                        <form onSubmit={handleRenameSession} className="flex flex-col space-y-2">
                          <input
                            type="text"
                            value={editSessionTitle}
                            onChange={(e) => setEditSessionTitle(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="flex-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setSessionToEdit(null)}
                              className="flex-1 px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={session.id}
                        custom={index}
                        variants={prefersReducedMotion ? {} : sidebarItemVariants}
                        initial={prefersReducedMotion ? {} : "hidden"}
                        animate={prefersReducedMotion ? {} : "visible"}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                        className={`px-2.5 py-2 rounded-lg group flex items-start justify-between transition-all duration-200 ${
                          session.id === currentChatId
                            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 shadow-sm'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer overflow-hidden"
                          onClick={() => {
                            navigateToChat(session.id);
                            if (isMobile) {
                              setSidebarOpen(false);
                            }
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm truncate">
                              {session.displayTitle || 'New Chat'}
                            </span>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <span className="truncate">{formatDate(session.created_at || new Date())}</span>
                              {session.hasSummary && (
                                <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-sm text-blue-800 dark:text-blue-200 text-[10px]">
                                  summarized
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSessionToEdit(session);
                              setEditSessionTitle(session.title || session.displayTitle || '');
                            }}
                            className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full hover:bg-white dark:hover:bg-gray-700"
                            aria-label="Rename"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-white dark:hover:bg-gray-700"
                            aria-label="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User profile section */}
      <UserProfileSection user={user} />
    </div>
  );
};

export default ChatSidebar; 