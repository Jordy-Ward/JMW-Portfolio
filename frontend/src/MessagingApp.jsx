import React, { useState, useEffect, useRef } from 'react';
export default function MessagingApp({ onBack, jwt, username }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [selectedChat, setSelectedChat] = useState(null); // username of selected chat
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [encrypt, setEncrypt] = useState(false);
  const [recipientPublicKey, setRecipientPublicKey] = useState(null);
  const dropdownRef = useRef();

  // Store all messages for the logged-in user
  const [allMessages, setAllMessages] = useState([]);
  // Chat list polling (inbox/sent) every 3 seconds, but do not wipe sidebar or selected chat
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    async function fetchChats() {
      if (firstLoad) setLoading(true);
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
        if (!isMounted) return;
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
        // Only update chats if changed (to avoid sidebar flicker)
        setChats(prev => {
          const prevStr = JSON.stringify(prev);
          const newStr = JSON.stringify(chatList);
          if (prevStr !== newStr) return chatList;
          return prev;
        });
        if (firstLoad) setLoading(false);
        firstLoad = false;
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load chats.');
        if (firstLoad) setLoading(false);
        firstLoad = false;
      }
    }
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [jwt, username]);

  // Per-chat message polling
  useEffect(() => {
    if (!selectedChat) return;
    let isMounted = true;
    let polling = true;
    let latestTimestamp = null;
    let messages = [];
    async function fetchInitial() {
      try {
        const res = await fetch(`/api/rsa/messages/with/${selectedChat}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const msgs = await res.json();
        if (!isMounted) return;
        messages = msgs;
        setAllMessages(msgs);
        if (msgs.length > 0) {
          latestTimestamp = new Date(msgs[msgs.length - 1].timeStamp).getTime();
        }
      } catch {}
    }
    async function pollNew() {
      if (!polling || !selectedChat) return;
      try {
        const url = latestTimestamp ? `/api/rsa/messages/with/${selectedChat}?after=${latestTimestamp}` : `/api/rsa/messages/with/${selectedChat}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const newMsgs = await res.json();
        if (!isMounted) return;
        if (newMsgs.length > 0) {
          messages = [...messages, ...newMsgs];
          setAllMessages(messages);
          latestTimestamp = new Date(messages[messages.length - 1].timeStamp).getTime();
        }
      } catch {}
    }
    fetchInitial();
    const interval = setInterval(pollNew, 3000);
    return () => {
      isMounted = false;
      polling = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [selectedChat, jwt]);
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

  // Close dropdown on outside click or Esc
  useEffect(() => {
    if (!showUserDropdown) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setShowUserDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showUserDropdown]);

  // Handler for selecting a user from dropdown
  const handleSelectUser = async (user) => {
    // If chat already exists, just select it
    if (!chats.some(c => c.username === user.username)) {
      setChats([{ username: user.username, lastMessage: '', lastTime: new Date().toISOString() }, ...chats]);
    }
    setShowUserDropdown(false);
    setSelectedChat(user.username);
    setEncrypt(false);
    setRecipientPublicKey(null);
    // Fetch recipient public key for encryption toggle
    try {
      const res = await fetch(`/api/rsa/messages/public-key/${user.username}`);
      if (res.ok) {
        const key = await res.text();
        setRecipientPublicKey(key);
      }
    } catch {}
  };

  // Handler for selecting a chat from the list
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat.username);
    setSendError('');
    setEncrypt(false);
    setRecipientPublicKey(null);
    // Fetch recipient public key for encryption toggle
    try {
      const res = await fetch(`/api/rsa/messages/public-key/${chat.username}`);
      if (res.ok) {
        const key = await res.text();
        setRecipientPublicKey(key);
      }
    } catch {}
    // The per-chat polling effect will load messages
  };

  // Handler for sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedChat || !messageInput.trim()) return;
    setSending(true);
    setSendError('');
    try {
      let contentToSend = messageInput;
      // If encrypt is true and public key is available, encrypt here (placeholder)
      // You can add real encryption logic here if needed
      const res = await fetch('/api/rsa/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          recipient: selectedChat,
          content: contentToSend,
          encrypted: encrypt
        })
      });
      if (!res.ok) throw new Error('Failed to send message');
      // After sending, fetch all messages for this chat again
      const res2 = await fetch(`/api/rsa/messages/with/${selectedChat}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const msgs = await res2.json();
      setAllMessages(msgs);
      setChats(prev => prev.map(c => c.username === selectedChat ? { ...c, lastMessage: messageInput, lastTime: new Date().toISOString() } : c));
      setMessageInput('');
    } catch (err) {
      setSendError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-md h-[700px] bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-800 relative">
        {/* Header */}
        <header className="bg-gray-950 text-gray-100 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center font-bold text-lg">
              {username && username.charAt(0).toUpperCase()}
            </div>
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
            <div ref={dropdownRef} className="absolute left-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 w-48 max-h-60 overflow-y-auto">
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
              {/* Only show loading or empty message on first load, not on every poll */}
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
                    className={`p-3 cursor-pointer border-b border-gray-800 flex flex-col items-center gap-1 hover:bg-gray-800 ${selectedChat === chat.username ? 'bg-gray-800' : ''}`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center font-bold text-gray-900">
                      {chat.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-200 font-semibold truncate w-full text-center">{chat.username}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
          {/* Chat window */}
          <main className="flex-1 flex flex-col bg-gray-800">
            {/* Chat header */}
            {selectedChat ? (
              <>
                <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-3 bg-gray-900 relative">
                  <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center font-bold text-gray-900">{selectedChat.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="font-semibold text-purple-200 text-sm">{selectedChat}</div>
                  </div>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                    onClick={() => setSelectedChat(null)}
                  >
                    Close
                  </button>
                </div>
                {/* Messages between logged-in user and selected chat */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {allMessages
                    .filter(msg =>
                      (msg.sender === username && msg.recipient === selectedChat) ||
                      (msg.sender === selectedChat && msg.recipient === username)
                    )
                    .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp))
                    .map((msg, idx) => (
                      <div
                        key={msg.id || idx}
                        className={`max-w-[70%] flex flex-col ${msg.sender === username ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div className={`rounded-lg px-4 py-2 shadow text-sm ${msg.sender === username ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-100'}`}>
                          {msg.content}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {msg.timeStamp ? new Date(msg.timeStamp).toLocaleString() : ''}
                        </div>
                      </div>
                    ))}
                </div>
                {/* Message input */}
                <form className="flex items-center gap-2 p-3 border-t border-gray-700 bg-gray-900" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-gray-800 text-gray-100"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    disabled={sending}
                  />
                  {recipientPublicKey && (
                    <label className="flex items-center gap-1 text-xs text-purple-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={encrypt}
                        onChange={e => setEncrypt(e.target.checked)}
                        className="accent-purple-700"
                        disabled={sending}
                      />
                      Encrypt
                    </label>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold shadow transition flex items-center gap-2"
                    disabled={sending}
                  >
                    Send
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-300"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </button>
                </form>
                {sendError && <div className="text-xs text-red-400 text-center mt-1">{sendError}</div>}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a chat to start messaging.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
