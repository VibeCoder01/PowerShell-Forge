'use server';

/**
 * @fileOverview AI-powered PowerShell script suggestions.
 *
 * - suggestScript - A function that provides AI-powered suggestions for PowerShell scripts.
 * - SuggestScriptInput - The input type for the suggestScript function.
 * - SuggestScriptOutput - The return type for the suggestScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScriptInputSchema = z.object({
  context: z
    .string()
    .describe(
      'The current context of the script, including existing code and user input.'
    ),
  objective: z.string().describe('The objective of the PowerShell script.'),
});

export type SuggestScriptInput = z.infer<typeof SuggestScriptInputSchema>;

const SuggestScriptOutputSchema = z.object({
  suggestion: z.string().describe('The AI-powered suggestion for the script.'),
});

export type SuggestScriptOutput = z.infer<typeof SuggestScriptOutputSchema>;

export async function suggestScript(input: SuggestScriptInput): Promise<SuggestScriptOutput> {
  return suggestScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestScriptPrompt',
  input: {schema: SuggestScriptInputSchema},
  output: {schema: SuggestScriptOutputSchema},
  prompt: `You are an AI assistant that suggests PowerShell scripts based on the given context and objective.

  Context: {{{context}}}
  Objective: {{{objective}}}

  Suggestion:`,
});

const suggestScriptFlow = ai.defineFlow(
  {
    name: 'suggestScriptFlow',
    inputSchema: SuggestScriptInputSchema,
    outputSchema: SuggestScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
