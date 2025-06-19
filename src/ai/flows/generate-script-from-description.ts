'use server';

/**
 * @fileOverview A PowerShell script generator AI agent.
 *
 * - generateScriptFromDescription - A function that handles the script generation process.
 * - GenerateScriptInput - The input type for the generateScriptFromDescription function.
 * - GenerateScriptOutput - The return type for the generateScriptFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the PowerShell script to generate.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('The generated PowerShell script.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScriptFromDescription(
  input: GenerateScriptInput
): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are an expert PowerShell script writer.

You will generate a PowerShell script based on the following description:

Description: {{{description}}}

Ensure the script is well-formatted and easy to read.
`,
});

const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
