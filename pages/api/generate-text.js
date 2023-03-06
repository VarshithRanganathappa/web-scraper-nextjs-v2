import { axiosPost } from './helperFunctions';
import { OPENAI_API_KEY, MODEL_NAME } from '../../config';

export default async function handler(req, res) {
  console.log('promptText',req.body );
  if (req.method === "POST") {
    try {
      const { promptText } = req.body;
      
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
  
      const generatedText = response.data.choices[0].text;
  
      res.status(200).json({ generatedText });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
