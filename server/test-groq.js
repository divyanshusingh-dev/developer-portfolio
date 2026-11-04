require("dotenv").config();

const OpenAI = require("openai");

async function testGroq() {
    console.log("API Key Loaded:", !!process.env.GROQ_API_KEY);
    console.log("Model:", process.env.GROQ_MODEL);

    if (!process.env.GROQ_API_KEY) {
        console.log("ERROR: GROQ_API_KEY missing in server/.env");
        return;
    }

    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
        timeout: 30000
    });

    try {
        const response = await client.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Say hello" }
            ]
        });

        console.log("SUCCESS:", response.choices[0].message.content);
    } catch (error) {
        console.log("GROQ ERROR:", error.message);
        console.log("STATUS:", error.status);
        console.log("CODE:", error.code);
        console.log("TYPE:", error.type);
    }
}

testGroq();
