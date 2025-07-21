"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Camera, Calendar, Info, X, Upload, Bot, User } from 'lucide-react';
import { analyzeDentalImage, generateAnalysisMessage, generateActionButtons } from '@/lib/image-analysis';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  actions?: ActionButton[];
}

interface ActionButton {
  id: string;
  label: string;
  action: 'book-appointment' | 'learn-more' | 'upload-image';
  data?: any;
}

interface AIResponse {
  message: string;
  actions?: ActionButton[];
  confidence?: number;
}

export default function SmileChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there! 👋 I'm SmileChat, your friendly AI dental assistant! 😊\n\nI'm here to help you with any questions about your dental health. You can:\n\n• 📸 Upload a photo of your teeth or gums for analysis\n• 💬 Ask me about dental concerns or symptoms\n• 📅 Get recommendations for appointments\n• 🦷 Learn about oral health and treatments\n\nWhat would you like to know about your smile today?",
      timestamp: new Date(),
      actions: [
        {
          id: 'upload-demo',
          label: 'Upload Dental Photo',
          action: 'upload-image'
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI analysis function with actual image analysis
  const analyzeDentalImageWithAI = async (imageData: string, userQuestion?: string): Promise<AIResponse> => {
    try {
      // Use the new image analysis system
      const analysis = await analyzeDentalImage(imageData);
      
      // Generate message based on analysis and user question
      const message = generateAnalysisMessage(analysis, userQuestion);
      
      // Generate action buttons based on analysis
      const actions = generateActionButtons(analysis);
      
      return {
        message,
        confidence: analysis.confidence,
        actions
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        message: "I'm sorry, I encountered an error while analyzing your photo. Please try uploading a clearer image or contact support if the issue persists.",
        confidence: 0.5,
        actions: [
          {
            id: 'upload-retry',
            label: 'Upload Another Photo',
            action: 'upload-image'
          }
        ]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      image: selectedImage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImage(undefined);
    setIsLoading(true);

    try {
      let aiResponse: AIResponse;

      if (selectedImage) {
        // Analyze the uploaded image with user's question
        aiResponse = await analyzeDentalImageWithAI(selectedImage, inputMessage);
      } else {
        // Handle text-only questions about dental health
        aiResponse = await handleTextOnlyQuestion(inputMessage);
      }

      if (selectedImage && aiResponse.message) {
        storeScanHistory(selectedImage, aiResponse.message);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text-only questions about dental health with friendly responses
  const handleTextOnlyQuestion = async (question: string): Promise<AIResponse> => {
    const q = question.toLowerCase();
    
    // Common dental health questions
    if (q.includes('brush') || q.includes('cleaning') || q.includes('hygiene')) {
      return {
        message: "Great question about oral hygiene! 😊 Here are the best practices to keep your smile healthy:\n\n**🦷 Brushing:**\n• Brush twice daily for 2 minutes\n• Use fluoride toothpaste\n• Replace toothbrush every 3-4 months\n• Use gentle, circular motions\n\n**🧵 Flossing:**\n• Floss daily to remove plaque between teeth\n• Use about 18 inches of floss\n• Curve around each tooth\n\n**💡 Additional Tips:**\n• Use mouthwash for extra protection\n• Clean your tongue regularly\n• Stay hydrated to maintain saliva production\n\nWant me to take a look at your current oral hygiene routine? Just upload a photo and I'll give you personalized tips! 📸",
        actions: [
          {
            id: 'upload-hygiene',
            label: 'Upload Photo for Analysis',
            action: 'upload-image'
          },
          {
            id: 'book-cleaning',
            label: 'Book Professional Cleaning',
            action: 'book-appointment',
            data: { reason: 'Professional cleaning', urgency: 'low' }
          }
        ]
      };
    }
    
    if (q.includes('cavity') || q.includes('decay') || q.includes('hole')) {
      return {
        message: "Cavities are super common! 😊 Here's what you should know:\n\n**🦷 What are cavities?**\nCavities are permanently damaged areas in your teeth that develop into tiny openings or holes.\n\n**🍭 Common causes:**\n• Bacteria in your mouth\n• Frequent snacking on sugary foods\n• Poor oral hygiene\n• Acidic drinks\n\n**🛡️ Prevention:**\n• Brush and floss regularly\n• Limit sugary foods and drinks\n• Use fluoride toothpaste\n• Regular dental checkups\n\n**💊 Treatment:**\nEarly cavities can often be treated with fillings. More advanced decay may require root canals or crowns.\n\n**Good news:** Cavities are totally treatable! The sooner we catch them, the easier they are to fix. 😊\n\nWant me to take a look at your teeth? Just upload a photo and I'll check for any signs of cavities! 📸",
        actions: [
          {
            id: 'upload-cavity-check',
            label: 'Upload Photo for Cavity Check',
            action: 'upload-image'
          },
          {
            id: 'book-cavity-exam',
            label: 'Book Cavity Examination',
            action: 'book-appointment',
            data: { reason: 'Cavity examination', urgency: 'medium' }
          }
        ]
      };
    }
    
    if (q.includes('pain') || q.includes('hurt') || q.includes('ache')) {
      return {
        message: "Dental pain is no fun! 😣 Here's what could be causing it:\n\n**🦷 Common causes of dental pain:**\n• Cavities or tooth decay\n• Gum disease or infection\n• Cracked or broken teeth\n• Tooth sensitivity\n• Abscess or infection\n• Sinus pressure (can feel like tooth pain)\n\n**🚨 When to seek immediate care:**\n• Severe, persistent pain\n• Swelling in face or gums\n• Fever with dental pain\n• Pain that wakes you up at night\n\n**💊 Temporary relief:**\n• Over-the-counter pain relievers\n• Salt water rinse\n• Cold compress for swelling\n• Avoid very hot or cold foods\n\n**Important:** Pain is your body's way of saying something needs attention! I'd recommend uploading a photo so I can take a look, or booking an appointment if the pain is severe. 📸\n\nDon't worry - we'll get you feeling better soon! 😊",
        actions: [
          {
            id: 'upload-pain-photo',
            label: 'Upload Photo for Pain Assessment',
            action: 'upload-image'
          },
          {
            id: 'book-urgent',
            label: 'Book Urgent Appointment',
            action: 'book-appointment',
            data: { reason: 'Dental pain', urgency: 'high' }
          }
        ]
      };
    }
    
    if (q.includes('whiten') || q.includes('white') || q.includes('stain')) {
      return {
        message: "Teeth whitening is a popular cosmetic procedure! Here's what you should know:\n\n**Professional vs. Over-the-counter:**\n• Professional whitening is safer and more effective\n• Dentist-supervised treatments provide better results\n• Custom trays ensure even whitening\n\n**What causes stains:**\n• Coffee, tea, red wine\n• Tobacco use\n• Certain medications\n• Aging and wear\n\n**Professional options:**\n• In-office whitening (fastest results)\n• Take-home whitening kits\n• Combination treatments\n\n**Safety considerations:**\n• Not suitable for everyone\n• Can cause temporary sensitivity\n• Should be done under dental supervision\n\nWould you like me to assess your current tooth color from a photo and recommend the best approach?",
        actions: [
          {
            id: 'upload-whitening-photo',
            label: 'Upload Photo for Color Assessment',
            action: 'upload-image'
          },
          {
            id: 'book-whitening-consult',
            label: 'Book Whitening Consultation',
            action: 'book-appointment',
            data: { reason: 'Teeth whitening consultation', urgency: 'low' }
          }
        ]
      };
    }
    
    if (q.includes('gum') || q.includes('gingivitis') || q.includes('bleeding')) {
      return {
        message: "Gum health is crucial for overall dental health! Here's what you should know:\n\n**Signs of gum problems:**\n• Red, swollen, or tender gums\n• Bleeding when brushing or flossing\n• Receding gums\n• Bad breath that won't go away\n• Loose teeth\n\n**Gingivitis vs. Periodontitis:**\n• Gingivitis: Early, reversible gum disease\n• Periodontitis: Advanced gum disease that can cause tooth loss\n\n**Prevention and treatment:**\n• Proper brushing and flossing\n• Regular dental cleanings\n• Quit smoking\n• Manage diabetes and other health conditions\n\n**When to see a dentist:**\n• Persistent bleeding gums\n• Gum recession\n• Loose teeth\n• Bad breath\n\nWould you like me to examine a photo of your gums to assess their health?",
        actions: [
          {
            id: 'upload-gum-photo',
            label: 'Upload Photo for Gum Assessment',
            action: 'upload-image'
          },
          {
            id: 'book-gum-exam',
            label: 'Book Gum Health Exam',
            action: 'book-appointment',
            data: { reason: 'Gum health assessment', urgency: 'medium' }
          }
        ]
      };
    }
    
    // Default response for general questions
    return {
      message: "I'm here to help with your dental health questions! I can provide information about:\n\n• Oral hygiene and brushing techniques\n• Cavities and tooth decay\n• Gum health and disease\n• Dental pain and sensitivity\n• Teeth whitening and cosmetic procedures\n• Wisdom teeth and orthodontics\n\nFor the most accurate assessment of your specific situation, I'd recommend uploading a photo of your teeth or gums. This allows me to provide personalized advice based on what I can see.\n\nWhat specific dental concern would you like to discuss?",
      actions: [
        {
          id: 'upload-general',
          label: 'Upload Photo for Analysis',
          action: 'upload-image'
        },
        {
          id: 'book-general',
          label: 'Book General Consultation',
          action: 'book-appointment',
          data: { reason: 'General dental consultation', urgency: 'low' }
        }
      ]
    };
  };

  const handleActionClick = (action: ActionButton) => {
    switch (action.action) {
      case 'book-appointment':
        // Navigate to appointments page with pre-filled data
        window.location.href = `/appointments?reason=${encodeURIComponent(action.data?.reason || 'Dental consultation')}`;
        break;
      case 'learn-more':
        // Show detailed information
        handleLearnMore(action.data);
        break;
      case 'upload-image':
        fileInputRef.current?.click();
        break;
    }
  };

  const handleLearnMore = (data: any) => {
    const learnMoreMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: generateDetailedInfo(data.topic),
      timestamp: new Date(),
      actions: [
        {
          id: 'book-from-learn',
          label: 'Book Appointment',
          action: 'book-appointment',
          data: { reason: getConditionName(data.topic), urgency: 'medium' }
        },
        {
          id: 'upload-another',
          label: 'Upload Another Photo',
          action: 'upload-image'
        }
      ]
    };
    setMessages(prev => [...prev, learnMoreMessage]);
  };

  // Generate detailed information for learn more button - automatic and comprehensive
  const generateDetailedInfo = (conditionType: string): string => {
    const info: { [key: string]: string } = {
      cavity: `🦷 Cavities & Tooth Decay\nCavities are tiny holes in your teeth caused by sneaky bacteria. They love sugar!\n\nHow to spot them:\n- Sensitive to sweets, hot, or cold?\n- See a dark spot or hole?\n- Toothache that won't quit?\n\nWhat to do:\n- Brush and floss every day (bacteria hate that!)\n- Visit your dentist for a quick fix (fillings are fast!)\n- Don't wait—cavities only get bigger!\n\nFun fact: Early cavities are super easy to treat. Catch them early for a happy, pain-free smile! 😁`,
      gum_disease: `🪥 Gum Disease\nGum disease starts quietly—redness, swelling, or bleeding when you brush.\n\nEarly signs:\n- Gums bleed when brushing or flossing\n- Bad breath that won't go away\n- Gums look puffy or feel sore\n\nHow to fight back:\n- Brush gently and floss daily\n- See your dentist for a cleaning\n- Don't ignore bleeding—healthy gums don't bleed!\n\nDid you know? Early gum disease is totally reversible. Your gums will thank you! 🦷`,
      staining: `✨ Tooth Staining\nStains are like little souvenirs from coffee, tea, or soda. They don't hurt, but they can dull your smile.\n\nHow to brighten up:\n- Brush after dark drinks or use a straw\n- Try whitening toothpaste or professional cleaning\n- Avoid smoking for a whiter smile\n\nPro tip: Some stains need a dentist's touch. Ask about safe whitening options! 😁`,
      chipped: `🦷 Chipped or Damaged Teeth\nOops! Bit something hard? Chips happen.\n\nWhat to watch for:\n- Sharp or rough edge on a tooth\n- Pain when biting or chewing\n- A piece of tooth missing\n\nWhat to do:\n- See your dentist soon (small chips are easy to fix!)\n- Avoid chewing on that side\n- Save any broken pieces if you can\n\nFun fact: Dentists can fix chips with bonding, fillings, or crowns—your smile will look good as new!`,
      sensitivity: `🥶 Tooth Sensitivity\nDoes ice cream make you wince? Sensitivity means your teeth are sending you a message.\n\nCommon causes:\n- Worn enamel from brushing too hard\n- Gum recession exposing roots\n- Cavities or cracks\n\nHow to soothe:\n- Use toothpaste for sensitive teeth\n- Brush gently with a soft brush\n- Avoid super hot or cold foods\n\nGood news: Most sensitivity is easy to treat. If it sticks around, see your dentist!`,
      wisdom_teeth: `🦷 Wisdom Teeth\nWisdom teeth are your last set of molars—sometimes they cause trouble!\n\nSigns they need attention:\n- Pain or swelling at the back of your mouth\n- Trouble opening wide\n- Crowding or shifting teeth\n\nWhat to do:\n- See your dentist for an x-ray\n- Removal is common and quick\n- Most people feel better in a few days\n\nDid you know? Not everyone needs their wisdom teeth out, but regular checkups help you stay ahead!`,
      braces: `😬 Braces & Orthodontics\nBraces straighten teeth and fix bites—hello, confident smile!\n\nTips for success:\n- Brush and floss carefully around wires\n- Avoid sticky or hard foods\n- Wear your rubber bands as directed\n\nFun fact: The results are worth it! Straight teeth are easier to clean and look amazing.`,
      normal: `🎉 Healthy Smile\nYour teeth and gums look great! Keep brushing, flossing, and smiling every day.`
    };
    
    return info[conditionType] || `I'd be happy to provide detailed information about this dental condition. Please upload a photo so I can give you specific, personalized advice! 📸`;
  };

  const getConditionName = (type: string): string => {
    const names: { [key: string]: string } = {
      cavity: 'Cavities/Tooth Decay',
      gum_disease: 'Gum Disease',
      staining: 'Tooth Staining',
      chipped: 'Chipped/Damaged Teeth',
      sensitivity: 'Tooth Sensitivity',
      wisdom_teeth: 'Wisdom Teeth Issues',
      braces: 'Orthodontic Treatment',
      normal: 'Normal Dental Health'
    };
    return names[type] || type;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // After AI analysis, store scan/photo and analysis in localStorage
  const storeScanHistory = (image: string | undefined, analysis: string) => {
    if (!image) return;
    const history = JSON.parse(localStorage.getItem('smilescope_scan_history') || '[]');
    const scanNumber = history.length + 1;
    history.push({
      scanNumber,
      image,
      analysis,
      date: new Date().toISOString()
    });
    localStorage.setItem('smilescope_scan_history', JSON.stringify(history));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SmileChat AI</h1>
              <p className="text-sm text-gray-500">Your AI Dental Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = '/camera'}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Take Photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.href = '/appointments'}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Book Appointment"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-500 ml-3' : 'bg-gray-200 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {message.image && (
                      <div className="mb-3">
                        <img
                          src={message.image}
                          alt="Uploaded dental photo"
                          className="max-w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action)}
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            action.action === 'book-appointment'
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : action.action === 'learn-more'
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {action.action === 'book-appointment' && <Calendar className="w-4 h-4 mr-2" />}
                          {action.action === 'learn-more' && <Info className="w-4 h-4 mr-2" />}
                          {action.action === 'upload-image' && <Upload className="w-4 h-4 mr-2" />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-32 h-24 object-cover rounded-lg border"
              />
              <button
                onClick={removeSelectedImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or upload a dental photo..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Upload Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
} 