const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeSymptoms(symptomData) {
    try {
      const prompt = this.createSymptomAnalysisPrompt(symptomData);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an experienced medical AI assistant. Analyze patient symptoms and provide structured medical insights. Always recommend consulting with a healthcare professional. Do not provide definitive diagnoses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.MAX_TOKENS) || 1000,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
      });

      const analysis = response.choices[0].message.content;
      return this.parseSymptomAnalysis(analysis);
      
    } catch (error) {
      console.error('OpenAI symptom analysis error:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  async generatePrescription(patientData, symptoms, doctorNotes) {
    try {
      const prompt = this.createPrescriptionPrompt(patientData, symptoms, doctorNotes);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant helping doctors create prescription drafts. Generate structured prescription suggestions based on symptoms and patient data. Include dosages, frequencies, and duration. Always mark as 'draft for review' and emphasize doctor approval is required."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3, // Lower temperature for more precise medical recommendations
      });

      const prescription = response.choices[0].message.content;
      return this.parsePrescriptionSuggestion(prescription);
      
    } catch (error) {
      console.error('OpenAI prescription generation error:', error);
      throw new Error('Failed to generate prescription');
    }
  }

  async transcribeVoice(audioBuffer) {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: audioBuffer,
        model: "whisper-1",
        language: "en", // Can be modified based on user preference
      });

      return {
        transcription: response.text,
        confidence: 0.9, // Whisper doesn't provide confidence scores
      };
      
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async summarizeVoiceNote(transcription) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant. Summarize voice notes from doctors, extracting key points, action items, and important medical information."
          },
          {
            role: "user",
            content: `Please summarize this medical voice note and extract key points:\n\n${transcription}`
          }
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      return {
        summary: response.choices[0].message.content,
        keyPoints: this.extractKeyPoints(response.choices[0].message.content),
      };
      
    } catch (error) {
      console.error('OpenAI voice note summary error:', error);
      throw new Error('Failed to summarize voice note');
    }
  }

  async analyzeUploadedDocument(extractedText, documentType) {
    try {
      const prompt = `Analyze this ${documentType} document and extract relevant medical information:\n\n${extractedText}`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical document analyzer. Extract and structure important medical information from documents like lab reports, prescriptions, and medical histories."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return this.parseDocumentAnalysis(response.choices[0].message.content);
      
    } catch (error) {
      console.error('OpenAI document analysis error:', error);
      throw new Error('Failed to analyze document');
    }
  }

  createSymptomAnalysisPrompt(symptomData) {
    const { symptoms, primaryComplaint, duration, severity, medicalHistory, vitalSigns, painScale } = symptomData;
    
    return `
Please analyze the following patient symptoms and provide a structured assessment:

Primary Complaint: ${primaryComplaint}
Symptoms: ${JSON.stringify(symptoms)}
Duration: ${duration}
Severity: ${severity}
Pain Scale (1-10): ${painScale || 'Not provided'}
Medical History: ${JSON.stringify(medicalHistory) || 'None provided'}
Vital Signs: ${JSON.stringify(vitalSigns) || 'Not provided'}

Please provide your analysis in the following JSON format:
{
  "priority": "low|medium|high|urgent",
  "possibleConditions": [{"condition": "name", "probability": "percentage", "reasoning": "explanation"}],
  "recommendedTests": ["test1", "test2"],
  "urgencyFlags": ["flag1", "flag2"],
  "summary": "brief summary for the doctor",
  "patientInstructions": "what the patient should do while waiting",
  "timeframe": "when patient should be seen"
}

Important: This is for medical professional review only. Always recommend consulting with a healthcare provider.
    `;
  }

  createPrescriptionPrompt(patientData, symptoms, doctorNotes) {
    return `
Create a prescription draft based on the following information:

Patient Age: ${patientData.age || 'Not provided'}
Gender: ${patientData.gender || 'Not provided'}
Medical History: ${JSON.stringify(patientData.medicalHistory) || 'None'}
Allergies: ${JSON.stringify(patientData.allergies) || 'None known'}
Current Medications: ${JSON.stringify(patientData.currentMedications) || 'None'}

Symptoms: ${JSON.stringify(symptoms)}
Doctor's Notes: ${doctorNotes}

Please provide a prescription draft in JSON format:
{
  "medications": [
    {
      "name": "medication name",
      "dosage": "strength",
      "frequency": "how often",
      "duration": "how long",
      "instructions": "special instructions",
      "sideEffects": ["potential side effects"]
    }
  ],
  "diagnosis": "working diagnosis",
  "instructions": "general instructions for patient",
  "followUp": "recommended follow-up timeframe",
  "warnings": "important warnings or contraindications",
  "labTests": ["recommended tests if any"]
}

This is a DRAFT prescription that requires doctor review and approval.
    `;
  }

  parseSymptomAnalysis(analysisText) {
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON not found
      return {
        priority: 'medium',
        summary: analysisText,
        possibleConditions: [],
        recommendedTests: [],
        urgencyFlags: []
      };
    } catch (error) {
      console.error('Error parsing symptom analysis:', error);
      return {
        priority: 'medium',
        summary: analysisText,
        possibleConditions: [],
        recommendedTests: [],
        urgencyFlags: []
      };
    }
  }

  parsePrescriptionSuggestion(prescriptionText) {
    try {
      const jsonMatch = prescriptionText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        medications: [],
        diagnosis: 'Requires doctor review',
        instructions: prescriptionText,
        warnings: 'This is a draft prescription requiring doctor approval'
      };
    } catch (error) {
      console.error('Error parsing prescription suggestion:', error);
      return {
        medications: [],
        diagnosis: 'Requires doctor review',
        instructions: prescriptionText,
        warnings: 'This is a draft prescription requiring doctor approval'
      };
    }
  }

  parseDocumentAnalysis(analysisText) {
    return {
      summary: analysisText,
      extractedData: this.extractStructuredData(analysisText),
      tags: this.generateTags(analysisText)
    };
  }

  extractKeyPoints(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return first 5 non-empty lines as key points
  }

  extractStructuredData(text) {
    // This could be enhanced to extract specific medical data patterns
    const data = {};
    
    // Extract dates
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/g;
    const dates = text.match(dateRegex);
    if (dates) data.dates = dates;
    
    // Extract numbers (could be test values)
    const numberRegex = /\d+\.?\d*/g;
    const numbers = text.match(numberRegex);
    if (numbers) data.values = numbers.slice(0, 10); // Limit to first 10 numbers
    
    return data;
  }

  generateTags(text) {
    const medicalTerms = [
      'blood pressure', 'diabetes', 'heart rate', 'temperature', 'weight',
      'cholesterol', 'glucose', 'hemoglobin', 'prescription', 'medication',
      'symptoms', 'diagnosis', 'treatment', 'test results', 'lab report'
    ];
    
    const foundTerms = medicalTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
    
    return foundTerms;
  }
}

module.exports = new OpenAIService();