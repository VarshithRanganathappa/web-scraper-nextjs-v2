import { useState } from "react";
import { axiosPost } from './api/helperFunctions';

function gpt3Model() {
  const [response, setResponse] = useState("");
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPost("/api/generate-text", { promptText });
      setResponse(data.generatedText);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setPromptText(event.target.value);
  };

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>OpenAI GPT-3 Chatbot</h1>
      <input
        type="text"
        value={promptText}
        onChange={handleInputChange}
        style={{ width: "50%", height: "100px", fontSize: "20px", padding: "10px", border:"2px solid black" }}
      />
      <br />
      <button onClick={handleClick} style={{ margin: "20px", fontSize: "20px", padding: "10px", border: "1px solid lightgray", borderRadius: "5px" }}>
        Send
      </button>
  
      <br />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ border: "1px solid black", padding: "10px", fontSize: "20px" }}>{typeof response === 'string' && response.startsWith("Error:") ? <div style={{ color: "red" }}>{response}</div> : response}</div>
      )}
    </div>
  );  
}

export default gpt3Model;
