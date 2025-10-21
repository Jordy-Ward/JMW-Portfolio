import React, { useState, useRef } from 'react';

export default function KeyDeliveryModal({ 
  isOpen, 
  onClose, 
  privateKey, 
  username,
  onSaveLocally 
}) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [checklist, setChecklist] = useState({
    copied: false,
    downloaded: false,
    savedLocally: false
  });
  
  const textAreaRef = useRef(null);

  // Copy private key to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopiedKey(true);
      setChecklist(prev => ({ ...prev, copied: true }));
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      textAreaRef.current?.select();
      document.execCommand('copy');
      setCopiedKey(true);
      setChecklist(prev => ({ ...prev, copied: true }));
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Download key as file
  const downloadKeyFile = () => {
    const filename = `${username}_private_key.txt`;
    const element = document.createElement('a');
    const file = new Blob([
      `RSA Private Key for ${username}\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `\n` +
      `IMPORTANT: Keep this key secure and private!\n` +
      `This key is required to decrypt messages sent to you.\n` +
      `\n` +
      `Private Key:\n` +
      `${privateKey}\n` +
      `\n` +
      `Instructions:\n` +
      `1. When using the PingChat, paste this key in the "Private Key" field\n` +
      `2. Never share this key with anyone\n`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    
    setChecklist(prev => ({ ...prev, downloaded: true }));
  };

  // Save to localStorage
  const saveLocally = () => {
    if (onSaveLocally) {
      onSaveLocally(privateKey);
      setChecklist(prev => ({ ...prev, savedLocally: true }));
    }
  };

  if (!isOpen) return null;

  // User only needs to complete at least one backup method
  const hasBackedUp = checklist.copied || checklist.downloaded || checklist.savedLocally;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🔐 Your Encryption Key
              </h2>
              <p className="text-purple-100 mt-1">
                You need this key to decrypt encrypted messages sent to you. Keep it safe!
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={!hasBackedUp}
              className={`text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition ${
                !hasBackedUp ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={!hasBackedUp ? 'Please choose at least one backup method first' : 'Close'}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">🔐</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Secure Your Private Key</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Choose at least one method below to secure your private key. Downloading as a File and saving to browser is recomended!
                </p>
              </div>
            </div>
          </div>

          {/* Key Display */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Private Key for {username}:
            </label>
            <div className="relative">
              <textarea
                ref={textAreaRef}
                value={privateKey}
                readOnly
                className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Backup Options - Choose Any */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Choose Your Backup Method 
              <span className="text-sm font-normal text-gray-600">(pick at least one)</span>
            </h3>
            <div className="space-y-3">
              {/* Copy Option */}
              <div className={`p-3 rounded-lg border-2 transition-all ${
                checklist.copied 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <div className="font-medium text-gray-800">Copy to Clipboard</div>
                      <div className="text-xs text-gray-600">Copy and paste somewhere safe</div>
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      checklist.copied
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {checklist.copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Download Option */}
              <div className={`p-3 rounded-lg border-2 transition-all ${
                checklist.downloaded 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💾</span>
                    <div>
                      <div className="font-medium text-gray-800">Download as File</div>
                      <div className="text-xs text-gray-600">Save to your downloads as a text file</div>
                    </div>
                  </div>
                  <button
                    onClick={downloadKeyFile}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      checklist.downloaded
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {checklist.downloaded ? '✓ Downloaded!' : 'Download'}
                  </button>
                </div>
              </div>

              {/* Browser Storage Option */}
              <div className={`p-3 rounded-lg border-2 transition-all ${
                checklist.savedLocally 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌐</span>
                    <div>
                      <div className="font-medium text-gray-800">Save in Browser Local Storage</div>
                      <div className="text-xs text-gray-600">Auto-loads upon visiting messaging app</div>
                    </div>
                  </div>
                  <button
                    onClick={saveLocally}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      checklist.savedLocally
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {checklist.savedLocally ? '✓ Saved!' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {hasBackedUp && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-center">
                <span className="text-green-800 font-medium">
                  ✅ Great!
                </span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          {hasBackedUp && (
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                Continue to PingChat 🚀
              </button>
            </div>
          )}

          {!hasBackedUp && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Please choose at least one backup method above to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}