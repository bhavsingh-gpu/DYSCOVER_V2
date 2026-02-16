import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read Firebase key JSON
const firebaseKeyPath = join(__dirname, 'FIREBASE_KEY_DYSCOVER.json');
let firebaseServiceAccount = '';

if (existsSync(firebaseKeyPath)) {
  try {
    const firebaseKey = JSON.parse(readFileSync(firebaseKeyPath, 'utf8'));
    firebaseServiceAccount = JSON.stringify(firebaseKey);
    console.log('✅ Found Firebase key file');
  } catch (error) {
    console.error('❌ Error reading Firebase key:', error.message);
  }
} else {
  console.warn('⚠️  Firebase key file not found. You will need to set FIREBASE_SERVICE_ACCOUNT manually.');
}

// Create .env file from template
const envTemplate = `# DYSCOVER Backend Environment Variables
# Generated automatically - Fill in your Gemini API key

# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Gemini / Google AI Configuration
# Get your API key from: https://aistudio.google.com/
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Gemini Models
GEMINI_MODEL_FLASH=gemini-2.0-flash-exp
GEMINI_MODEL_PRO=gemini-2.0-pro-exp

# AI Configuration
AI_MAX_TOKENS=2048
AI_TIMEOUT_MS=30000

# Firebase Admin Service Account
# Paste the FULL JSON from FIREBASE_KEY_DYSCOVER.json as a single line string
${firebaseServiceAccount ? `FIREBASE_SERVICE_ACCOUNT=${firebaseServiceAccount}` : 'FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}'}

# Security
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# CORS
CORS_ORIGIN=http://localhost:5173
`;

const envPath = join(__dirname, '.env');

if (existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('📝 Please manually add your GEMINI_API_KEY to the existing .env file');
} else {
  writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file');
  console.log('📝 IMPORTANT: Add your GEMINI_API_KEY to the .env file');
  console.log('   Get it from: https://aistudio.google.com/');
}

