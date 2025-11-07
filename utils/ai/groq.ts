type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

interface ChatMessage {
  role: ChatRole;
  content: string;
  name?: string;
}

interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

type ToolChoice =
  | 'auto'
  | 'none'
  | {
      type: 'function';
      function: {
        name: string;
      };
    };

interface GenerateCompletionArgs {
  chat: ChatMessage[];
  maxTokens?: number;
  onComplete?: (data: GroqChatCompletionResponse) => void;
  responseFormatType?: Record<string, unknown>;
  model?: string;
  toolParams?: {
    toolsChoice?: ToolChoice;
    tools: ToolDefinition[];
  };
}

interface GroqChatCompletionResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string | null;
    message: {
      role: ChatRole;
      content: string | null;
      reasoning_content?: string;
    };
  }>;
}

type CompletionResult = string | (GroqChatCompletionResponse['choices'][number]['message'] & { reasoning_content?: string });

/**
 * Generate a completion using Groq API
 */
export async function generateCompletion(args: GenerateCompletionArgs): Promise<CompletionResult> {
  const {
    chat,
    maxTokens = 200,
    onComplete,
    responseFormatType,
    model = 'moonshotai/kimi-k2-instruct-0905',
    toolParams
  } = args;

  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error('Groq API key is not configured');
  }

  const isReasoningModel = model.includes('o3') || model.includes('o1') || model.includes('reasoning');

  const body: Record<string, unknown> = {
    model,
    messages: chat,
    response_format: responseFormatType ?? { type: 'text' }
  };

  if (toolParams?.tools?.length) {
    body.tools = toolParams.tools;
  }

  if (toolParams?.toolsChoice) {
    body.tool_choice = toolParams.toolsChoice;
  }

  if (isReasoningModel) {
    body.max_completion_tokens = maxTokens;
  } else {
    body.max_tokens = maxTokens;
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const completion = (await response.json()) as GroqChatCompletionResponse;

  onComplete?.(completion);

  const messageContent = completion.choices[0]?.message?.content;

  if (!messageContent) {
    console.error('Unexpected Groq response:', JSON.stringify(completion));
    throw new Error('No completion content found in the response');
  }

  return completion.choices[0].message.reasoning_content
    ? completion.choices[0].message
    : messageContent;
}
