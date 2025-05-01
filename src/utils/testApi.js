/**
 * Utility function to test the Gemini API directly
 * This is helpful for debugging issues with the API
 */

/**
 * Test the Gemini API with basic prompt
 * @param {string} apiKey - The API key to use
 * @param {string} modelId - The model ID to test (default: gemini-2.5-flash-preview-04-17)
 * @returns {Promise<Object>} - The API response
 */
export const testGeminiApi = async (apiKey, modelId = 'gemini-2.5-flash-preview-04-17') => {
  console.log(`Testing Gemini API with model: ${modelId}`);
  
  if (!apiKey) {
    const errorMsg = "API key is required";
    alert(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
  
  try {
    // Create the API endpoint URL
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
    
    // Create a conversation history like in the Python example
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: "test" }]
        },
        {
          role: "model",
          parts: [{ text: "test" }]
        },
        {
          role: "user",
          parts: [{ text: "INSERT_INPUT_HERE" }]
        }
      ],
      generationConfig: {
        temperature: 1.5,
        maxOutputTokens: 100,
        responseMimeType: "text/plain",
      }
    };
    
    console.log(`Sending request to ${apiEndpoint} with API key: ${apiKey.substring(0, 4)}...`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    // Make the API call
    const response = await fetch(`${apiEndpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check response status
    if (!response.ok) {
      const errorText = await response.text();
      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch (e) {
        errorObj = { rawError: errorText };
      }
      
      console.error(`API request failed with status ${response.status}:`, errorObj);
      
      const errorMsg = `API request failed with status ${response.status}: ${JSON.stringify(errorObj)}`;
      alert(errorMsg);
      
      return {
        success: false,
        status: response.status,
        error: errorObj,
        message: errorMsg
      };
    }
    
    // Parse the response
    const data = await response.json();
    console.log('API response:', data);
    
    // Extract the text response
    let responseText = '';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    }
    
    // Show success in alert
    const successMsg = `API test successful!\n\nResponse: ${responseText}`;
    alert(successMsg);
    
    return {
      success: true,
      data,
      text: responseText,
      message: 'API request successful'
    };
  } catch (error) {
    console.error('Error testing API:', error);
    
    const errorMsg = `Error: ${error.message}`;
    alert(errorMsg);
    
    return {
      success: false,
      error: error.toString(),
      message: errorMsg
    };
  }
};

// Example usage:
// import { testGeminiApi } from './utils/testApi';
// 
// // In an async function
// const result = await testGeminiApi('YOUR_API_KEY', 'gemini-pro');
// if (result.success) {
//   console.log('Test successful:', result.text);
// } else {
//   console.error('Test failed:', result.message);
// } 