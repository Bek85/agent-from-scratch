import type { ToolFn } from '../../types'
import { openai } from '../ai'
import { z } from 'zod'

export const generateImageToolDefinition = {
  name: 'generate_image',
  parameters: z.object({
    prompt: z.string(),
  }),
  description:
    'Use this tool to generate an image based on a prompt. The image will be generated using a diffusion model image generator like Dall-E.',
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: toolArgs.prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageUrl = response.data[0].url!

  return imageUrl
}
