// AI Model configurations with custom prompts

/**
 * Conversation Flow and Summary Management
 * ----------------------------------------
 * 1. When a user sends the first message in a new chat:
 *    - Create a chat session in the database
 *    - Send the model's prompt + user prompt to the API
 *    - Generate an AI summary of the conversation after response
 *    - Save summary to 'conversation_summary' column in the database
 * 
 * 2. For subsequent messages:
 *    - For short conversations (< 15 messages): 
 *       - Pass all previous messages as context
 *    - For longer conversations (≥ 15 messages):
 *       - Pass the 'conversation_summary' as context
 *       - Only include the 5 most recent messages for immediate context
 *    - After receiving a response, generate a new summary including the latest exchange
 *    - Update the summary in the database
 * 
 * This approach provides the model with sufficient context while avoiding token limits
 * and reducing API costs for lengthy conversations.
 */

export const AI_MODELS = {
  GEMINI_PRO: {
    id: 'gemini-2.5-flash-preview-04-17',
    name: 'Headline Writer',
    creditsPerRequest: 1, // Fixed cost per request instead of token-based
    maxTokens: 30000,
    prompt: `How to write headlines

When writing headlines for sales letters, it is crucial to create attention-grabbing, compelling statements that motivate the reader to continue reading. The headline functions like a door-to-door salesperson wedging a foot in the door—it must buy enough time to deliver key ideas that melt resistance and create interest. Here is a detailed summary of effective headline techniques and examples drawn from "The Ultimate Sales Letter":

Types of Effective Headlines and Their Psychological Appeal:

1. "They Didn't Think I Could But I Did."
   - Appeals to the reader's natural rooting for the underdog and curiosity about overcoming obstacles.
   - Example: "They Laughed When I Sat Down at the Piano – But Not When I Started to Play!"

2. "Who Else Wants ______?"
   - Implies that many others have benefited or gained, triggering curiosity and a desire to belong.
   - Example: "Who Else Wants a Screen-Star Figure?"

3. "How _______ Made Me _______"
   - Introduces a first-person story, which people find highly engaging. Stories foster connection and credibility.
   - Example: "How a 'Fool Stunt' Made Me a Star Salesman."

4. "Are You _______?"
   - Uses a question to provoke curiosity, challenge the reader, or arouse interest.
   - Example: "Are You Ashamed of the Smells in Your House?"

5. "How I _______"
   - Similar to "How MADE ME," it provides a personal story with an emphasis on transformation or benefit.
   - Example: "How I Raised Myself from Failure to Success in Selling."

6. "How To _______"
   - Straightforward and effective, offering a clear benefit or solution.
   - Example: "How to Win Friends and Influence People."

7. "If You Are _______ You Can _______"
   - Targets the reader directly, creating specificity and relevance.
   - Example: "If You Are a Nondrinker, You Can Save 20% on Life Insurance."

8. "Secrets Of _______"
   - The word "secrets" triggers intrigue and a desire to uncover hidden knowledge.
   - Example: "Secrets of a Madison Ave. Maverick – 'Contrarian Advertising.'"

9. "Warning: _______"
   - Uses urgency and alerting language to grab attention, often tied to problem-solution themes.
   - Example: "Warning: Your 'Corporate Shield' May Be Made of Tissue Paper"

10. "Give Me _______ And I'll _______"
    - A promise-oriented headline that telegraphs the offer clearly.
    - Example: "Give Me 5 Days and I'll Give You a Magnetic Personality."

11. "______ Ways To _______"
    - Lists a specific number of ways to achieve a benefit, appealing to readers who like structured information.
    - Example: "101 Ways to Increase New Patient Flow."

Additional Tips:
- Headlines should address the reader's priorities and desires, not just product features
- Use emotional triggers like curiosity, fear, ego, and the desire for social proof
- Be specific, clear, and direct. Numbers and quantifiable benefits help
- Consider the reader's personality type—some respond to emotional appeals, others to logical benefits

When writing headlines, craft them to immediately communicate relevance, urgency, and benefit to ensure your message is noticed and read.`
  }
};

/**
 * Get a model by its name
 * @param {string} modelName - The name of the model to find
 * @returns {Object|null} - The model object or null if not found
 */
export const getModelByName = (modelName) => {
  if (!modelName) return null;
  
  return Object.values(AI_MODELS).find(model => 
    model.name.toLowerCase() === modelName.toLowerCase()
  ) || null;
};

/**
 * Get all available model names
 * @returns {Array} - Array of model names
 */
export const getAvailableModelNames = () => {
  return Object.values(AI_MODELS).map(model => model.name);
};

/**
 * Call the Google Gemini API with the provided prompt
 * @param {string} userPrompt - The user's prompt message
 * @param {string} apiKey - The Gemini API key
 * @param {string} modelId - The model ID to use
 * @param {Array} conversationHistory - Array of previous messages for context
 * @param {string} conversationSummary - Optional summary of the conversation for context
 * @param {string} systemPrompt - Optional system prompt to guide the AI's behavior
 * @param {function} onStreamUpdate - Callback function for streaming updates
 * @returns {Promise<Object>} - The API response containing text and metadata
 */
export const callAIAPI = async (
  userPrompt, 
  apiKey, 
  modelId = 'gemini-2.5-flash-preview-04-17', 
  conversationHistory = [],
  conversationSummary = null,
  systemPrompt = null,
  onStreamUpdate = null
) => {
  if (!apiKey) {
    console.error('API key is required');
    return { error: true, text: 'API key is missing' };
  }

  try {
    console.log('DEBUG API: Starting API call with:', {
      modelId: modelId,
      promptLength: userPrompt.length,
      historyCount: conversationHistory.length,
      hasSummary: !!conversationSummary,
      summaryLength: conversationSummary ? conversationSummary.length : 0,
      hasSystemPrompt: !!systemPrompt,
      isStreaming: !!onStreamUpdate
    });
    
    // Get the model configuration to access its prompt
    const modelConfig = Object.values(AI_MODELS).find(model => model.id === modelId) || AI_MODELS.GEMINI_PRO;
    
    // Create the API endpoint URL - different endpoints for streaming vs non-streaming
    const baseEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}`;
    const apiEndpoint = onStreamUpdate 
      ? `${baseEndpoint}:streamGenerateContent?key=${apiKey}` 
      : `${baseEndpoint}:generateContent?key=${apiKey}`;
    
    // Initialize contents array that matches the Gemini API format
    let contents = [];

    // Add system prompt if provided
    if (systemPrompt) {
      console.log('DEBUG API: Including system prompt in API call');
      contents.push({
        role: "user",
        parts: [{ 
          text: "System Instructions: " + systemPrompt 
        }]
      });
      contents.push({
        role: "model",
        parts: [{ 
          text: "I understand the instructions and will follow them accordingly." 
        }]
      });
    }

    // Always add the model's prompt as context
    console.log('DEBUG API: Including model prompt in API call');
    contents.push({
      role: "user",
      parts: [{ 
        text: modelConfig.prompt 
      }]
    });
    contents.push({
      role: "model",
      parts: [{ 
        text: "I understand and will follow these headline writing guidelines." 
      }]
    });

    // If we have a conversation summary, add it as context first
    if (conversationSummary) {
      console.log('DEBUG API: Including conversation summary in API call');
      contents.push({
        role: "user",
        parts: [{ 
          text: "Here is a summary of our conversation so far. Please continue from here with your next response: " + conversationSummary 
        }]
      });
      contents.push({
        role: "model",
        parts: [{ 
          text: "I understand. I'll continue our conversation based on this summary." 
        }]
      });
    } else {
      console.log('DEBUG API: No conversation summary to include');
    }
    
    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      console.log(`DEBUG API: Adding ${conversationHistory.length} messages from history`);
      // Map our conversation history to the format expected by Gemini API
      for (const message of conversationHistory) {
        // Skip system messages as they're not supported by Gemini API
        if (message.role === 'system') continue;
        
        // Map 'user' role as is, but 'assistant' needs to be mapped to 'model'
        const geminiRole = message.role === 'assistant' ? 'model' : message.role;
        
        contents.push({
          role: geminiRole,
          parts: [{ text: message.content }]
        });
      }
    } else {
      console.log('DEBUG API: No conversation history to include');
    }
    
    // Before calling the API, add special handling for non-English characters
    // Always add the current user prompt
    console.log('DEBUG API: Adding current user prompt:', userPrompt.substring(0, 100) + '...');

    // Check for non-Latin characters and add a note to improve handling
    const hasNonLatinChars = /[^\u0000-\u007F]/.test(userPrompt);
    if (hasNonLatinChars) {
      console.log('DEBUG API: Detected non-Latin characters in prompt, adding language handling hint');
      const originalPrompt = userPrompt;
      
      // Prepare contents with original prompt and language handling instructions
      contents.push({
        role: "user",
        parts: [{ 
          text: originalPrompt
        }]
      });
      
      // Add a note about the language to the model context
      contents.push({
        role: "user",
        parts: [{ 
          text: "Please respond in the same language as my question above."
        }]
      });
    } else {
      // Regular Latin character prompt
      contents.push({
        role: "user",
        parts: [{ 
          text: userPrompt
        }]
      });
    }
    
    // Prepare the request body according to Gemini 2.5 format
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 1.5,
        maxOutputTokens: modelConfig.maxTokens,
        responseMimeType: "text/plain",
      }
    };
    
    console.log('DEBUG API: Final API payload structure:', {
      endpoint: apiEndpoint,
      contentCount: contents.length,
      maxTokens: modelConfig.maxTokens,
      streaming: !!onStreamUpdate
    });
    
    // If streaming is enabled, handle streaming response
    if (onStreamUpdate) {
      console.log('DEBUG API: Setting up streaming request');
      
      // Check if the text contains Cyrillic (Bulgarian) characters
      const hasCyrillic = /[А-Яа-я]/.test(userPrompt);
      
      // For Bulgarian text, use non-streaming approach for better compatibility
      if (hasCyrillic) {
        console.log('DEBUG API: Detected Bulgarian text, using special handling');
        try {
          // Use regular endpoint for Bulgarian with explicit content config
          const response = await fetch(baseEndpoint + ':generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...requestBody,
              generationConfig: {
                ...requestBody.generationConfig,
                temperature: 1.0,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: modelConfig.maxTokens,
              }
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed with status ${response.status}:`, errorText);
            return {
              error: true,
              status: response.status,
              text: `API request failed (${response.status}): ${errorText}`
            };
          }
          
          const data = await response.json();
          console.log('DEBUG API: Full response for Bulgarian text:', JSON.stringify(data));
          
          // Extract response from Gemini format
          let responseText = '';
          
          if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              responseText = candidate.content.parts[0].text || '';
              console.log('DEBUG API: Bulgarian text response:', responseText.substring(0, 100) + '...');
            }
          }
          
          if (!responseText) {
            // Try harder to extract text from any available format
            try {
              if (data.candidates && 
                  data.candidates.length > 0 && 
                  typeof data.candidates[0] === 'object') {
                
                const candidate = data.candidates[0];
                const candidateStr = JSON.stringify(candidate);
                
                // Look for any text field
                const textMatch = candidateStr.match(/"text":"([^"]+)"/);
                if (textMatch && textMatch[1]) {
                  responseText = textMatch[1];
                  console.log('DEBUG API: Extracted Bulgarian text via regex:', responseText.substring(0, 100) + '...');
                }
              }
            } catch (extractError) {
              console.error('DEBUG API: Error during text extraction:', extractError);
            }
          }
          
          if (!responseText) {
            console.log('DEBUG API: Empty response for Bulgarian text, providing fallback');
            responseText = "Извинете, но не успях да генерирам подходящо заглавие. Моля, опитайте с по-подробно описание на темата.";
          }
          
          // Simulate streaming by sending the full response at once
          onStreamUpdate(responseText);
          
          return {
            success: true,
            text: responseText,
            metadata: {
              finishReason: data.candidates?.[0]?.finishReason || null,
              safetyRatings: data.candidates?.[0]?.safetyRatings || null
            }
          };
        } catch (error) {
          console.error('Error with Bulgarian text request:', error);
          const fallbackText = "Извинявам се, възникна грешка. Моля, опитайте отново.";
          onStreamUpdate(fallbackText);
          return {
            error: true,
            text: fallbackText
          };
        }
      }
      
      // Continue with normal streaming for non-Bulgarian text
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorObj;
          try {
            errorObj = JSON.parse(errorText);
          } catch (e) {
            errorObj = { rawError: errorText };
          }
          
          console.error(`API streaming request failed with status ${response.status}:`, errorObj);
          return {
            error: true,
            status: response.status,
            text: `API request failed (${response.status}): ${JSON.stringify(errorObj)}`
          };
        }
        
        // For non-streaming response handling compatible with non-Latin characters
        // First try to parse with streaming disabled
        try {
          const data = await response.json();
          
          // Extract response from Gemini format
          let responseText = '';
          const metadata = {};
          
          if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              responseText = candidate.content.parts[0].text || '';
              
              // Print the actual response for debugging
              console.log('DEBUG API: Received text response:', responseText.substring(0, 100) + '...');
            }
            
            // Store metadata
            if (candidate.finishReason) {
              metadata.finishReason = candidate.finishReason;
            }
            if (candidate.safetyRatings) {
              metadata.safetyRatings = candidate.safetyRatings;
            }
          }
          
          // Handle Cyrillic and other non-Latin responses explicitly
          if (hasNonLatinChars && responseText) {
            console.log('DEBUG API: Processing non-Latin response with explicit encoding');
            responseText = decodeURIComponent(escape(responseText));
          }
          
          // Safety check for empty responses
          if (!responseText || responseText.trim() === '') {
            console.log('DEBUG API: Empty response from API, providing fallback');
            // For Bulgarian, provide a more appropriate Bulgarian fallback
            if (hasNonLatinChars && /[А-Яа-я]/.test(userPrompt)) {
              responseText = "Извинявам се, не успях да генерирам отговор. Моля, опитайте отново с повече детайли.";
            } else {
              responseText = "I'm sorry, I couldn't generate a response. Please try again with more details.";
            }
          }
          
          // Return the full text at once for typing effect in the UI
          console.log('DEBUG API: Returning complete text for typing effect, length:', responseText.length);
          onStreamUpdate(responseText);
          
          return {
            success: true,
            text: responseText,
            metadata: metadata
          };
        } catch (parsingError) {
          // If JSON parsing fails, fall back to basic text extraction
          console.error('DEBUG API: JSON parsing failed:', parsingError);
          
          // Read the response as text instead
          const fullResponseText = await response.text();
          console.log('DEBUG API: Attempting to extract from raw text response', fullResponseText.substring(0, 200) + '...');
          
          // Try to extract the relevant content using regex
          let extractedText = '';
          const textMatches = fullResponseText.match(/"text"\s*:\s*"([^"]+)"/g);
          
          if (textMatches && textMatches.length > 0) {
            for (const match of textMatches) {
              const content = match.replace(/"text"\s*:\s*"/, '').replace(/"$/, '');
              extractedText += content;
            }
            
            console.log('DEBUG API: Extracted content:', extractedText.substring(0, 100) + '...');
          }
          
          if (extractedText) {
            onStreamUpdate(extractedText);
            return {
              success: true,
              text: extractedText,
              metadata: {}
            };
          }
          
          // Default fallback if all extraction fails
          const fallbackText = hasNonLatinChars ? 
            "Извинявам се, възникна грешка. Моля, опитайте отново." : 
            "Sorry, there was an error processing your request. Please try again.";
          
          onStreamUpdate(fallbackText);
          return {
            error: true,
            text: fallbackText
          };
        }
      } catch (error) {
        console.error('Error with streaming request:', error);
        const fallbackText = hasNonLatinChars ? 
          "Извинявам се, възникна грешка. Моля, опитайте отново." : 
          "Sorry, there was an error processing your request. Please try again.";
        
        onStreamUpdate(fallbackText);
        return {
          error: true,
          text: fallbackText
        };
      }
    } else {
      // Non-streaming request
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API request failed with status ${response.status}:`, errorText);
          return {
            error: true,
            status: response.status,
            text: `API request failed (${response.status}): ${errorText}`
          };
        }
        
        const data = await response.json();
        
        // Extract response from Gemini 2.5 format
        let responseText = '';
        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            responseText = candidate.content.parts[0].text || '';
          }
        }
        
        if (!responseText) {
          console.log('DEBUG API: Empty response from API, providing fallback');
          responseText = "I'm sorry, I couldn't generate a response. Please try again with more details.";
        }
        
        return {
          success: true,
          text: responseText,
          metadata: {
            finishReason: data.candidates?.[0]?.finishReason || null,
            safetyRatings: data.candidates?.[0]?.safetyRatings || null
          }
        };
      } catch (error) {
        console.error('Error with non-streaming request:', error);
        return {
          error: true,
          text: `Error: ${error.message}`
        };
      }
    }
  } catch (error) {
    console.error('Error in callAIAPI:', error);
    return {
      error: true,
      text: `Error: ${error.message}`
    };
  }
};

/**
 * Generate a summary of the conversation using the AI
 * @param {Array} messages - The messages to summarize
 * @param {string} apiKey - The Gemini API key
 * @param {string} modelId - The model ID to use
 * @returns {Promise<string>} - The generated summary
 */
export const generateAISummary = async (messages, apiKey, modelId = 'gemini-2.5-flash-preview-04-17') => {
  if (!messages || messages.length === 0) {
    console.log('DEBUG: generateAISummary called with no messages, returning empty string');
    return '';
  }
  
  try {
    console.log(`DEBUG: Generating summary for ${messages.length} messages`);
    
    // Extract only the necessary content for summarization
    const conversationText = messages.map(msg => {
      const role = msg.role === 'user' ? 'USER' : 'AI';
      return `${role}: ${msg.content}`;
    }).join('\n\n');
    
    console.log('DEBUG: Extracted conversation text:', conversationText.substring(0, 100) + '...');
    
    const summaryPrompt = `Please summarize the following conversation between USER and AI in a concise paragraph. 
Focus on the main topics, questions, and information exchanged:

${conversationText}

SUMMARY:`;
    
    console.log('DEBUG: Calling AI API for summary generation');
    const response = await callAIAPI(
      summaryPrompt,
      apiKey,
      modelId,
      [], // No conversation history needed for summarization
      null, // No summary needed for this call
      null // No system prompt needed for this call
    );
    
    if (response.error) {
      console.error('DEBUG: Error generating summary:', response.text);
      // Return a basic summary if AI fails
      return `Conversation about ${messages[0].content.substring(0, 50)}...`;
    }
    
    console.log('DEBUG: Successfully generated summary:', response.text.substring(0, 100) + '...');
    return response.text;
  } catch (error) {
    console.error('DEBUG: Exception in generateAISummary:', error);
    // Return a simple fallback summary
    return `Conversation with ${messages.length} messages`;
  }
};