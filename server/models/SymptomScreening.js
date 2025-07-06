const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SymptomScreening = sequelize.define('SymptomScreening', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  doctorId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  symptoms: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of symptoms with severity and duration',
  },
  primaryComplaint: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    comment: 'How long symptoms have been present',
  },
  severity: {
    type: DataTypes.ENUM('mild', 'moderate', 'severe', 'critical'),
    allowNull: false,
    defaultValue: 'mild',
  },
  priorityLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'low',
  },
  medicalHistory: {
    type: DataTypes.JSON,
    comment: 'Previous medical conditions, allergies, medications',
  },
  vitalSigns: {
    type: DataTypes.JSON,
    comment: 'Temperature, blood pressure, heart rate, etc.',
  },
  painScale: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 10,
    },
  },
  additionalNotes: {
    type: DataTypes.TEXT,
  },
  aiAnalysis: {
    type: DataTypes.JSON,
    comment: 'AI-generated analysis and recommendations',
  },
  aiSummary: {
    type: DataTypes.TEXT,
    comment: 'Human-readable summary for doctors',
  },
  possibleDiagnoses: {
    type: DataTypes.JSON,
    comment: 'AI-suggested possible diagnoses with confidence scores',
  },
  recommendedTests: {
    type: DataTypes.JSON,
    comment: 'AI-recommended laboratory tests or examinations',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_review', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  screeningLanguage: {
    type: DataTypes.ENUM('english', 'hindi'),
    defaultValue: 'english',
  },
  isVoiceInput: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  voiceTranscription: {
    type: DataTypes.TEXT,
  },
  consentGiven: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  urgencyFlags: {
    type: DataTypes.JSON,
    comment: 'Red flags that require immediate attention',
  },
  timeToSee: {
    type: DataTypes.DATE,
    comment: 'When patient should be seen based on symptoms',
  },
});

module.exports = SymptomScreening;