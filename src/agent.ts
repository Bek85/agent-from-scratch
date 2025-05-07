import { addMessages, getMessages } from './memory'
import { runLLM } from './llm'
import { showLoader, logMessage } from './ui'
import { runTool } from './toolRunner'
import { saveToolResponse } from './memory'

export const runAgent = async ({
  userMessage, // the user message
  tools, // the tools to use
}: {
  userMessage: string // the user message
  tools: any[] // the tools to use
}) => {
  // Save the user message to the database
  await addMessages([{ role: 'user', content: userMessage }])

  // Show the loader
  const loader = showLoader('🤔🤔🤔 Thinking...')

  // loop until the response has no tool calls
  while (true) {
    // get the history of messages
    const history = await getMessages()

    // run the LLM with the history and tools
    const response = await runLLM({ messages: history, tools })

    // Save the response to the database
    await addMessages([response])

    // if the response has content, stop the loader and return the history
    if (response.content) {
      loader.stop()
      logMessage(response)
      return getMessages()
    }

    // if the response has tool calls, run the tool and save the response
    if (response.tool_calls) {
      // get the first tool call
      const toolCall = response.tool_calls[0]
      logMessage(response)

      // show the loader
      loader.update(`🔍 Executing: ${toolCall.function.name}`)

      // run the tool with the tool call and user message
      const toolResponse = await runTool(toolCall, userMessage)

      // save the tool response to the database
      await saveToolResponse(toolCall.id, toolResponse)

      // show the loader
      loader.update(`✅ Done: ${toolCall.function.name}`)
    }

    // log the response
    // logMessage(response)

    // stop the loader
    // loader.stop()

    // return the history
    // return getMessages()
  }
}
