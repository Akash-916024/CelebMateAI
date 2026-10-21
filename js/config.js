/**
 * CelebMate AI — Application Configuration
 * Constants, event types, API URLs, and default settings
 * @module config
 */

/** Gemini API base URL */
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/** Gemini model to use */
export const GEMINI_MODEL = 'gemini-3.1-flash-lite';

/** Supported event types with Indian cultural context */
export const EVENT_TYPES = {
  WEDDING: {
    id: 'wedding',
    label: 'Wedding (Vivah/Kalyanam)',
    icon: '💒',
    subEvents: [
      'Engagement (Sagai/Nischayam)',
      'Mehendi',
      'Sangeet',
      'Haldi (Pithi/Nalugu)',
      'Wedding Ceremony',
      'Reception'
    ]
  },
  BIRTHDAY: {
    id: 'birthday',
    label: 'Birthday (Janamdin)',
    icon: '🎂',
    subEvents: ['Birthday Party', 'Cake Cutting', 'Dinner/Lunch']
  },
  ENGAGEMENT: {
    id: 'engagement',
    label: 'Engagement (Sagai/Nischayam)',
    icon: '💍',
    subEvents: ['Ring Ceremony', 'Family Dinner', 'Celebration']
  },
  HOUSEWARMING: {
    id: 'housewarming',
    label: 'Housewarming (Griha Pravesh)',
    icon: '🏠',
    subEvents: ['Puja', 'Lunch/Dinner', 'Celebration']
  },
  BABY_SHOWER: {
    id: 'baby_shower',
    label: 'Baby Shower (Godh Bharai/Seemantham)',
    icon: '👶',
    subEvents: ['Ceremony', 'Games', 'Lunch/Dinner']
  },
  ANNIVERSARY: {
    id: 'anniversary',
    label: 'Anniversary',
    icon: '❤️',
    subEvents: ['Ceremony', 'Party', 'Dinner']
  },
  COMMUNITY: {
    id: 'community',
    label: 'Community Event (Utsav)',
    icon: '🎪',
    subEvents: ['Cultural Program', 'Food Stalls', 'Games']
  }
};

/** Supported languages for invitation generation */
export const LANGUAGES = [
  { id: 'english', label: 'English', code: 'en' },
  { id: 'hindi', label: 'Hindi (हिन्दी)', code: 'hi' },
  { id: 'tamil', label: 'Tamil (தமிழ்)', code: 'ta' },
  { id: 'telugu', label: 'Telugu (తెలుగు)', code: 'te' },
  { id: 'kannada', label: 'Kannada (ಕನ್ನಡ)', code: 'kn' },
  { id: 'malayalam', label: 'Malayalam (മലയാളം)', code: 'ml' }
];

/** Invitation tone options */
export const TONES = [
  { id: 'formal', label: 'Formal', emoji: '🎩' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'traditional', label: 'Traditional', emoji: '🕉️' },
  { id: 'modern', label: 'Modern', emoji: '✨' },
  { id: 'humorous', label: 'Humorous', emoji: '😄' }
];

/** Indian cities for budget estimation */
export const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kochi', 'Coimbatore', 'Thiruvananthapuram', 'Mysore',
  'Chandigarh', 'Bhopal', 'Indore', 'Vizag', 'Other'
];

/** localStorage keys */
export const STORAGE_KEYS = {
  API_KEY: 'celebmate_api_key',
  EVENT_DATA: 'celebmate_event_data',
  BUDGET_DATA: 'celebmate_budget_data',
  TIMELINE_DATA: 'celebmate_timeline_data',
  CHAT_HISTORY: 'celebmate_chat_history',
  THEME_PREFS: 'celebmate_theme_prefs'
};

/** Navigation items */
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', section: 'dashboard' },
  { id: 'budget', label: 'Budget Planner', icon: '💰', section: 'budget' },
  { id: 'timeline', label: 'Timeline', icon: '📅', section: 'timeline' },
  { id: 'chat', label: 'AI Assistant', icon: '🤖', section: 'chat' },
  { id: 'invitation', label: 'Invitations', icon: '💌', section: 'invitation' },
  { id: 'themes', label: 'Themes & Décor', icon: '🎭', section: 'themes' }
];
