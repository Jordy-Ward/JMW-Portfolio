// Import React and React hooks we'll use
// useState: manages component state (variables that change and trigger re-renders)
// useEffect: runs code when component mounts or dependencies change
// useRef: creates a reference to a DOM element
import React, { useState, useEffect, useRef } from 'react';

/**
 * CRYPTO HELPER FUNCTIONS
 * These functions handle RSA encryption/decryption using the browser's Web Crypto API
 */

/**
 * Converts a PEM-formatted public key string into a CryptoKey object for encryption
 * @param {string} pem - The PEM-formatted public key string
 * @returns {Promise<CryptoKey>} - A CryptoKey object that can be used for encryption
 */
async function importPublicKey(pem) {
  // Remove the PEM header/footer lines and whitespace to get just the base64 data
  const b64 = pem.replace(/-----[^-]+-----|\s+/g, '');
  
  // Convert base64 string to binary data (Uint8Array)
  const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  
  // Import the binary key data as a CryptoKey object for RSA-OAEP encryption
  return window.crypto.subtle.importKey(
    'spki',                               // Key format (SubjectPublicKeyInfo)
    binaryDer,                            // The binary key data
    { name: 'RSA-OAEP', hash: 'SHA-256' }, // Algorithm configuration
    false,                                // Key is not extractable
    ['encrypt']                           // Key can only be used for encryption
  );
}
/**
 * Converts a PEM-formatted private key string into a CryptoKey object for decryption
 * @param {string} pem - The PEM-formatted private key string
 * @returns {Promise<CryptoKey>} - A CryptoKey object that can be used for decryption
 */
async function importPrivateKey(pem) {
  // Remove the PEM header/footer lines and whitespace to get just the base64 data
  const b64 = pem.replace(/-----[^-]+-----|\s+/g, '');
  
  // Convert base64 string to binary data (Uint8Array)
  const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  
  // Import the binary key data as a CryptoKey object for RSA-OAEP decryption
  return window.crypto.subtle.importKey(
    'pkcs8',                              // Key format (PKCS#8)
    binaryDer,                            // The binary key data
    { name: 'RSA-OAEP', hash: 'SHA-256' }, // Algorithm configuration
    false,                                // Key is not extractable
    ['decrypt']                           // Key can only be used for decryption
  );
}
/**
 * Encrypts a plain text message using RSA-OAEP with a public key
 * @param {string} message - The plain text message to encrypt
 * @param {CryptoKey} publicKey - The recipient's public key for encryption
 * @returns {Promise<string>} - Base64-encoded encrypted message
 */
async function encryptMessage(message, publicKey) {
  // Convert the text message to bytes (UTF-8 encoding)
  const enc = new TextEncoder().encode(message);
  
  // Encrypt the message bytes using RSA-OAEP
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },    // Algorithm
    publicKey,               // Encryption key
    enc                      // Message bytes to encrypt
  );
  
  // Convert encrypted bytes to base64 string for storage/transmission
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
/**
 * Decrypts a base64-encoded encrypted message using RSA-OAEP with a private key
 * @param {string} ciphertext - Base64-encoded encrypted message
 * @param {CryptoKey} privateKey - The user's private key for decryption
 * @returns {Promise<string>} - The decrypted plain text message, or error message if decryption fails
 */
async function decryptMessage(ciphertext, privateKey) {
  try {
    // Convert base64 string back to binary data
    const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    
    // Decrypt the binary data using RSA-OAEP
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },    // Algorithm
      privateKey,              // Decryption key
      data                     // Encrypted bytes to decrypt
    );
    
    // Convert decrypted bytes back to text (UTF-8 decoding)
    return new TextDecoder().decode(decrypted);
  } catch {
    // If decryption fails for any reason, return error message
    return '[Decryption failed]';
  }
}
/**
 * MAIN MESSAGING APP COMPONENT
 * This is a React functional component that renders the messaging interface
 * Props (inputs from parent component):
 * - onBack: function to call when user clicks "Back" button
 * - jwt: authentication token for API calls
 * - username: the current logged-in user's username
 */
export default function MessagingApp({ onBack, jwt, username }) {
  
  /**
   * STATE VARIABLES
   * useState creates state variables that trigger component re-renders when changed
   * Format: [variableName, setterFunction] = useState(initialValue)
   */
  
  // Controls whether the "New Chat" user dropdown is visible
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // List of all users that can be messaged (excluding current user)
  const [userList, setUserList] = useState([]);
  
  // Loading state while fetching users for dropdown
  const [userLoading, setUserLoading] = useState(false);
  
  // Error message if fetching users fails
  const [userError, setUserError] = useState('');
  
  // Currently selected chat (username of the person being chatted with)
  const [selectedChat, setSelectedChat] = useState(null);
  
  // The text currently typed in the message input field
  const [messageInput, setMessageInput] = useState('');
  
  // Whether a message is currently being sent (to disable UI during send)
  const [sending, setSending] = useState(false);
  
  // Error message if sending a message fails
  const [sendError, setSendError] = useState('');
  
  // Whether the "Encrypt" checkbox is checked
  const [encrypt, setEncrypt] = useState(false);
  
  // The public key of the current chat recipient (for encryption)
  const [recipientPublicKey, setRecipientPublicKey] = useState(null);
  
  // Reference to the dropdown DOM element (for detecting clicks outside)
  const dropdownRef = useRef();

  /**
   * PRIVATE KEY STATE VARIABLES
   * These handle the user's private key for decrypting received messages
   */
  
  // The raw PEM text of the private key (what user pastes)
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  
  // The processed CryptoKey object (null if no valid key loaded)
  const [privateKeyObj, setPrivateKeyObj] = useState(null);
  
  // Error message if private key is invalid
  const [privateKeyError, setPrivateKeyError] = useState('');

  /**
   * EVENT HANDLER: Handle private key paste
   * This function runs when the user types/pastes in the private key textarea
   * It tries to convert the PEM text into a usable CryptoKey object
   */
  const handlePrivateKeyPaste = async (e) => {
    // Get the text from the textarea
    const text = e.target.value;
    
    // Update the PEM text state
    setPrivateKeyPem(text);
    
    // Clear any previous error
    setPrivateKeyError('');
    
    try {
      // Try to convert PEM text to CryptoKey object
      const key = await importPrivateKey(text);
      
      // If successful, store the key object
      setPrivateKeyObj(key);
    } catch {
      // If conversion fails, show error and clear key object
      setPrivateKeyError('Invalid private key.');
      setPrivateKeyObj(null);
    }
  };

  /**
   * MESSAGE STATE VARIABLES
   */
  
  // Array of all messages for the currently selected chat
  const [allMessages, setAllMessages] = useState([]);
  
  // Array of chat participants for the sidebar (each has just username)
  const [chats, setChats] = useState([]);
  
  // Whether the app is loading chats for the first time
  const [loading, setLoading] = useState(true);
  
  // Error message if loading chats fails
  const [error, setError] = useState('');

  /**
   * EFFECT: Simple chat list loading
   * This useEffect runs when the component mounts to build a simple chat participants list
   * We only fetch this once on load, not on a polling interval for better performance
   * 
   * useEffect(() => { ... }, [dependencies]) runs when:
   * - Component mounts (first time)
   * - Any dependency in the array changes
   */
  useEffect(() => {
    // Flag to prevent state updates if component unmounts during async operations
    let isMounted = true;
    
    /**
     * Fetches unique chat participants (people you've messaged with)
     * This function runs only once when component loads
     */
    async function fetchChatParticipants() {
      // Show loading spinner
      setLoading(true);
      
      // Clear any previous errors
      setError('');
      
      try {
        // Make two API calls in parallel to get inbox and sent messages
        const inboxRes = await fetch('/api/rsa/messages/inbox', {
          headers: { Authorization: `Bearer ${jwt}` }  // Include auth token
        });
        const sentRes = await fetch('/api/rsa/messages/sent', {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        
        // Convert responses to JSON
        const inbox = await inboxRes.json();
        const sent = await sentRes.json();
        
        // If component was unmounted during fetch, don't update state
        if (!isMounted) return;
        
        // Build simple chat participants list - just unique usernames
        const participantsSet = new Set();
        [...inbox, ...sent].forEach(msg => {
          const other = msg.sender === username ? msg.recipient : msg.sender;
          participantsSet.add(other);
        });
        
        // Convert Set to array of simple chat objects (just username)
        const chatList = Array.from(participantsSet).map(username => ({
          username: username
        }));
        
        // Update the chat list
        setChats(chatList);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load chats.');
        setLoading(false);
      }
    }
    
    fetchChatParticipants();
    
    // No cleanup needed since we're not setting up any intervals
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [jwt, username]);

  // Per-chat message polling with decryption
  useEffect(() => {
    if (!selectedChat) return;
    let isMounted = true;
    let polling = true;
    let latestTimestamp = null;
    let messages = [];
    async function decryptMsgs(msgs) {
      // Decrypt messages if needed
      if (!privateKeyObj) return msgs;
      return await Promise.all(msgs.map(async m => {
        if (m.encrypted && privateKeyObj) {
          const decrypted = await decryptMessage(m.content, privateKeyObj);
          return { ...m, content: decrypted };
        }
        return m;
      }));
    }
    async function fetchInitial() {
      try {
        const res = await fetch(`/api/rsa/messages/with/${selectedChat}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        let msgs = await res.json();
        if (!isMounted) return;
        msgs = await decryptMsgs(msgs);
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
        let newMsgs = await res.json();
        if (!isMounted) return;
        newMsgs = await decryptMsgs(newMsgs);
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
  }, [selectedChat, jwt, privateKeyObj]);

  /**
   * EVENT HANDLER: Handle New Chat button click
   * This function runs when user clicks "New Chat" button
   * It fetches all users and shows them in a dropdown
   */
  const handleNewChat = async () => {
    // Show the dropdown
    setShowUserDropdown(true);
    
    // Show loading state while fetching users
    setUserLoading(true);
    
    // Clear any previous errors
    setUserError('');
    
    try {
      // Fetch all users from the API
      const res = await fetch('/api/rsa/users/getAllUsers', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      
      // Convert response to JSON to get array of user objects
      const users = await res.json();
      
      // Filter out the current user (don't show yourself in the list)
      setUserList(users.filter(u => u.username !== username));
      
      // Hide loading state
      setUserLoading(false);
    } catch (err) {
      // If fetch fails, show error message and hide loading
      setUserError('Failed to load users.');
      setUserLoading(false);
    }
  };

  /**
   * EFFECT: Close dropdown on outside click or Esc key
   * This useEffect sets up event listeners to close the user dropdown
   * when user clicks outside it or presses Escape key
   */
  useEffect(() => {
    // Only add listeners if dropdown is open
    if (!showUserDropdown) return;
    
    /**
     * Handle mouse clicks - close dropdown if click is outside the dropdown element
     */
    function handleClick(e) {
      // Check if the dropdown element exists and if the click was outside it
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    }
    
    /**
     * Handle keyboard presses - close dropdown if Escape key is pressed
     */
    function handleEsc(e) {
      if (e.key === 'Escape') setShowUserDropdown(false);
    }
    
    // Add event listeners to the document (global listeners)
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    
    // Cleanup function - remove listeners when effect cleans up
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showUserDropdown]); // Re-run effect when showUserDropdown changes

  /**
   * EVENT HANDLER: Handle selecting a user from dropdown
   * This runs when user clicks on a username in the "New Chat" dropdown
   */
  const handleSelectUser = async (user) => {
    // Check if a chat with this user already exists in the sidebar
    if (!chats.some(c => c.username === user.username)) {
      // If not, add a new chat entry to the sidebar (just username)
      setChats([
        { username: user.username }, 
        ...chats
      ]);
    }
    
    // Close the dropdown
    setShowUserDropdown(false);
    
    // Select this chat as the active conversation
    setSelectedChat(user.username);
    
    // Reset encryption settings for the new chat
    setEncrypt(false);
    setRecipientPublicKey(null);
    
    // Fetch the recipient's public key for encryption feature
    try {
      const res = await fetch(`/api/rsa/messages/public-key/${user.username}`, {
        headers: { Authorization: `Bearer ${jwt}`}  // Include auth token
      });
      
      if (res.ok) {
        // If successful, store the public key (as PEM text)
        const key = await res.text();
        setRecipientPublicKey(key);
      }
    } catch {
      // If fetch fails, silently ignore (encryption won't be available)
    }
  };

  /**
   * EVENT HANDLER: Handle selecting a chat from the sidebar list
   * This runs when user clicks on an existing chat in the sidebar
   */
  const handleSelectChat = async (chat) => {
    // Set this chat as the active conversation
    setSelectedChat(chat.username);
    
    // Clear any previous send errors
    setSendError('');
    
    // Reset encryption settings
    setEncrypt(false);
    setRecipientPublicKey(null);
    
    // Fetch the recipient's public key for encryption feature
    try {
      const res = await fetch(`/api/rsa/messages/public-key/${chat.username}`);
      
      if (res.ok) {
        const key = await res.text();
        setRecipientPublicKey(key);
      }
    } catch {
      // If fetch fails, silently ignore
    }
    
    // The per-chat polling effect will automatically load messages for this chat
  };

  /**
   * EVENT HANDLER: Handle sending a message
   * This runs when user submits the message form (clicks Send or presses Enter)
   * It handles both regular and encrypted messages
   */
  const handleSendMessage = async (e) => {
    // Prevent the form from doing a page reload
    e.preventDefault();
    
    // Don't send if no chat is selected or message is empty
    if (!selectedChat || !messageInput.trim()) return;
    
    // Set sending state to disable UI during send
    setSending(true);
    
    // Clear any previous send errors
    setSendError('');
    
    try {
      // Variables for the message content and encryption flag
      let contentToSend = messageInput;        // What we'll send to the server
      let encryptedFlag = false;               // Whether the message is encrypted
      let originalMessage = messageInput;      // Keep the original text for display
      let sentTimestamp = new Date().toISOString(); // Timestamp for this message
      
      // If user checked "Encrypt" and we have the recipient's public key
      if (encrypt && recipientPublicKey) {
        try {
          // Convert the recipient's public key from PEM to CryptoKey object
          const pubKey = await importPublicKey(recipientPublicKey);
          
          // Encrypt the message using the recipient's public key
          contentToSend = await encryptMessage(messageInput, pubKey);
          
          // Mark this message as encrypted
          encryptedFlag = true;
        } catch {
          // If encryption fails, show error and stop sending
          setSendError('Encryption failed.');
          setSending(false);
          return;
        }
      }
      
      /**
       * OPTIMISTIC UI UPDATE
       * Add the message to the chat immediately for responsive UI
       * This makes the app feel fast - user sees their message right away
       */
      setAllMessages(prev => [
        ...prev,  // Keep all existing messages
        {
          id: 'temp-' + Date.now(),                              // Temporary ID
          sender: username,                                      // Current user is sender
          recipient: selectedChat,                               // Selected chat user is recipient
          content: encryptedFlag ? 'encrypted' : originalMessage, // Show "encrypted" or actual text
          encrypted: encryptedFlag,                              // Whether message is encrypted
          timeStamp: sentTimestamp,                              // When message was sent
          _showAsEncryptedSent: encryptedFlag || undefined       // Special flag for UI styling
        }
      ]);
      
      // Update the chat list to show this user if they're not already there
      setChats(prev => {
        if (!prev.some(c => c.username === selectedChat)) {
          return [{ username: selectedChat }, ...prev];
        }
        return prev;
      });
      
      // Clear the message input field
      setMessageInput('');

      /**
       * SEND MESSAGE TO SERVER
       * Make API call to actually send the message
       */
      const res = await fetch('/api/rsa/messages/send', {
        method: 'POST',                                    // HTTP POST request
        headers: {
          'Content-Type': 'application/json',              // Sending JSON data
          Authorization: `Bearer ${jwt}`                   // Include auth token
        },
        body: JSON.stringify({                             // Convert to JSON string
          recipient: selectedChat,                         // Who to send to
          content: contentToSend,                          // Message content (encrypted or plain)
          encrypted: encryptedFlag                         // Whether content is encrypted
        })
      });
      
      // If server returns error, throw exception
      if (!res.ok) throw new Error('Failed to send message');

      /**
       * SYNC WITH SERVER
       * Fetch the updated message list from server to ensure UI is in sync
       */
      const res2 = await fetch(`/api/rsa/messages/with/${selectedChat}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      
      let msgs = await res2.json();
      
      // Decrypt any encrypted messages we received (if we have private key)
      if (privateKeyObj) {
        msgs = await Promise.all(msgs.map(async m => {
          // If message is encrypted and we have private key, decrypt it
          if (m.encrypted && privateKeyObj) {
            const decrypted = await decryptMessage(m.content, privateKeyObj);
            return { ...m, content: decrypted };
          }
          // Return message unchanged if not encrypted
          return m;
        }));
      }
      
      // Update the message list with the server data
      setAllMessages(msgs);
    } catch (err) {
      // If anything goes wrong during sending, show error message
      setSendError('Failed to send message.');
    } finally {
      // Always re-enable the UI after sending (success or failure)
      setSending(false);
    }
  };

  /**
   * JSX RETURN - THE USER INTERFACE
   * This is what gets rendered to the screen
   * JSX is like HTML but can include JavaScript expressions in {}
   */
  return (
    // Main container - full screen with dark gradient background
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      
      {/* Chat app container - rounded box with fixed height */}
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-md h-[700px] bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-800 relative">
        
        {/* HEADER SECTION */}
        <header className="bg-gray-950 text-gray-100 px-4 py-3 flex items-center justify-between shadow-lg">
          {/* Left side - app title and user avatar */}
          <div className="flex items-center gap-3">
            {/* User avatar circle with first letter of username */}
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center font-bold text-lg">
              {username && username.charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-semibold tracking-wide">RSA Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <textarea
                className="w-48 h-16 text-xs bg-gray-800 text-purple-200 border border-gray-700 rounded-lg p-2 mb-1 resize-none focus:outline-none focus:ring-2 focus:ring-purple-700"
                placeholder="Paste your private key here..."
                value={privateKeyPem}
                onChange={handlePrivateKeyPaste}
                spellCheck={false}
              />
              <span className="text-xs text-purple-300">Paste Private Key</span>
            </div>
            <button
              onClick={onBack}
              className="px-3 py-1 bg-gray-800 text-purple-300 rounded-lg font-semibold shadow hover:bg-gray-700 transition"
            >
              Back
            </button>
          </div>
        </header>
        {privateKeyError && <div className="text-xs text-red-400 text-center mt-1">{privateKeyError}</div>}
        {privateKeyObj && <div className="text-xs text-green-400 text-center mt-1">Private key loaded for decryption.</div>}
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
          {/* Chats list - simplified to just show participants */}
          <aside className="w-28 sm:w-40 bg-gray-950 border-r border-gray-800 flex flex-col">
            <div className="p-2 font-bold text-purple-300 text-xs border-b border-gray-800 text-center">Chats</div>
            <div className="flex-1 overflow-y-auto">
              {/* Only show loading or empty message on first load */}
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
                    .map((msg, idx) => {
                      const isSelf = msg.sender === username;
                      const isEncrypted = msg.encrypted;
                      let displayContent = msg.content;
                      // If sent by self and encrypted, show 'encrypted' in red
                      // If received and encrypted, show decrypted content (already handled by polling effect)
                      return (
                        <div
                          key={msg.id || idx}
                          className={`max-w-[70%] flex flex-col ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 shadow text-sm
                              ${isSelf
                                ? (isEncrypted ? 'bg-red-600 text-white' : 'bg-purple-700 text-white')
                                : 'bg-gray-700 text-gray-100'}
                            `}
                          >
                            {isSelf && isEncrypted ? 'encrypted' : displayContent}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {msg.timeStamp ? new Date(msg.timeStamp).toLocaleString() : ''}
                          </div>
                        </div>
                      );
                    })}
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
