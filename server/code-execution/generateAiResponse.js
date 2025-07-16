const { GoogleGenAI } =  require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const generateAiResponse = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze below code and provide the Time Complexity and Space Complexity of the code. No explaination needed.
        Here is the code:
        ${code}
        `,
    });
    return response.text;
};

module.exports = generateAiResponse;