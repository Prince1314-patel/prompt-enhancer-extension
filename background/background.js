// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enhance') {
    chrome.storage.sync.get(['groqApiKey'], async (result) => {
      const apiKey = result.groqApiKey;
      if (!apiKey) {
        sendResponse({ enhancedPrompt: '', error: 'API key not set. Please set it in the options.' });
        return;
      }
      
      // Add a small delay to make the loading animation more realistic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Prepare the prompt for enhancement type
        let systemPrompt = `You are a Prompt Engineering Assistant. Your goal is to enhance the user's provided prompt by applying prompt engineering best practices. Your response must ONLY be the enhanced prompt. Do NOT answer the user's prompt or provide any additional information beyond the enhanced prompt.

When enhancing the prompt, consider the following key principles:
- Clarity and Specificity: Use action-oriented verbs (e.g., "summarize," "list," "analyze"), avoid ambiguous phrases like "help me" or "tell me about," and state exactly what is wanted, including details like scope or focus.
- Role Assignment: Begin with "You are a [role]," such as "You are a teacher" or "You are a data analyst." Choose a role that aligns with the task to shape the response.
- Context and Background: Include necessary details, data, or scenarios (e.g., documents, guidelines, or examples). Summarize long inputs with a preface like "Here's the background you need..."
- Output Format: Request a specific structure, such as "in bullet points," "as a table," or "in JSON." Define length or constraints if needed (e.g., "in 50 words or less").
- Tone and Style: Specify the tone (e.g., "professional," "friendly," "concise"). Match the style to the task or recipient.
- Reasoning and Structure: For complex tasks, add phrases like "Think step by step" or "Explain your reasoning." For multi-step tasks, split them into smaller prompts or request a structured process.
- Template Integration: If the user has selected a template, enhance it by filling in the placeholders with specific, actionable content while maintaining the structured format.
NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.

`;

        // Add template-specific instructions if a template is selected
        if (message.template) {
          systemPrompt += `
IMPORTANT: The user has selected a template (${message.template}). Your task is to enhance this template by:
1. Filling in the placeholder brackets [PLACEHOLDER] with specific, actionable content
2. Maintaining the structured format and professional tone
3. Adding specific details, examples, and context where appropriate
4. Making the prompt more specific and actionable while keeping the original structure
5. Ensuring the enhanced prompt is ready for immediate use with AI models

Enhance the template while preserving its professional structure and making it more specific and actionable.`;
        }

        switch (message.type) {
          case 'clarity':
            systemPrompt += `
For this request, prioritize **Clarity and Specificity**. Make the prompt clearer and easier to understand, focusing on using action-oriented verbs and avoiding ambiguity.
NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.`;
            break;
          case 'context':
            systemPrompt += `
For this request, prioritize **Context and Background**. Expand the context of the prompt by adding relevant details or rephrasing for better understanding.
NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.`;
            break;
          case 'professional':
            systemPrompt += `
For this request, prioritize **Tone and Style** for a professional output. Reformat the prompt into a professional tone.NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.
`;
            break;
          case 'creative':
            systemPrompt += `
For this request, prioritize **Tone and Style** for a creative output. Make the prompt more creative and engaging by rephrasing or adding imaginative elements.
NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.`;
            break;
          default:
            // If no specific type, apply all generally or default to a comprehensive enhancement
            systemPrompt += `
For this request, apply all the prompt engineering principles comprehensively to enhance the prompt for optimal AI performance. Focus on providing a suitable persona if none is implied by the original prompt.
NOTE:- Do not try to answer the user's prompt or provide any additional information beyond the enhanced prompt.Also if the user's prompt include asking for a example code snippet than do not provide any code snippet.Just enhance the prompt.`;
        }

        const body = {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message.prompt }
          ]
        };
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          sendResponse({ enhancedPrompt: '', error: errorData.error?.message || 'API error.' });
          return;
        }
        const data = await response.json();
        const enhancedPrompt = data.choices?.[0]?.message?.content || '';
        sendResponse({ enhancedPrompt });
      } catch (err) {
        sendResponse({ enhancedPrompt: '', error: 'Network or server error.' });
      }
    });
    return true; // Indicates async response
  }
}); 