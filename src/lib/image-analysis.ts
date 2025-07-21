export interface DentalAnalysis {
  conditions: DentalCondition[];
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  imageQuality: 'good' | 'fair' | 'poor';
}

export interface DentalCondition {
  type: 'cavity' | 'gum_disease' | 'staining' | 'chipped' | 'sensitivity' | 'wisdom_teeth' | 'braces' | 'normal';
  severity: 'mild' | 'moderate' | 'severe';
  location?: string;
  description: string;
  confidence: number;
}

// Simulated image analysis function that would be replaced with actual AI/ML model
export async function analyzeDentalImage(): Promise<DentalAnalysis> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This would be replaced with actual computer vision analysis
  // For now, we'll simulate analysis based on image characteristics
  
  const analysis = await performImageAnalysis();
  return analysis;
}

async function performImageAnalysis(): Promise<DentalAnalysis> {
  // Simulate analyzing image characteristics
  const conditions: DentalCondition[] = [];
  const overallConfidence = 0.8;
  let urgency: 'low' | 'medium' | 'high' = 'low';
  const recommendations: string[] = [];
  
  // Simulate detection of common dental issues
  const detectedIssues = await simulateImageDetection();
  
  // Analyze for cavities (dark spots, holes)
  if (detectedIssues.darkSpots > 0) {
    conditions.push({
      type: 'cavity',
      severity: detectedIssues.darkSpots > 2 ? 'moderate' : 'mild',
      location: 'multiple teeth',
      description: `Detected ${detectedIssues.darkSpots} potential cavity sites. Dark spots indicate tooth decay that needs attention.`,
      confidence: 0.85
    });
    urgency = 'medium';
    recommendations.push('Schedule cavity treatment appointment');
    recommendations.push('Improve oral hygiene routine');
  }
  
  // Analyze for gum disease (redness, inflammation)
  if (detectedIssues.gumRedness > 0.3) {
    conditions.push({
      type: 'gum_disease',
      severity: detectedIssues.gumRedness > 0.6 ? 'moderate' : 'mild',
      location: 'gum line',
      description: 'Signs of gum inflammation detected. Redness and swelling indicate early gum disease.',
      confidence: 0.78
    });
    urgency = 'medium';
    recommendations.push('Schedule gum health assessment');
    recommendations.push('Improve flossing routine');
  }
  
  // Analyze for staining/discoloration
  if (detectedIssues.staining > 0.4) {
    conditions.push({
      type: 'staining',
      severity: detectedIssues.staining > 0.7 ? 'moderate' : 'mild',
      location: 'tooth surfaces',
      description: 'Visible staining detected on tooth surfaces. This can be addressed with professional cleaning or whitening.',
      confidence: 0.82
    });
    recommendations.push('Consider professional cleaning');
    recommendations.push('Discuss whitening options with dentist');
  }
  
  // Analyze for chipped or broken teeth
  if (detectedIssues.chips > 0) {
    conditions.push({
      type: 'chipped',
      severity: detectedIssues.chips > 1 ? 'moderate' : 'mild',
      location: 'tooth edges',
      description: `Detected ${detectedIssues.chips} chipped or damaged tooth areas. These should be evaluated by a dentist.`,
      confidence: 0.88
    });
    urgency = 'medium';
    recommendations.push('Schedule dental repair appointment');
    recommendations.push('Avoid hard foods until evaluated');
  }
  
  // Analyze for wisdom teeth issues
  if (detectedIssues.wisdomTeeth) {
    conditions.push({
      type: 'wisdom_teeth',
      severity: 'moderate',
      location: 'back of mouth',
      description: 'Wisdom teeth detected. May need evaluation for potential removal or monitoring.',
      confidence: 0.75
    });
    recommendations.push('Schedule wisdom tooth evaluation');
  }
  
  // Analyze for braces
  if (detectedIssues.braces) {
    conditions.push({
      type: 'braces',
      severity: 'mild',
      location: 'multiple teeth',
      description: 'Orthodontic braces detected. Regular orthodontic checkups are important.',
      confidence: 0.90
    });
    recommendations.push('Continue regular orthodontic visits');
    recommendations.push('Maintain proper braces care routine');
  }
  
  // If no issues detected, mark as normal
  if (conditions.length === 0) {
    conditions.push({
      type: 'normal',
      severity: 'mild',
      description: 'No obvious dental issues detected. Teeth and gums appear healthy.',
      confidence: 0.85
    });
    recommendations.push('Continue regular dental checkups');
    recommendations.push('Maintain good oral hygiene');
  }
  
  // Assess image quality
  const imageQuality = detectedIssues.imageQuality < 0.5 ? 'poor' : 
                      detectedIssues.imageQuality < 0.8 ? 'fair' : 'good';
  
  if (imageQuality === 'poor') {
    recommendations.push('Consider uploading a clearer, better-lit photo for more accurate analysis');
  }
  
  return {
    conditions,
    confidence: overallConfidence,
    recommendations,
    urgency,
    imageQuality
  };
}

// Simulate actual image detection (would be replaced with real CV/ML model)
async function simulateImageDetection() {
  // Simulate analyzing image characteristics
  // In a real implementation, this would use computer vision to detect:
  // - Dark spots (potential cavities)
  // - Gum color and inflammation
  // - Staining and discoloration
  // - Chips and cracks
  // - Presence of braces or wisdom teeth
  // - Image quality and lighting
  
  return {
    darkSpots: Math.floor(Math.random() * 4), // 0-3 dark spots
    gumRedness: Math.random(), // 0-1 redness level
    staining: Math.random(), // 0-1 staining level
    chips: Math.floor(Math.random() * 3), // 0-2 chips
    wisdomTeeth: Math.random() > 0.7, // 30% chance
    braces: Math.random() > 0.8, // 20% chance
    imageQuality: 0.6 + Math.random() * 0.4 // 0.6-1.0 quality
  };
}

// Generate detailed analysis message based on detected conditions
export function generateAnalysisMessage(analysis: DentalAnalysis, userQuestion?: string): string {
  const question = userQuestion?.toLowerCase() || '';
  let message = '';
  
  // If user asked a specific question, address it directly
  if (question.includes('cavity') || question.includes('hole') || question.includes('decay')) {
    const cavityCondition = analysis.conditions.find(c => c.type === 'cavity');
    if (cavityCondition) {
      message += `🔍 Cavity detected\n\n`;
      message += `✅ Description: ${cavityCondition.description}\n`;
      message += `😮 Severity: ${cavityCondition.severity}\n\n`;
      message += `Cavities are common and treatable. Early intervention is best!`;
    } else {
      message += `No obvious signs of tooth decay were found in your photo. Your teeth appear healthy, but regular checkups are still important.`;
    }
  } else if (question.includes('gum') || question.includes('gingivitis')) {
    const gumCondition = analysis.conditions.find(c => c.type === 'gum_disease');
    if (gumCondition) {
      message += `🔍 Gum health alert\n\n`;
      message += `✅ Description: ${gumCondition.description}\n`;
      message += `😮 Severity: ${gumCondition.severity}\n\n`;
      message += `Gum issues can often be reversed with proper care.`;
    } else {
      message += `Your gums look healthy in this photo. Keep up your oral hygiene!`;
    }
  } else if (question.includes('stain') || question.includes('white') || question.includes('color')) {
    const stainCondition = analysis.conditions.find(c => c.type === 'staining');
    if (stainCondition) {
      message += `🔍 Some staining is visible on your teeth.\n\n`;
      message += `✅ Description: ${stainCondition.description}\n`;
      message += `😮 Severity: ${stainCondition.severity}\n\n`;
      message += `Staining is usually cosmetic and can be improved with cleaning or whitening.`;
    } else {
      message += `No significant staining detected. Your teeth color looks good!`;
    }
  } else {
    // General analysis - clean, friendly, and visually attractive
    message += `Dental Analysis Results\n\n`;
    if (analysis.conditions.length === 1 && analysis.conditions[0].type === 'normal') {
      message += `Good news: Your teeth and gums look healthy. No issues detected.`;
    } else {
      analysis.conditions.forEach((condition, index) => {
        if (condition.type === 'normal') {
          message += `Healthy: ${condition.description}\n`;
        } else {
          message += `🔍 Finding ${index + 1}: ${getConditionName(condition.type)}\n`;
          message += `✅ Description: ${condition.description}\n`;
          message += `😮 Severity: ${condition.severity}\n\n`;
        }
      });
    }
  }
  
  // Add urgency assessment (use emoji only for alert/positive)
  if (analysis.urgency === 'high') {
    message += `\n\n⚠️ Recommendation: Please schedule an appointment as soon as possible.`;
  } else if (analysis.urgency === 'medium') {
    message += `\n\nRecommendation: Consider booking an appointment in the next few weeks.`;
  } else {
    message += `\n\n👍 Recommendation: Maintain your regular dental checkups.`;
  }
  
  // Add image quality note (camera emoji)
  if (analysis.imageQuality === 'poor') {
    message += `\n\n📷 Note: The image quality is low, so the analysis may not be fully accurate. Try to upload a clearer photo for best results.`;
  }
  
  return message;
}

function getConditionName(type: string): string {
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
}

// Import or redefine ActionButton type for type safety

type ActionButton =
  | {
      id: string;
      label: string;
      action: 'book-appointment';
      data: { reason: string; urgency: string };
    }
  | {
      id: string;
      label: string;
      action: 'learn-more';
      data: { topic: string };
    }
  | {
      id: string;
      label: string;
      action: 'upload-image';
      data: undefined;
    };

// Generate action buttons based on analysis - only show booking if there are issues
export function generateActionButtons(analysis: DentalAnalysis): ActionButton[] {
  const actions: ActionButton[] = [];
  
  // Only show booking button if there are actual issues (not normal)
  const hasIssues = analysis.conditions.some(c => c.type !== 'normal');
  
  if (hasIssues) {
    const primaryCondition = analysis.conditions.find(c => c.type !== 'normal');
    if (primaryCondition) {
      actions.push({
        id: 'book-analysis',
        label: `Book ${analysis.urgency === 'high' ? 'Urgent ' : ''}Appointment`,
        action: 'book-appointment',
        data: { 
          reason: getConditionName(primaryCondition.type),
          urgency: analysis.urgency 
        }
      });
      
      // Only show learn more for actual issues
      actions.push({
        id: 'learn-condition',
        label: `Learn More About ${getConditionName(primaryCondition.type)}`,
        action: 'learn-more',
        data: { topic: primaryCondition.type }
      });
    }
  } else {
    // If everything is normal, just offer to upload another photo
    actions.push({
      id: 'upload-another',
      label: 'Upload Another Photo',
      action: 'upload-image',
      data: undefined
    });
  }
  
  // Offer to upload another photo if image quality is poor
  if (analysis.imageQuality === 'poor') {
    actions.push({
      id: 'upload-better',
      label: 'Upload Better Photo',
      action: 'upload-image',
      data: undefined
    });
  }
  
  return actions;
} 