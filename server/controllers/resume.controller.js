const Resume = require('../models/Resume');
const groqService = require('../services/groq.service');

exports.generateResumeResponse = async (req, res) => {
  try {
    const { userDescription } = req.body;
    if (!userDescription) {
      return res.status(400).json({ message: 'userDescription is required' });
    }
    const response = await groqService.generateResume(userDescription);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.saveResume = async (req, res) => {
  try {
    const b = req.body || {};
    const mapped = {
      user_email: (b.userEmail || '').toString().toLowerCase().trim() || null,
      job_description: b.jobDescription || null,
      full_name: b.fullName || null,
      email: b.email || null,
      phone: b.phone || null,
      location: b.location || null,
      summary: b.summary || null,
      skill1: b.skill1 || null,
      skill2: b.skill2 || null,
      skill3: b.skill3 || null,
      skill4: b.skill4 || null,
      skill5: b.skill5 || null,
      skill6: b.skill6 || null,
      skill7: b.skill7 || null,
      skill8: b.skill8 || null,
      skill9: b.skill9 || null,
      skill10: b.skill10 || null,
      company1: b.company1 || null,
      position1: b.position1 || null,
      duration1: b.duration1 || null,
      company2: b.company2 || null,
      position2: b.position2 || null,
      duration2: b.duration2 || null,
      degree1: b.degree1 || null,
      university1: b.university1 || null,
      graduation_year1: b.graduationYear1 || null,
      project1: b.project1 || null,
      project2: b.project2 || null,
      cover_letter: b.coverLetter || null,
    };
    const saved = await Resume.create(mapped);
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getResumesByUserEmail = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const resumes = await Resume.findByUserEmail(userEmail);
    return res.status(200).json(resumes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resume.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getInterviewQuestionsBySkills = async (req, res) => {
  try {
    const skills = Array.isArray(req.body?.skills) ? req.body.skills : [];
    const response = await groqService.generateInterviewQuestions(skills);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Failed to generate skill-based interview questions', error);
    return res.status(200).json({
      meta: 'Fallback interview prep generated',
      skills: Array.isArray(req.body?.skills) ? req.body.skills : [],
      questions: [
        {
          question: 'Walk me through your background and highlight experience with software engineering.',
          answer: 'I have built production-focused projects and consistently improved performance, maintainability, and delivery quality. My strongest contributions are in problem solving, communication, and ownership.',
          category: 'behavioral',
        },
        {
          question: 'How have you applied software engineering in a real project?',
          answer: 'I start by defining clear requirements, break work into milestones, and validate outcomes with metrics. I emphasize clean implementation, testing, and stakeholder communication throughout the project lifecycle.',
          category: 'technical',
        },
        {
          question: 'Describe a challenging issue you solved and your approach.',
          answer: 'I reproduced the issue, collected logs and signals, isolated root cause, and shipped an incremental fix. Then I added monitoring and documentation to prevent recurrence.',
          category: 'problem-solving',
        },
      ],
      total: 3,
    });
  }
};

exports.getInterviewQuestions = async (req, res) => {
  return res.status(200).json({
    meta: 'Fallback interview prep generated',
    skills: [],
    questions: [
      {
        question: 'Walk me through your background and highlight experience with software engineering.',
        answer: 'I have built production-focused projects and consistently improved performance, maintainability, and delivery quality. My strongest contributions are in problem solving, communication, and ownership.',
        category: 'behavioral',
      },
      {
        question: 'How have you applied software engineering in a real project?',
        answer: 'I start by defining clear requirements, break work into milestones, and validate outcomes with metrics. I emphasize clean implementation, testing, and stakeholder communication throughout the project lifecycle.',
        category: 'technical',
      },
      {
        question: 'Describe a challenging issue you solved and your approach.',
        answer: 'I reproduced the issue, collected logs and signals, isolated root cause, and shipped an incremental fix. Then I added monitoring and documentation to prevent recurrence.',
        category: 'problem-solving',
      },
    ],
    total: 3,
  });
};
