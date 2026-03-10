import React from "react";
import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(undefined);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const URL = import.meta.env.VITE_GEMINI_URL;

  const askQuestion = async () => {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: question,
            },
          ],
        },
      ],
    };

    try {
      let response = await fetch(`${URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log(data);

      if (data.candidates) {
        console.log(data.candidates[0].content.parts[0].text);
        setResult(data.candidates[0].content.parts[0].text);
      } else {
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800 "></div>

      <div className="col-span-4 bg-zinc-900 p-10">
        <div className="container h-180"></div>
        <div className="text-white h-10 overflow-scroll">{result}</div>
        <div className="bg-zinc-800 w-1/2 p-2 pr-5 text-white m-auto rounded-4xl border-zinc-700 border flex h-15">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            className="w-full h-full p-3 outline-none"
            placeholder="Ask me anything"
          ></input>
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  );
}
