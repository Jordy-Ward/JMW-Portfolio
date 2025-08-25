import React, { useState, useEffect } from 'react';
export default function MessagingApp({ onBack, jwt, username }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      setError('');
      try {
        const inboxRes = await fetch('/api/rsa/messages/inbox', {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const sentRes = await fetch('/api/rsa/messages/sent', {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const inbox = await inboxRes.json();
        const sent = await sentRes.json();
        // Build chat list: unique usernames (other than self) from sender/recipient
        const chatMap = {};
        [...inbox, ...sent].forEach(msg => {
          const other = msg.sender === username ? msg.recipient : msg.sender;
          if (!chatMap[other]) chatMap[other] = [];
          chatMap[other].push(msg);
        });
        // Build chat list with last message/time
        const chatList = Object.entries(chatMap).map(([user, msgs]) => {
          const lastMsg = msgs.reduce((a, b) => new Date(a.timeStamp) > new Date(b.timeStamp) ? a : b);
          return {
            username: user,
            lastMessage: lastMsg.content,
            lastTime: lastMsg.timeStamp
          };
        }).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
        setChats(chatList);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chats.');
        setLoading(false);
      }
    }
    fetchChats();
    // eslint-disable-next-line
  }, [jwt, username]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handler for New Chat button
  const handleNewChat = async () => {
    setShowUserDropdown(true);
    setUserLoading(true);
    setUserError('');
    try {
      const res = await fetch('/api/rsa/users/getAllUsers', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const users = await res.json();
      // Exclude self
      setUserList(users.filter(u => u.username !== username));
      setUserLoading(false);
    } catch (err) {
      setUserError('Failed to load users.');
      setUserLoading(false);
    }
  };

  // Handler for selecting a user from dropdown
  const handleSelectUser = (user) => {
    // If chat already exists, do nothing (or open it)
    if (!chats.some(c => c.username === user.username)) {
      setChats([{ username: user.username, lastMessage: '', lastTime: new Date().toISOString() }, ...chats]);
    }
    setShowUserDropdown(false);
    // Optionally, set selected chat here
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-md h-[700px] bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-800 relative">
        {/* Header */}
        <header className="bg-gray-950 text-gray-100 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center font-bold text-lg">JW</div>
            <span className="text-lg font-semibold tracking-wide">RSA Messaging</span>
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-800 text-purple-300 rounded-lg font-semibold shadow hover:bg-gray-700 transition"
          >
            Back
          </button>
        </header>
        {/* Start New Chat */}
        <div className="px-4 py-2 bg-gray-950 border-b border-gray-800 flex items-center gap-2 relative">
          <button
            className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium shadow transition text-sm"
            onClick={handleNewChat}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
          {showUserDropdown && (
            <div className="absolute left-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 w-48 max-h-60 overflow-y-auto">
              {userLoading ? (
                <div className="p-3 text-xs text-gray-400 text-center">Loading users...</div>
              ) : userError ? (
                <div className="p-3 text-xs text-red-400 text-center">{userError}</div>
              ) : userList.length === 0 ? (
                <div className="p-3 text-xs text-gray-400 text-center">No other users found.</div>
              ) : (
                userList.map(user => (
                  <div
                    key={user.username}
                    className="px-4 py-2 cursor-pointer hover:bg-purple-700 hover:text-white text-gray-200 text-sm"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.username}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* Main layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chats list */}
          <aside className="w-28 sm:w-40 bg-gray-950 border-r border-gray-800 flex flex-col">
            <div className="p-2 font-bold text-purple-300 text-xs border-b border-gray-800 text-center">Chats</div>
            <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="text-gray-400 text-xs p-4 text-center">Loading chats...</div>
                  ) : error ? (
                    <div className="text-red-400 text-xs p-4 text-center">{error}</div>
                  ) : chats.length === 0 ? (
                    <div className="text-gray-400 text-xs p-4 text-center">No chats yet.</div>
                  ) : (
                    chats.map(chat => (
                      <div
                        key={chat.username}
                        className="p-3 cursor-pointer border-b border-gray-800 flex flex-col items-center gap-1 hover:bg-gray-800"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center font-bold text-gray-900">
                          {chat.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-200 font-semibold truncate w-full text-center">{chat.username}</div>
                        <div className="text-[10px] text-gray-400 truncate w-full text-center">{chat.lastMessage}</div>
                      </div>
                    ))
                  )}
            </div>
          </aside>
          {/* Chat window */}
          <main className="flex-1 flex flex-col bg-gray-800">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-3 bg-gray-900">
              <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center font-bold text-gray-900">A</div>
              <div>
                <div className="font-semibold text-purple-200 text-sm">Alice</div>
                <div className="text-xs text-gray-400">Online</div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {/* Example messages */}
              <div className="self-start max-w-[70%] bg-gray-700 rounded-lg px-4 py-2 shadow text-gray-100">Hey, how are you?</div>
              <div className="self-end max-w-[70%] bg-purple-700 text-white rounded-lg px-4 py-2 shadow flex items-center gap-2">
                I'm good, thanks! <span className="inline-block"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-300"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span>
              </div>
              {/* Add more messages here */}
            </div>
            {/* Message input */}
            <form className="flex items-center gap-2 p-3 border-t border-gray-700 bg-gray-900">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-gray-800 text-gray-100"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold shadow transition flex items-center gap-2"
              >
                Send
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-300"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
