const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');

router.post('/resume/generate', resumeController.generateResumeResponse);
router.post('/resume/save', resumeController.saveResume);
router.get('/resume/user/:userEmail', resumeController.getResumesByUserEmail);
router.get('/resume/:id', resumeController.getResumeById);
router.delete('/resume/:id', resumeController.deleteResume);
router.post('/interview/questions/skills', resumeController.getInterviewQuestionsBySkills);
router.get('/interview/questions', resumeController.getInterviewQuestions);

module.exports = router;
