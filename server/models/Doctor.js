const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 50,
    },
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clinicName: {
    type: DataTypes.STRING,
  },
  clinicAddress: {
    type: DataTypes.TEXT,
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  availableFrom: {
    type: DataTypes.TIME,
    defaultValue: '09:00:00',
  },
  availableTo: {
    type: DataTypes.TIME,
    defaultValue: '17:00:00',
  },
  workingDays: {
    type: DataTypes.JSON,
    defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  bio: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationDocuments: {
    type: DataTypes.JSON,
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['english'],
  },
});

module.exports = Doctor;