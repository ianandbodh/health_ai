# 🏥 AI Health Assistant MVP

A comprehensive full-stack web-based healthcare platform that connects patients and doctors through intelligent AI-powered screening and clinical assistance tools.

## ✨ Features

### 👤 Patient Module (Mobile-First)
- **AI-Powered Symptom Screening**: Voice and text input with Hindi/English support
- **Dynamic Follow-up Forms**: Conditional logic based on symptoms
- **Medical File Uploads**: Support for PDFs, images (lab reports, prescriptions)
- **Screening Summary**: Editable summary with consent confirmation
- **Real-time Updates**: WhatsApp/SMS reminders and notifications

### 👩‍⚕️ Doctor Module
- **Smart Dashboard**: Patient queue with AI-generated summaries
- **Voice-to-Text Transcription**: Record and transcribe consultations
- **AI-Generated Prescriptions**: Draft prescriptions based on symptoms and notes
- **Reminder Scheduling**: Follow-ups, medication, and test reminders
- **Secure Data Management**: Encrypted storage with role-based access

## 🏗️ Architecture

```
AI Health Assistant/
├── client/                 # Next.js Frontend (TypeScript)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
├── server/                # Node.js/Express Backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Authentication & validation
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Helper utilities
└── database/            # Database scripts and migrations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- OpenAI API key
- Twilio account (for SMS/WhatsApp)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-health-assistant
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

Create `.env` files in the `server` directory:

```bash
# server/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_health_assistant
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_super_secret_jwt_key_here

OPENAI_API_KEY=your_openai_api_key_here

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

PORT=5000
NODE_ENV=development
```

Create `.env.local` in the `client` directory:

```bash
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Set up the database**
```bash
# Create PostgreSQL database
createdb ai_health_assistant

# Initialize database schema
cd server && npm run init-db
```

5. **Start the development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:5000
```

## 📱 Usage

### For Patients

1. **Register/Login** as a patient
2. **Symptom Screening**:
   - Use voice or text input to describe symptoms
   - Answer dynamic follow-up questions
   - Upload medical reports/prescriptions
   - Review and confirm screening summary
3. **Receive Updates**:
   - Get WhatsApp/SMS reminders for medications
   - Receive appointment notifications
   - Follow-up symptom checks

### For Doctors

1. **Register/Login** as a doctor and complete profile verification
2. **Patient Dashboard**:
   - View patient queue with AI-generated summaries
   - Access patient priority levels and symptom data
3. **Consultations**:
   - Record voice notes with auto-transcription
   - Generate AI-assisted prescription drafts
   - Schedule follow-up reminders
4. **Patient Management**:
   - Review uploaded medical files
   - Track patient progress
   - Send custom reminders

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me         # Get current user
PUT  /api/auth/profile    # Update profile
```

### Screenings
```
POST /api/screenings              # Create new screening
GET  /api/screenings             # Get user's screenings
GET  /api/screenings/:id         # Get specific screening
PUT  /api/screenings/:id         # Update screening
```

### AI Services
```
POST /api/ai/analyze-symptoms    # AI symptom analysis
POST /api/ai/generate-prescription # AI prescription generation
POST /api/ai/transcribe-voice    # Voice transcription
```

### Communications
```
POST /api/communications/send-reminder  # Send reminders
GET  /api/communications/status/:id     # Check message status
```

## 🧪 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form management
- **Zustand** - State management
- **React Query** - Data fetching
- **Framer Motion** - Animations

### Backend
- **Node.js/Express** - Server framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### AI & Communications
- **OpenAI GPT-4** - Symptom analysis and prescription generation
- **OpenAI Whisper** - Voice transcription
- **Twilio** - SMS and WhatsApp messaging

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **Data Encryption** - Sensitive data protection

## 🔒 Security Features

- JWT-based authentication with role-based access control
- Encrypted sensitive data storage
- Rate limiting on all endpoints
- Input validation and sanitization
- Secure file upload with type validation
- HIPAA-compliant data handling practices

## 📊 Database Schema

### Core Tables
- **Users** - Patient and doctor accounts
- **Doctors** - Doctor profile and verification
- **SymptomScreenings** - Patient symptom data and AI analysis
- **Prescriptions** - AI-generated and doctor-approved prescriptions
- **MedicalFiles** - Uploaded documents with AI analysis
- **VoiceNotes** - Doctor voice recordings with transcriptions
- **Reminders** - Scheduled notifications and follow-ups

## 🎯 AI Capabilities

### Symptom Analysis
- Natural language processing of patient complaints
- Priority level assessment (low/medium/high/urgent)
- Possible condition suggestions with confidence scores
- Recommended tests and urgency flags

### Prescription Generation
- Drug interaction checking
- Dosage recommendations based on patient data
- Side effect warnings
- Follow-up scheduling suggestions

### Voice Processing
- Multi-language transcription (English/Hindi)
- Medical terminology recognition
- Key point extraction
- Action item identification

## 🔧 Development

### Code Structure
```bash
# Frontend components
client/src/components/
├── ui/              # Reusable UI components
├── patient/         # Patient-specific components
├── doctor/          # Doctor-specific components
└── shared/          # Shared components

# Backend services
server/services/
├── openaiService.js    # AI processing
├── twilioService.js    # Communications
└── fileService.js      # File handling
```

### Running Tests
```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Set up Twilio for SMS/WhatsApp
4. Obtain OpenAI API key
5. Configure SSL certificates

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

## 📈 Monitoring & Analytics

- API response time monitoring
- Error tracking and logging
- User engagement analytics
- Medical data privacy compliance
- System health monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Disclaimers

- **Medical Advisory**: This application provides AI-assisted suggestions for educational purposes only. Always consult with qualified healthcare professionals for medical advice.
- **Data Privacy**: All patient data is encrypted and handled according to healthcare privacy standards.
- **Liability**: The developers are not liable for any medical decisions made based on AI suggestions.

## 🆘 Support

For support, email support@ai-health-assistant.com or create an issue in the repository.

## 🏥 Future Roadmap

- [ ] Telemedicine video consultations
- [ ] Laboratory result integration
- [ ] Insurance claim processing
- [ ] Multi-clinic management
- [ ] Advanced analytics dashboard
- [ ] Mobile native applications
- [ ] Wearable device integration
- [ ] Multilingual support expansion

---

**Built with ❤️ for better healthcare accessibility**