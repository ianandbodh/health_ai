const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VoiceNote = sequelize.define('VoiceNote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  screeningId: {
    type: DataTypes.UUID,
    references: {
      model: 'SymptomScreenings',
      key: 'id',
    },
  },
  audioFileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  audioFilePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in seconds',
  },
  fileSize: {
    type: DataTypes.INTEGER,
  },
  transcription: {
    type: DataTypes.TEXT,
    comment: 'Auto-transcribed text from voice',
  },
  transcriptionStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  transcriptionAccuracy: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Confidence score of transcription',
  },
  language: {
    type: DataTypes.ENUM('english', 'hindi'),
    defaultValue: 'english',
  },
  category: {
    type: DataTypes.ENUM(
      'consultation_notes',
      'diagnosis',
      'treatment_plan',
      'follow_up',
      'patient_conversation',
      'other'
    ),
    defaultValue: 'consultation_notes',
  },
  tags: {
    type: DataTypes.JSON,
    comment: 'Searchable tags extracted from content',
  },
  isProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  aiSummary: {
    type: DataTypes.TEXT,
    comment: 'AI-generated summary of the voice note',
  },
  keyPoints: {
    type: DataTypes.JSON,
    comment: 'Important points extracted by AI',
  },
  actionItems: {
    type: DataTypes.JSON,
    comment: 'Action items identified from the conversation',
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative', 'urgent'),
  },
  isConfidential: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sharedWith: {
    type: DataTypes.JSON,
    comment: 'Users who have access to this voice note',
  },
});

module.exports = VoiceNote;