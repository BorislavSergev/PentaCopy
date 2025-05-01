import { useState, useEffect } from 'react';
import { testGeminiApi } from '../utils/testApi';
import { AI_MODELS } from '../lib/aiModels';

export default function DiagnosticPage() {
  const [apiKey, setApiKey] = useState('');
  const [modelId, setModelId] = useState('gemini-pro');
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [envVariables, setEnvVariables] = useState({});
  
  useEffect(() => {
    // Load API key from environment variables
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    setApiKey(geminiApiKey);
    
    // Collect environment variables for debugging
    const env = {
      NODE_ENV: import.meta.env.MODE,
      BASE_URL: import.meta.env.BASE_URL,
      GEMINI_KEY_SET: !!import.meta.env.VITE_GEMINI_API_KEY,
      GEMINI_KEY_LENGTH: geminiApiKey ? geminiApiKey.length : 0,
      GEMINI_KEY_PREFIX: geminiApiKey ? geminiApiKey.substring(0, 5) : '',
    };
    
    setEnvVariables(env);
  }, []);
  
  const handleApiTest = async () => {
    if (!apiKey) {
      setTestResults({
        success: false,
        message: 'API key is required'
      });
      return;
    }
    
    setLoading(true);
    setTestResults(null);
    
    try {
      const result = await testGeminiApi(apiKey, modelId);
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.toString(),
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUseDefault = () => {
    setModelId('gemini-pro');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Diagnostic Tool</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">{JSON.stringify(envVariables, null, 2)}</pre>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Gemini API</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="apiKey">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="Enter your Gemini API key"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="modelId">
              Model ID
            </label>
            <div className="flex gap-2">
              <input
                id="modelId"
                type="text"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                placeholder="e.g., gemini-pro"
              />
              <button
                onClick={handleUseDefault}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Use Default
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available models: {Object.values(AI_MODELS).map(m => m.id).join(', ')}
            </p>
          </div>
          
          <button
            onClick={handleApiTest}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-md ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } transition-colors`}
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </div>
        
        {testResults && (
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border-l-4 ${
            testResults.success ? 'border-green-500' : 'border-red-500'
          }`}>
            <h2 className="text-xl font-bold mb-4">
              Test Results: 
              <span className={testResults.success ? 'text-green-500 ml-2' : 'text-red-500 ml-2'}>
                {testResults.success ? 'Success' : 'Failed'}
              </span>
            </h2>
            
            <div className="mb-4">
              <div className="font-medium">Message:</div>
              <div className="mt-1">{testResults.message}</div>
            </div>
            
            {testResults.success && testResults.text && (
              <div className="mb-4">
                <div className="font-medium">API Response:</div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mt-1">
                  {testResults.text}
                </div>
              </div>
            )}
            
            <div>
              <div className="font-medium">Full Response:</div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mt-1 overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 