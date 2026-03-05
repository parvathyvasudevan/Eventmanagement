const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini
const ai = new GoogleGenAI({}); // Automatically uses GEMINI_API_KEY from process.env

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch up-to-date events from the database
    // We only select the fields that the AI might need to answer questions to save tokens
    const events = await Event.find({}, 'title description startDate endDate city location category pricePerTicket availableTickets');

    // Create a prompt context containing the events data
    const systemInstruction = `
You are a helpful and friendly chatbot for an Event Management application specifically for events in Kerala.
Your name is EventBot. 
Answer the user's questions based ONLY on the current events data provided below. 
If a user asks a general question, greet them and tell them about the events.
If the answer is not in the events data, politely inform them that you do not have information about that particular query.
Keep your responses concise and formatted nicely in short paragraphs or bullet points.

CURRENT EVENTS DATA:
${JSON.stringify(events, null, 2)}
`;

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: "Understood. I will answer based only on the provided event data." }] },
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

module.exports = router;
