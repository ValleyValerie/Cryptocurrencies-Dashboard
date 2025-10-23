'use client';

import { useState } from 'react';

export default function TestThemePage() {
  const [mode, setMode] = useState('light');

  const toggleDark = () => {
    if (mode === 'light') {
      document.documentElement.classList.add('dark');
      setMode('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setMode('light');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Theme Test Page
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300">
          Current mode: <strong>{mode}</strong>
        </p>

        <button
          onClick={toggleDark}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Toggle Dark Mode
        </button>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-gray-900 dark:text-white">Card 1</h3>
            <p className="text-gray-600 dark:text-gray-300">This should change color</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-gray-900 dark:text-white">Card 2</h3>
            <p className="text-gray-600 dark:text-gray-300">This should change color</p>
          </div>
        </div>

        <div className="mt-8 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Debug Info
          </h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white overflow-auto">
            HTML classList: {document.documentElement.className || '(empty)'}
          </pre>
        </div>

        <div className="mt-4">
          <a 
            href="/dashboard" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}