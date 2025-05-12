import type { OpenAI } from 'openai'
import {
  generateImage,
  generateImageToolDefinition,
} from './tools/generateImage'
import { reddit, redditToolDefinition } from './tools/reddit'
import { dadJoke, dadJokeToolDefinition } from './tools/dadJoke'

// const getWeather = () => `The weather is sunny`

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    // case 'get_weather':
    //   return getWeather(input)
    case generateImageToolDefinition.name:
      return generateImage(input)
    case redditToolDefinition.name:
      return reddit(input)
    case dadJokeToolDefinition.name:
      return dadJoke(input)
    default:
      return `Never run this tool: ${toolCall.function.name} again, or else!`
  }
}
