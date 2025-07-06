const { sequelize, User, Doctor, SymptomScreening, MedicalFile, Prescription, VoiceNote, Reminder } = require('../models');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing AI Health Assistant Database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Drop all tables if they exist (for development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Dropping existing tables (development mode)...');
      await sequelize.drop();
    }
    
    // Create all tables
    console.log('📋 Creating database tables...');
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('✅ All tables created successfully.');
    
    // Create indexes for better performance
    console.log('📈 Creating database indexes...');
    await createIndexes();
    console.log('✅ Database indexes created.');
    
    // Seed sample data for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🌱 Seeding sample data...');
      await seedSampleData();
      console.log('✅ Sample data seeded successfully.');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('- Users table: Patient and doctor accounts');
    console.log('- Doctors table: Doctor profiles and verification');
    console.log('- SymptomScreenings table: Patient symptom data');
    console.log('- MedicalFiles table: Uploaded documents');
    console.log('- Prescriptions table: AI-generated prescriptions');
    console.log('- VoiceNotes table: Doctor voice recordings');
    console.log('- Reminders table: Scheduled notifications');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function createIndexes() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    // Users table indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true, name: 'users_email_unique' });
    await queryInterface.addIndex('Users', ['role'], { name: 'users_role_idx' });
    await queryInterface.addIndex('Users', ['isActive'], { name: 'users_active_idx' });
    
    // Doctors table indexes
    await queryInterface.addIndex('Doctors', ['userId'], { name: 'doctors_user_id_idx' });
    await queryInterface.addIndex('Doctors', ['licenseNumber'], { unique: true, name: 'doctors_license_unique' });
    await queryInterface.addIndex('Doctors', ['specialization'], { name: 'doctors_specialization_idx' });
    await queryInterface.addIndex('Doctors', ['isVerified'], { name: 'doctors_verified_idx' });
    
    // SymptomScreenings table indexes
    await queryInterface.addIndex('SymptomScreenings', ['patientId'], { name: 'screenings_patient_idx' });
    await queryInterface.addIndex('SymptomScreenings', ['doctorId'], { name: 'screenings_doctor_idx' });
    await queryInterface.addIndex('SymptomScreenings', ['status'], { name: 'screenings_status_idx' });
    await queryInterface.addIndex('SymptomScreenings', ['priorityLevel'], { name: 'screenings_priority_idx' });
    await queryInterface.addIndex('SymptomScreenings', ['createdAt'], { name: 'screenings_created_idx' });
    
    // MedicalFiles table indexes
    await queryInterface.addIndex('MedicalFiles', ['patientId'], { name: 'files_patient_idx' });
    await queryInterface.addIndex('MedicalFiles', ['screeningId'], { name: 'files_screening_idx' });
    await queryInterface.addIndex('MedicalFiles', ['category'], { name: 'files_category_idx' });
    await queryInterface.addIndex('MedicalFiles', ['isActive'], { name: 'files_active_idx' });
    
    // Prescriptions table indexes
    await queryInterface.addIndex('Prescriptions', ['patientId'], { name: 'prescriptions_patient_idx' });
    await queryInterface.addIndex('Prescriptions', ['doctorId'], { name: 'prescriptions_doctor_idx' });
    await queryInterface.addIndex('Prescriptions', ['prescriptionNumber'], { unique: true, name: 'prescriptions_number_unique' });
    await queryInterface.addIndex('Prescriptions', ['status'], { name: 'prescriptions_status_idx' });
    
    // VoiceNotes table indexes
    await queryInterface.addIndex('VoiceNotes', ['doctorId'], { name: 'voice_notes_doctor_idx' });
    await queryInterface.addIndex('VoiceNotes', ['patientId'], { name: 'voice_notes_patient_idx' });
    await queryInterface.addIndex('VoiceNotes', ['transcriptionStatus'], { name: 'voice_notes_transcription_idx' });
    
    // Reminders table indexes
    await queryInterface.addIndex('Reminders', ['patientId'], { name: 'reminders_patient_idx' });
    await queryInterface.addIndex('Reminders', ['doctorId'], { name: 'reminders_doctor_idx' });
    await queryInterface.addIndex('Reminders', ['scheduledDate'], { name: 'reminders_scheduled_idx' });
    await queryInterface.addIndex('Reminders', ['status'], { name: 'reminders_status_idx' });
    await queryInterface.addIndex('Reminders', ['type'], { name: 'reminders_type_idx' });
    
  } catch (error) {
    console.warn('⚠️  Some indexes might already exist:', error.message);
  }
}

async function seedSampleData() {
  try {
    // Create sample patients
    const patient1 = await User.create({
      email: 'patient@example.com',
      password: 'password123',
      firstName: 'Rahul',
      lastName: 'Sharma',
      phoneNumber: '+919876543210',
      role: 'patient',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      address: 'Mumbai, Maharashtra',
      preferredLanguage: 'english'
    });
    
    const patient2 = await User.create({
      email: 'priya.patient@example.com',
      password: 'password123',
      firstName: 'Priya',
      lastName: 'Patel',
      phoneNumber: '+919876543211',
      role: 'patient',
      dateOfBirth: '1985-12-20',
      gender: 'female',
      address: 'Delhi, India',
      preferredLanguage: 'hindi'
    });
    
    // Create sample doctors
    const doctor1 = await User.create({
      email: 'doctor@example.com',
      password: 'password123',
      firstName: 'Dr. Amit',
      lastName: 'Kumar',
      phoneNumber: '+919876543212',
      role: 'doctor',
      dateOfBirth: '1975-08-10',
      gender: 'male',
      address: 'Chennai, Tamil Nadu',
      preferredLanguage: 'english'
    });
    
    const doctor2 = await User.create({
      email: 'dr.sarah@example.com',
      password: 'password123',
      firstName: 'Dr. Sarah',
      lastName: 'Singh',
      phoneNumber: '+919876543213',
      role: 'doctor',
      dateOfBirth: '1980-03-25',
      gender: 'female',
      address: 'Bangalore, Karnataka',
      preferredLanguage: 'english'
    });
    
    // Create doctor profiles
    await Doctor.create({
      userId: doctor1.id,
      licenseNumber: 'MH-2024-001234',
      specialization: 'General Medicine',
      experience: 15,
      qualification: 'MBBS, MD (Internal Medicine)',
      clinicName: 'Kumar Medical Center',
      clinicAddress: 'T. Nagar, Chennai, Tamil Nadu',
      consultationFee: 500.00,
      isVerified: true,
      bio: 'Experienced general physician with 15+ years in practice.',
      languages: ['english', 'hindi', 'tamil']
    });
    
    await Doctor.create({
      userId: doctor2.id,
      licenseNumber: 'KA-2024-005678',
      specialization: 'Pediatrics',
      experience: 10,
      qualification: 'MBBS, MD (Pediatrics)',
      clinicName: 'Children\'s Care Clinic',
      clinicAddress: 'Koramangala, Bangalore, Karnataka',
      consultationFee: 600.00,
      isVerified: true,
      bio: 'Specialist in pediatric care and child health.',
      languages: ['english', 'hindi', 'kannada']
    });
    
    // Create sample symptom screenings
    const screening1 = await SymptomScreening.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      symptoms: [
        { name: 'fever', severity: 'moderate', duration: '3 days' },
        { name: 'cough', severity: 'mild', duration: '2 days' },
        { name: 'headache', severity: 'severe', duration: '1 day' }
      ],
      primaryComplaint: 'High fever with persistent cough and severe headache',
      duration: '3 days',
      severity: 'moderate',
      priorityLevel: 'medium',
      medicalHistory: {
        allergies: ['penicillin'],
        currentMedications: [],
        previousConditions: ['hypertension']
      },
      painScale: 6,
      aiAnalysis: {
        possibleConditions: [
          { condition: 'Viral infection', probability: '70%' },
          { condition: 'Bacterial infection', probability: '25%' }
        ],
        recommendedTests: ['Complete Blood Count', 'Throat swab'],
        urgencyFlags: ['persistent fever']
      },
      aiSummary: 'Patient presents with moderate fever, mild cough, and severe headache. Likely viral infection. Recommend symptomatic treatment and monitoring.',
      status: 'pending',
      consentGiven: true
    });
    
    const screening2 = await SymptomScreening.create({
      patientId: patient2.id,
      symptoms: [
        { name: 'stomach pain', severity: 'severe', duration: '1 day' },
        { name: 'nausea', severity: 'moderate', duration: '1 day' }
      ],
      primaryComplaint: 'Severe abdominal pain with nausea',
      duration: '1 day',
      severity: 'severe',
      priorityLevel: 'high',
      painScale: 8,
      aiAnalysis: {
        possibleConditions: [
          { condition: 'Gastroenteritis', probability: '60%' },
          { condition: 'Appendicitis', probability: '30%' }
        ],
        recommendedTests: ['Ultrasound abdomen', 'Blood tests'],
        urgencyFlags: ['severe abdominal pain', 'high pain score']
      },
      aiSummary: 'Patient has severe abdominal pain with nausea. Requires immediate medical attention to rule out appendicitis.',
      status: 'pending',
      consentGiven: true,
      screeningLanguage: 'hindi'
    });
    
    // Create sample prescription
    await Prescription.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      screeningId: screening1.id,
      prescriptionNumber: 'RX-2024-001',
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Every 6 hours',
          duration: '5 days',
          instructions: 'Take after meals'
        },
        {
          name: 'Cough syrup',
          dosage: '10ml',
          frequency: 'Twice daily',
          duration: '7 days',
          instructions: 'Take before bedtime'
        }
      ],
      diagnosis: 'Viral upper respiratory tract infection',
      instructions: 'Rest, increase fluid intake, avoid cold foods',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      aiGenerated: true,
      status: 'approved',
      doctorNotes: 'Patient responding well to symptomatic treatment',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
    });
    
    // Create sample reminders
    await Reminder.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      type: 'medication',
      title: 'Take Paracetamol',
      message: 'Time to take your Paracetamol 500mg',
      scheduledDate: new Date(),
      frequency: 'daily',
      medicationDetails: {
        medicationName: 'Paracetamol',
        dosage: '500mg',
        time: '08:00 AM'
      },
      status: 'active',
      priority: 'medium',
      deliveryMethod: ['sms', 'whatsapp'],
      language: 'english'
    });
    
    await Reminder.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      type: 'follow_up_appointment',
      title: 'Follow-up Appointment',
      message: 'You have a follow-up appointment scheduled',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      frequency: 'once',
      appointmentDetails: {
        doctorName: 'Dr. Amit Kumar',
        clinicName: 'Kumar Medical Center',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: '10:00 AM',
        address: 'T. Nagar, Chennai, Tamil Nadu'
      },
      status: 'active',
      priority: 'medium',
      deliveryMethod: ['sms', 'whatsapp'],
      language: 'english'
    });
    
    console.log('✅ Sample data created:');
    console.log(`   - 2 Patients: ${patient1.email}, ${patient2.email}`);
    console.log(`   - 2 Doctors: ${doctor1.email}, ${doctor2.email}`);
    console.log('   - 2 Symptom screenings');
    console.log('   - 1 Prescription');
    console.log('   - 2 Reminders');
    
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n🚀 Database is ready! You can now start the application.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase, seedSampleData };