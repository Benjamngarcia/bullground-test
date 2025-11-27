import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { config } from '../config/env';
import { getSystemMessage } from '../config/llmPrompt';
import { ApiError, UserContext } from '../types/domain';

interface GenerateReplyParams {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  userContext?: UserContext;
}

interface GenerateReplyResponse {
  content: string;
}

export class LlmService {
  private genAI: GoogleGenerativeAI;
  private modelId: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.modelId = config.gemini.modelId;
  }

  /**
   * Generates a reply from the LLM based on the conversation history.
   *
   * Trade-off: We're using a sliding window of recent messages to manage context size.
   * This means very long conversations may lose early context, but it prevents token limit issues.
   */
  async generateReply(params: GenerateReplyParams): Promise<GenerateReplyResponse> {
    const { messages, userContext } = params;

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelId });

      const systemMessage = getSystemMessage(userContext);
      const contents = this.buildGeminiContents(messages, systemMessage);

      const result = await model.generateContent({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new ApiError(500, 'Empty response from LLM', 'LLM_EMPTY_RESPONSE');
      }

      return { content: text };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred with Gemini API';
      throw new ApiError(500, `LLM service error: ${errorMessage}`, 'LLM_ERROR');
    }
  }

  /**
   * Builds the contents array for Gemini API.
   * Gemini uses a different format than OpenAI (Content[] instead of messages[]).
   */
  private buildGeminiContents(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemMessage: string
  ): Content[] {
    const contents: Content[] = [];

    contents.push({
      role: 'user',
      parts: [{ text: systemMessage }],
    });

    contents.push({
      role: 'model',
      parts: [{ text: 'Understood. I will act as a professional financial advisor as described.' }],
    });

    for (const message of messages) {
      if (message.role === 'system') {
        continue;
      }

      const role = message.role === 'assistant' ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text: message.content }],
      });
    }

    return contents;
  }

  /**
   * Placeholder for streaming functionality.
   *
   * Design note: Streaming could be implemented using Gemini's streamGenerateContent method.
   * The implementation would return an async generator that yields chunks of text.
   * This would require changes to the endpoint to support SSE or WebSocket.
   */
}

export const llmService = new LlmService();
