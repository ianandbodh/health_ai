const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Doctor = require('./Doctor');
const SymptomScreening = require('./SymptomScreening');
const MedicalFile = require('./MedicalFile');
const Prescription = require('./Prescription');
const VoiceNote = require('./VoiceNote');
const Reminder = require('./Reminder');

// Define associations
// User associations
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
User.hasMany(SymptomScreening, { foreignKey: 'patientId', as: 'patientScreenings' });
User.hasMany(SymptomScreening, { foreignKey: 'doctorId', as: 'doctorScreenings' });
User.hasMany(MedicalFile, { foreignKey: 'patientId', as: 'patientFiles' });
User.hasMany(MedicalFile, { foreignKey: 'doctorId', as: 'doctorFiles' });
User.hasMany(Prescription, { foreignKey: 'patientId', as: 'patientPrescriptions' });
User.hasMany(Prescription, { foreignKey: 'doctorId', as: 'doctorPrescriptions' });
User.hasMany(VoiceNote, { foreignKey: 'patientId', as: 'patientVoiceNotes' });
User.hasMany(VoiceNote, { foreignKey: 'doctorId', as: 'doctorVoiceNotes' });
User.hasMany(Reminder, { foreignKey: 'patientId', as: 'patientReminders' });
User.hasMany(Reminder, { foreignKey: 'doctorId', as: 'doctorReminders' });

// Doctor associations
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// SymptomScreening associations
SymptomScreening.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
SymptomScreening.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
SymptomScreening.hasMany(MedicalFile, { foreignKey: 'screeningId', as: 'files' });
SymptomScreening.hasMany(Prescription, { foreignKey: 'screeningId', as: 'prescriptions' });
SymptomScreening.hasMany(VoiceNote, { foreignKey: 'screeningId', as: 'voiceNotes' });
SymptomScreening.hasMany(Reminder, { foreignKey: 'screeningId', as: 'reminders' });

// MedicalFile associations
MedicalFile.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
MedicalFile.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
MedicalFile.belongsTo(SymptomScreening, { foreignKey: 'screeningId', as: 'screening' });

// Prescription associations
Prescription.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Prescription.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
Prescription.belongsTo(SymptomScreening, { foreignKey: 'screeningId', as: 'screening' });
Prescription.hasMany(Reminder, { foreignKey: 'prescriptionId', as: 'reminders' });

// VoiceNote associations
VoiceNote.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
VoiceNote.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
VoiceNote.belongsTo(SymptomScreening, { foreignKey: 'screeningId', as: 'screening' });

// Reminder associations
Reminder.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Reminder.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
Reminder.belongsTo(SymptomScreening, { foreignKey: 'screeningId', as: 'screening' });
Reminder.belongsTo(Prescription, { foreignKey: 'prescriptionId', as: 'prescription' });

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Doctor,
  SymptomScreening,
  MedicalFile,
  Prescription,
  VoiceNote,
  Reminder,
};