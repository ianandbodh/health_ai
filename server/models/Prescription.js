const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
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
  prescriptionNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  medications: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of medications with dosage, frequency, duration',
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  symptoms: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
    comment: 'Special instructions for the patient',
  },
  followUpDate: {
    type: DataTypes.DATE,
  },
  followUpInstructions: {
    type: DataTypes.TEXT,
  },
  aiGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  aiDraft: {
    type: DataTypes.JSON,
    comment: 'Original AI-generated prescription draft',
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'dispensed', 'cancelled'),
    defaultValue: 'draft',
  },
  doctorNotes: {
    type: DataTypes.TEXT,
    comment: 'Additional notes from the doctor',
  },
  modifications: {
    type: DataTypes.JSON,
    comment: 'Track changes made to AI suggestions',
  },
  issuedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  validUntil: {
    type: DataTypes.DATE,
  },
  dosageForm: {
    type: DataTypes.ENUM('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'other'),
  },
  allergiesConsidered: {
    type: DataTypes.JSON,
    comment: 'Patient allergies taken into account',
  },
  drugInteractions: {
    type: DataTypes.JSON,
    comment: 'Potential drug interactions checked',
  },
  labTestsRequired: {
    type: DataTypes.JSON,
    comment: 'Lab tests recommended before/during medication',
  },
  sideEffectsWarnings: {
    type: DataTypes.TEXT,
  },
  pharmacyInstructions: {
    type: DataTypes.TEXT,
  },
  refillsAllowed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  refillsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  digitalSignature: {
    type: DataTypes.TEXT,
    comment: 'Doctor digital signature',
  },
  qrCode: {
    type: DataTypes.STRING,
    comment: 'QR code for verification',
  },
});

module.exports = Prescription;