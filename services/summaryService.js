// services/summaryService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Helper to obtain an authenticated Google Generative AI client instance.
 * Checks for GEMINI_API_KEY or GOOGLE_API_KEY in environment variables.
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    const error = new Error(
      'Gemini API key is missing or not configured. Please set GEMINI_API_KEY in your backend .env file.'
    );
    error.status = 500;
    error.statusCode = 500;
    throw error;
  }

  return new GoogleGenerativeAI(apiKey.trim());
};

/**
 * Generate a 3 to 5 sentence summary of the provided blog post content using Google Gemini API (Free Tier).
 * Automatically tries available models (with fallbacks if a specific model is busy or deprecated).
 * 
 * @param {string} content - Markdown or plain text content of the post
 * @returns {Promise<string>} - Generated 3-5 sentence summary
 */
const generateSummary = async (content) => {
  if (!content || typeof content !== 'string' || !content.trim()) {
    const error = new Error('Post content is required to generate a summary.');
    error.status = 400;
    error.statusCode = 400;
    throw error;
  }

  const genAI = getGeminiClient();

  // Primary model and fallback candidates in order of speed and availability
  const modelsToTry = [
    process.env.GEMINI_MODEL,
    'gemini-flash-lite-latest',
    'gemini-pro-latest',
    'gemini-flash-latest',
  ].filter(Boolean);

  const systemInstruction =
    'You are an expert AI editor and blog summarizer. Generate a clear, engaging, and accurate summary of the provided blog post in exactly 3 to 5 sentences. The summary must be a single cohesive paragraph without bullet points, markdown headings, or numbering.';

  const prompt = `Please provide a 3 to 5 sentence summary for the following blog post content:\n\n${content.trim()}`;

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text()?.trim();

      if (summary) {
        return summary;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed (${err.status || err.message}). Trying next fallback...`);

      // If it's an invalid API key, don't keep retrying other models
      const msg = err.message || '';
      if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID') || err.status === 401) {
        break;
      }
    }
  }

  // Handle final error if all candidates failed
  console.error('All Gemini models failed. Last error:', lastError?.message || lastError);

  const errorMessage = lastError?.message || '';
  if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID') || lastError?.status === 401) {
    const authErr = new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in the backend .env file.');
    authErr.status = 401;
    authErr.statusCode = 401;
    throw authErr;
  }

  if (lastError?.status === 429 || errorMessage.includes('RESOURCE_EXHAUSTED')) {
    const quotaErr = new Error('Gemini rate limit exceeded. Please wait a moment and try again.');
    quotaErr.status = 429;
    quotaErr.statusCode = 429;
    throw quotaErr;
  }

  const generalErr = new Error(
    lastError?.message || 'Gemini API was unable to generate a summary. Please try again shortly.'
  );
  generalErr.status = lastError?.status || 500;
  generalErr.statusCode = lastError?.statusCode || 500;
  throw generalErr;
};

// Allow both summaryService(content) and summaryService.generateSummary(content)
generateSummary.generateSummary = generateSummary;
generateSummary.getGeminiClient = getGeminiClient;

module.exports = generateSummary;
module.exports.generateSummary = generateSummary;
module.exports.getGeminiClient = getGeminiClient;
