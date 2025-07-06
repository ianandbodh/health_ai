const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalFile = sequelize.define('MedicalFile', {
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
  screeningId: {
    type: DataTypes.UUID,
    references: {
      model: 'SymptomScreenings',
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
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.ENUM('image', 'pdf', 'document'),
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'lab_report',
      'prescription',
      'xray',
      'mri',
      'ct_scan',
      'ultrasound',
      'blood_test',
      'medical_history',
      'insurance',
      'other'
    ),
    allowNull: false,
    defaultValue: 'other',
  },
  description: {
    type: DataTypes.TEXT,
  },
  uploadedBy: {
    type: DataTypes.ENUM('patient', 'doctor'),
    allowNull: false,
  },
  isProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  extractedText: {
    type: DataTypes.TEXT,
    comment: 'OCR extracted text from images/PDFs',
  },
  aiAnalysis: {
    type: DataTypes.JSON,
    comment: 'AI analysis of the medical file content',
  },
  tags: {
    type: DataTypes.JSON,
    comment: 'Searchable tags for the file',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    comment: 'For prescriptions or temporary documents',
  },
  encryptionKey: {
    type: DataTypes.STRING,
    comment: 'Key for file encryption',
  },
  checksum: {
    type: DataTypes.STRING,
    comment: 'File integrity verification',
  },
});

module.exports = MedicalFile;