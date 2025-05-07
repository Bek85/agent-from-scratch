import type { OpenAI } from 'openai'
import { generateImage } from './tools/generateImage'
import { reddit } from './tools/reddit'
import { dadJoke } from './tools/dadJoke'

const getWeather = () => `The weather is sunny`

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case 'get_weather':
      return getWeather(input)
    case 'generate_image':
      return generateImage(input)
    case 'reddit':
      return reddit(input)
    case 'dad_joke':
      return dadJoke(input)
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
