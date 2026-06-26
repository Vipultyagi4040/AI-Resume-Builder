const axios = require('axios');
const { generateToken } = require('../utils/generateToken');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  ensureApiKey() {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
  }

  async chatCompletion(prompt, temperature = 0.7, maxTokens = 2048) {
    this.ensureApiKey();

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const choices = response.data?.choices;
      if (!choices || choices.length === 0) {
        throw new Error('Groq API returned no choices');
      }

      const content = choices[0]?.message?.content;
      if (!content) {
        throw new Error('Groq API returned no content');
      }

      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Groq API failed:', error.message);
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again after some time.');
      }
      throw new Error(`Groq generation failed: ${error.message}`);
    }
  }

  generateResume(userDescription) {
    const prompt = `You are a professional resume writer. Create a detailed resume from the following user description.
Return ONLY valid JSON. No markdown. No explanation.

{
  "meta": "Resume generated",
  "data": {
    "personalInformation": {
      "fullName": "Name",
      "email": "email@example.com",
      "phoneNumber": "Phone",
      "location": "City, Country",
      "linkedIn": null,
      "gitHub": null,
      "portfolio": null
    },
    "summary": "Professional summary",
    "skills": [{"title": "Skill", "level": "Beginner/Intermediate/Expert"}],
    "experience": [],
    "education": [],
    "projects": [],
    "certifications": [],
    "languages": [],
    "interests": [],
    "achievements": []
  }
}

User Description: ${userDescription}`;

    return this.chatCompletion(prompt, 0.7, 2048);
  }

  generateInterviewQuestions(skills) {
    const safeSkills = Array.isArray(skills) ? skills.filter((s) => typeof s === 'string' && s.trim()) : [];
    const skillsText = safeSkills.length ? safeSkills.join(', ') : 'general software engineering';

    const prompt = `You are an expert technical interview coach.
Generate interview questions and strong sample answers tailored to these skills: ${skillsText}.

Return ONLY valid JSON in this exact shape:
{
  "meta": "Interview prep generated",
  "questions": [
    {
      "question": "...",
      "answer": "...",
      "category": "technical|behavioral|problem-solving"
    }
  ]
}

Requirements:
- Return 10 questions.
- Balance technical and behavioral questions.
- Keep answers practical, concise, and interview-ready.
- No markdown. No extra text.`;

    return this.chatCompletion(prompt, 0.6, 2200);
  }
}

module.exports = new GroqService();
