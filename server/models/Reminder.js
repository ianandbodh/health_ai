const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reminder = sequelize.define('Reminder', {
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
  prescriptionId: {
    type: DataTypes.UUID,
    references: {
      model: 'Prescriptions',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM(
      'medication',
      'follow_up_appointment',
      'lab_test',
      'symptom_check',
      'prescription_refill',
      'vaccination',
      'lifestyle_change',
      'other'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  scheduledTime: {
    type: DataTypes.TIME,
  },
  frequency: {
    type: DataTypes.ENUM('once', 'daily', 'weekly', 'monthly', 'custom'),
    defaultValue: 'once',
  },
  customFrequency: {
    type: DataTypes.JSON,
    comment: 'Custom frequency pattern for complex schedules',
  },
  endDate: {
    type: DataTypes.DATE,
    comment: 'When to stop recurring reminders',
  },
  deliveryMethod: {
    type: DataTypes.JSON,
    defaultValue: ['sms'],
    comment: 'Array of delivery methods: sms, whatsapp, email, push',
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed', 'cancelled'),
    defaultValue: 'active',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  medicationDetails: {
    type: DataTypes.JSON,
    comment: 'Medication name, dosage, timing for medication reminders',
  },
  appointmentDetails: {
    type: DataTypes.JSON,
    comment: 'Doctor name, clinic, address for appointment reminders',
  },
  testDetails: {
    type: DataTypes.JSON,
    comment: 'Test name, lab, fasting requirements for test reminders',
  },
  lastSentAt: {
    type: DataTypes.DATE,
  },
  nextSendAt: {
    type: DataTypes.DATE,
  },
  sentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxSendCount: {
    type: DataTypes.INTEGER,
    comment: 'Maximum number of times to send this reminder',
  },
  deliveryStatus: {
    type: DataTypes.JSON,
    comment: 'Track delivery status for each method',
  },
  responseReceived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  patientResponse: {
    type: DataTypes.TEXT,
    comment: 'Patient response to the reminder',
  },
  snoozeUntil: {
    type: DataTypes.DATE,
    comment: 'Temporary pause until this date/time',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'Asia/Kolkata',
  },
  language: {
    type: DataTypes.ENUM('english', 'hindi'),
    defaultValue: 'english',
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  escalationRules: {
    type: DataTypes.JSON,
    comment: 'Rules for escalating if patient doesn\'t respond',
  },
});

module.exports = Reminder;