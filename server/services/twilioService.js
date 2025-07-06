const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  }

  async sendSMS(to, message, options = {}) {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.formatPhoneNumber(to),
        ...options
      });

      return {
        success: true,
        messageId: response.sid,
        status: response.status,
        to: response.to,
        deliveryInfo: {
          provider: 'twilio',
          method: 'sms',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code,
        deliveryInfo: {
          provider: 'twilio',
          method: 'sms',
          timestamp: new Date().toISOString(),
          failed: true
        }
      };
    }
  }

  async sendWhatsApp(to, message, options = {}) {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: this.whatsappNumber,
        to: `whatsapp:${this.formatPhoneNumber(to)}`,
        ...options
      });

      return {
        success: true,
        messageId: response.sid,
        status: response.status,
        to: response.to,
        deliveryInfo: {
          provider: 'twilio',
          method: 'whatsapp',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code,
        deliveryInfo: {
          provider: 'twilio',
          method: 'whatsapp',
          timestamp: new Date().toISOString(),
          failed: true
        }
      };
    }
  }

  async sendMedicationReminder(patientPhone, reminderData, language = 'english') {
    const { medicationName, dosage, time, instructions } = reminderData;
    
    const messages = {
      english: `🏥 MEDICATION REMINDER
      
💊 ${medicationName}
📏 Dosage: ${dosage}
⏰ Time: ${time}
${instructions ? `📝 Instructions: ${instructions}` : ''}

Please take your medication as prescribed.
Reply TAKEN when completed.`,
      
      hindi: `🏥 दवा की याददहानी
      
💊 ${medicationName}
📏 खुराक: ${dosage}
⏰ समय: ${time}
${instructions ? `📝 निर्देश: ${instructions}` : ''}

कृपया अपनी दवा निर्धारित अनुसार लें।
पूरा होने पर TAKEN का उत्तर दें।`
    };

    const message = messages[language] || messages.english;
    
    // Try WhatsApp first, fallback to SMS
    let result = await this.sendWhatsApp(patientPhone, message);
    
    if (!result.success) {
      result = await this.sendSMS(patientPhone, message);
    }
    
    return result;
  }

  async sendAppointmentReminder(patientPhone, appointmentData, language = 'english') {
    const { doctorName, clinicName, date, time, address } = appointmentData;
    
    const messages = {
      english: `🏥 APPOINTMENT REMINDER
      
👨‍⚕️ Dr. ${doctorName}
🏢 ${clinicName}
📅 Date: ${date}
⏰ Time: ${time}
📍 Address: ${address}

Please arrive 15 minutes early.
Reply CONFIRM to confirm your appointment.`,
      
      hindi: `🏥 अपॉइंटमेंट की याददहानी
      
👨‍⚕️ डॉ. ${doctorName}
🏢 ${clinicName}
📅 दिनांक: ${date}
⏰ समय: ${time}
📍 पता: ${address}

कृपया 15 मिनट पहले पहुंचें।
अपने अपॉइंटमेंट की पुष्टि के लिए CONFIRM का उत्तर दें।`
    };

    const message = messages[language] || messages.english;
    
    let result = await this.sendWhatsApp(patientPhone, message);
    
    if (!result.success) {
      result = await this.sendSMS(patientPhone, message);
    }
    
    return result;
  }

  async sendTestReminder(patientPhone, testData, language = 'english') {
    const { testName, labName, date, time, fastingRequired, instructions } = testData;
    
    const messages = {
      english: `🏥 LAB TEST REMINDER
      
🔬 Test: ${testName}
🏢 Lab: ${labName}
📅 Date: ${date}
⏰ Time: ${time}
${fastingRequired ? '⚠️ FASTING REQUIRED - No food/drink 8-12 hours before test' : ''}
${instructions ? `📝 Instructions: ${instructions}` : ''}

Please bring a valid ID and your prescription.`,
      
      hindi: `🏥 जांच की याददहानी
      
🔬 जांच: ${testName}
🏢 लैब: ${labName}
📅 दिनांक: ${date}
⏰ समय: ${time}
${fastingRequired ? '⚠️ उपवास आवश्यक - जांच से 8-12 घंटे पहले कुछ न खाएं/पिएं' : ''}
${instructions ? `📝 निर्देश: ${instructions}` : ''}

कृपया वैध आईडी और प्रिस्क्रिप्शन लेकर आएं।`
    };

    const message = messages[language] || messages.english;
    
    let result = await this.sendWhatsApp(patientPhone, message);
    
    if (!result.success) {
      result = await this.sendSMS(patientPhone, message);
    }
    
    return result;
  }

  async sendSymptomFollowUp(patientPhone, patientName, language = 'english') {
    const messages = {
      english: `🏥 SYMPTOM CHECK-UP
      
Hello ${patientName},

How are you feeling today? Please update us on your current symptoms:

1. Rate your pain (1-10):
2. Any new symptoms?
3. Are you taking medications as prescribed?

Reply with your update or call us if urgent.`,
      
      hindi: `🏥 लक्षण जांच
      
नमस्ते ${patientName},

आज आप कैसा महसूस कर रहे हैं? कृपया अपने वर्तमान लक्षणों के बारे में बताएं:

1. अपने दर्द का स्तर बताएं (1-10):
2. कोई नए लक्षण?
3. क्या आप दवाएं निर्धारित अनुसार ले रहे हैं?

अपना अपडेट भेजें या तुरंत जरूरत हो तो कॉल करें।`
    };

    const message = messages[language] || messages.english;
    
    let result = await this.sendWhatsApp(patientPhone, message);
    
    if (!result.success) {
      result = await this.sendSMS(patientPhone, message);
    }
    
    return result;
  }

  async sendEmergencyAlert(doctorPhone, patientData, urgencyLevel) {
    const message = `🚨 URGENT PATIENT ALERT - Level: ${urgencyLevel.toUpperCase()}
    
👤 Patient: ${patientData.name}
📱 Phone: ${patientData.phone}
⚠️ Urgent Symptoms: ${patientData.urgentSymptoms}
⏰ Reported: ${new Date().toLocaleString()}

Please contact the patient immediately or advise emergency care.

Patient Location: ${patientData.address || 'Not provided'}`;

    return await this.sendSMS(doctorPhone, message);
  }

  async getMessageStatus(messageId) {
    try {
      const message = await this.client.messages(messageId).fetch();
      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateUpdated: message.dateUpdated
      };
    } catch (error) {
      console.error('Error fetching message status:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming India +91)
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  validatePhoneNumber(phoneNumber) {
    const cleaned = this.formatPhoneNumber(phoneNumber);
    // Basic validation for Indian phone numbers
    const indianPhoneRegex = /^\+91[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleaned);
  }

  async sendBulkReminders(reminders) {
    const results = [];
    
    for (const reminder of reminders) {
      try {
        let result;
        
        switch (reminder.type) {
          case 'medication':
            result = await this.sendMedicationReminder(
              reminder.phone,
              reminder.data,
              reminder.language
            );
            break;
            
          case 'appointment':
            result = await this.sendAppointmentReminder(
              reminder.phone,
              reminder.data,
              reminder.language
            );
            break;
            
          case 'test':
            result = await this.sendTestReminder(
              reminder.phone,
              reminder.data,
              reminder.language
            );
            break;
            
          default:
            result = await this.sendSMS(reminder.phone, reminder.message);
        }
        
        results.push({
          reminderId: reminder.id,
          success: result.success,
          messageId: result.messageId,
          deliveryInfo: result.deliveryInfo
        });
        
        // Add delay between messages to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results.push({
          reminderId: reminder.id,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

module.exports = new TwilioService();