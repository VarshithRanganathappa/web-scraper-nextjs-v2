import { axiosPost } from '../pages/api/helperFunctions';
import { OPENAI_API_KEY, MODEL_NAME } from './constants'

export async function generateText(promptText) {
  try { 

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const data = {
      model: MODEL_NAME,
      prompt: promptText,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    const response = await axiosPost(
      "https://api.openai.com/v1/completions",
      data,
      config
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
