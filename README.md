# Tamil Real Estate Transaction System

A full-stack solution for extracting, translating, and managing 30 years of Tamil real-estate transactions from PDF documents.

## Features

- **PDF Parsing**: Extract transaction data from Tamil-language PDF documents
- **Translation**: Automatic Tamil to English translation using Google Translate API
- **Advanced Filtering**: Search by buyer, seller, house number, survey number, document number
- **Side-by-Side View**: PDF preview alongside extracted transactions
- **RESTful API**: Built with Nest.js and Drizzle ORM
- **Modern UI**: Responsive Next.js interface with Tailwind CSS

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Assumptions](#assumptions)
- [Testing](#testing)
- [Deployment](#deployment)

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Next.js UI    │─────▶│   Nest.js API   │─────▶│   PostgreSQL    │
│  (Frontend)     │◀─────│   (Backend)     │◀─────│   (Database)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │
         │                        ├── PDF Parser
         │                        ├── Translation Service
         │                        └── Drizzle ORM
         │
         └── Components:
             ├── Login
             ├── Upload Form
             ├── Results Table
             └── PDF Preview
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | React framework with SSR |
| Styling | Tailwind CSS | Utility-first CSS |
| Backend | Nest.js | Node.js framework |
| ORM | Drizzle | Type-safe database queries |
| Database | PostgreSQL | Relational database |
| PDF Parsing | pdf-parse | Extract text from PDFs |
| Translation | Google Translate API | Tamil to English translation |

## 📦 Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn**
- **Google Cloud Account** (for Translation API)

## 🔧 Installation

### 1. Clone Repository

```bash
git clone //
cd tamil-realestate-system
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb tamil_realestate

# Or using psql
psql -U postgres
CREATE DATABASE tamil_realestate;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Install required packages
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/config
npm install drizzle-orm postgres pg
npm install pdf-parse @google-cloud/translate
npm install multer @types/multer
npm install class-validator class-transformer
npm install drizzle-kit --save-dev
npm install @types/node --save-dev
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install required packages
npm install next@14 react react-dom
npm install typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npm install axios
npm install lucide-react
npm install react-pdf pdfjs-dist

# Initialize Tailwind
npx tailwindcss init -p
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/tamil_realestate

# Google Translate API
GOOGLE_TRANSLATE_API_KEY=XXX

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Cloud Translation API**
4. Create API credentials (API Key)
5. Copy the API key to `GOOGLE_TRANSLATE_API_KEY` in backend `.env`

Alternatively, use service account:

```bash
# Set service account credentials
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### Tailwind Configuration

Update `frontend/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🗄️ Database Schema

### Run Migrations

```bash
cd backend

# Generate migration files
npx drizzle-kit generate:pg

# Apply migrations
npx drizzle-kit push:pg
```

### Schema Definition

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  buyer_name_tamil TEXT NOT NULL,
  buyer_name_english TEXT NOT NULL,
  seller_name_tamil TEXT NOT NULL,
  seller_name_english TEXT NOT NULL,
  house_number VARCHAR(50),
  survey_number VARCHAR(50) NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  transaction_value INTEGER,
  district VARCHAR(100),
  raw_text_tamil TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for faster searches
CREATE INDEX idx_buyer_name ON transactions(buyer_name_english);
CREATE INDEX idx_seller_name ON transactions(seller_name_english);
CREATE INDEX idx_survey_number ON transactions(survey_number);
CREATE INDEX idx_document_number ON transactions(document_number);
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
```

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Backend will run on `http://localhost:3001`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Production Mode

#### Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

### Using Docker (Optional)

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📚 API Documentation

### Base URL

```
http://localhost:3001
```

### Endpoints

#### 1. Upload PDF and Extract Transactions

**POST** `/transactions/upload`

Upload a Tamil PDF and extract transactions with optional filtering.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `pdf`: PDF file (required)
  
**Query Parameters:**
- `buyerName` (optional): Filter by buyer name
- `sellerName` (optional): Filter by seller name
- `houseNumber` (optional): Filter by house number
- `surveyNumber` (optional): Filter by survey number
- `documentNumber` (optional): Filter by document number

**Example:**

```bash
curl -X POST http://localhost:3001/transactions/upload \
  -F "pdf=@/path/to/document.pdf" \
  -F "buyerName=Kumar"
```

**Response:**

```json
{
  "success": true,
  "count": 15,
  "transactions": [
    {
      "id": 1,
      "buyerNameTamil": "குமார்",
      "buyerNameEnglish": "Kumar",
      "sellerNameTamil": "ராஜா",
      "sellerNameEnglish": "Raja",
      "houseNumber": "12/A",
      "surveyNumber": "123/4",
      "documentNumber": "1234/2020",
      "transactionDate": "2020-01-15T00:00:00.000Z",
      "transactionValue": 1000000,
      "district": "Chennai",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

#### 2. Search Transactions

**GET** `/transactions/search`

Search existing transactions in the database.

**Query Parameters:**
- `buyerName` (optional): Search by buyer name
- `sellerName` (optional): Search by seller name
- `houseNumber` (optional): Search by house number
- `surveyNumber` (optional): Search by survey number
- `documentNumber` (optional): Search by document number

**Example:**

```bash
curl "http://localhost:3001/transactions/search?surveyNumber=123/4"
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "transactions": [
    {
      "id": 1,
      "buyerNameTamil": "குமார்",
      "buyerNameEnglish": "Kumar",
      "sellerNameTamil": "ராஜா",
      "sellerNameEnglish": "Raja",
      "surveyNumber": "123/4",
      "documentNumber": "1234/2020",
      "transactionDate": "2020-01-15T00:00:00.000Z",
      "transactionValue": 1000000
    }
  ]
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "PDF file is required",
  "error": "Bad Request"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Failed to process PDF",
  "error": "Internal Server Error"
}
```

## 🎯 Usage Guide

### 1. Login

1. Navigate to `http://localhost:3000`
2. Enter demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
3. Click "Sign In"

### 2. Upload PDF

1. Click "Choose PDF file..." button
2. Select a Tamil real estate transaction PDF
3. (Optional) Click "Show Filters" to apply search criteria
4. Click "Process & Extract Transactions"

### 3. View Results

- **Left Panel**: Table showing extracted transactions with both Tamil and English names
- **Right Panel**: PDF preview with zoom controls
- Scroll through transactions and compare with original PDF

### 4. Search Existing Transactions

Use filters to search through previously uploaded transactions stored in the database.

## 🔍 Assumptions

### PDF Format Assumptions

1. **Document Structure**: Transactions are separated by document number indicators (வ.எண், ஆவணம், or "Document No")

2. **Field Patterns**: The parser expects these patterns:
   - Document Number: `வ.எண். 1234/2020` or `Document No: 1234/2020`
   - Survey Number: `சர்வே எண். 123/4` or `Survey No: 123/4`
   - Buyer: `வாங்குபவர்: NAME` or `Buyer: NAME`
   - Seller: `விற்பவர்: NAME` or `Seller: NAME`
   - Date: `DD/MM/YYYY` format
   - Value: `ரூ. 1,00,000` or `Rs. 100000`

3. **Language**: PDF contains Tamil text with possible English mixed content

4. **Layout**: Text is extractable (not scanned images without OCR)

### Translation Assumptions

1. **API Availability**: Google Translate API is accessible and has sufficient quota
2. **Name Preservation**: Proper nouns (names) are transliterated, not translated
3. **Fallback**: If translation fails, original Tamil text is preserved
4. **Batch Processing**: Multiple fields are translated in batches for efficiency

### Performance Assumptions

1. **PDF Size**: Handles PDFs up to 50MB efficiently
2. **Transaction Count**: Can process 1000+ transactions per PDF
3. **Processing Time**: Average 30-60 seconds for a 30-year document
4. **Concurrent Users**: Designed for small team usage (5-10 concurrent users)

### Data Quality Assumptions

1. **Consistency**: Transaction format is relatively consistent across years
2. **Completeness**: Not all fields may be present in every transaction
3. **Duplicates**: No automatic duplicate detection (relies on unique document numbers)

## 📝 Code Quality Features

### Backend

- **Modular Architecture**: Services separated by responsibility
- **Type Safety**: Full TypeScript with Drizzle ORM types
- **Error Handling**: Comprehensive try-catch blocks with meaningful errors
- **Validation**: Input validation using class-validator
- **Dependency Injection**: Nest.js DI container
- **Environment Config**: Secure configuration management

### Frontend

- **Component-Based**: Reusable React components
- **Type Safety**: TypeScript throughout
- **State Management**: React hooks for local state
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first Tailwind CSS
- **Accessibility**: Semantic HTML and ARIA labels

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Component tests
npm run test

# E2E tests with Playwright
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Upload valid PDF
- [ ] Upload invalid file type (error handling)
- [ ] Apply filters before upload
- [ ] View extracted transactions
- [ ] Verify Tamil and English translations
- [ ] Use PDF zoom controls
- [ ] Search existing transactions
- [ ] Logout functionality

## 🔐 Security Considerations

### Current Implementation (Development)

- **Authentication**: Stub implementation (hardcoded credentials)
- **CORS**: Open for localhost development
- **File Upload**: Basic validation (file type only)

### Production Recommendations

1. **Authentication**:
   - Implement JWT-based authentication
   - Use bcrypt for password hashing
   - Add refresh token mechanism

2. **File Upload Security**:
   - Virus scanning for uploaded files
   - File size limits (enforce on backend)
   - Validate PDF structure before processing

3. **API Security**:
   - Rate limiting (express-rate-limit)
   - Helmet.js for security headers
   - Input sanitization
   - SQL injection prevention (Drizzle ORM handles this)

4. **Environment**:
   - Use secrets manager (AWS Secrets Manager, HashiCorp Vault)
   - Rotate API keys regularly
   - Enable HTTPS only

## 🚀 Deployment

### Backend Deployment (Docker)

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**Build and Deploy:**

```bash
docker build -t tamil-realestate-backend .
docker run -p 3001:3001 --env-file .env tamil-realestate-backend
```

### Frontend Deployment (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Database Deployment (Managed PostgreSQL)

**Recommended Providers:**
- **AWS RDS**: Managed PostgreSQL with automatic backups
- **Heroku Postgres**: Easy setup with free tier
- **DigitalOcean**: Managed databases with simple pricing
- **Supabase**: PostgreSQL with built-in features

**Migration for Production:**

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@prod-host:5432/db"

# Run migrations
npx drizzle-kit push:pg
```

### Full Stack Deployment (docker-compose)

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: tamil_realestate
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/tamil_realestate
      GOOGLE_TRANSLATE_API_KEY: ${GOOGLE_API_KEY}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy:**

```bash
docker-compose up -d
```

## 📊 Performance Optimization

### Backend Optimizations

1. **Database Indexing**:
```sql
CREATE INDEX CONCURRENTLY idx_buyer_name ON transactions(buyer_name_english);
CREATE INDEX CONCURRENTLY idx_survey_doc ON transactions(survey_number, document_number);
```

2. **Batch Translation**:
   - Translate multiple fields simultaneously
   - Cache translation results

3. **Streaming**:
   - Stream large PDFs instead of loading entirely into memory

4. **Caching**:
```typescript
// Add Redis caching for frequent searches
import { CACHE_MANAGER } from '@nestjs/cache-manager';
```

### Frontend Optimizations

1. **Code Splitting**:
```typescript
// Dynamic imports for heavy components
const PDFPreview = dynamic(() => import('@/components/PDFPreview'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

2. **Image Optimization**:
   - Use Next.js Image component
   - Lazy load PDF preview

3. **Debouncing**:
```typescript
// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce((value) => handleSearch(value), 500),
  []
);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Connection refused - connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d tamil_realestate
```

#### 2. Translation API Error

**Error**: `Google Translate API quota exceeded`

**Solution**:
- Check your Google Cloud quota
- Implement caching to reduce API calls
- Use fallback to original Tamil text

#### 3. PDF Parsing Issues

**Error**: `No transactions found in PDF`

**Solution**:
- Verify PDF contains extractable text (not scanned images)
- Adjust regex patterns in `PdfParserService`
- Check for encoding issues

#### 4. Frontend Build Error

**Error**: `Module not found: Can't resolve '@/components/...'`

**Solution**:
```json
// Update tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📖 Additional Resources

### Documentation

- [Nest.js Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)

### Tamil Language Resources

- [Tamil Unicode Chart](http://www.unicode.org/charts/PDF/U0B80.pdf)
- [Tamil Regex Patterns](https://github.com/tshrinivasan/tamil-nlp-resources)

### Sample PDFs for Testing

Create test PDFs with the following structure:

```
ஆவணம் எண்: 1234/2020
தேதி: 15/01/2020
சர்வே எண்: 123/4
வீடு எண்: 12/A
மாவட்டம்: சென்னை

வாங்குபவர்: குமார்
விற்பவர்: ராஜா
மதிப்பு: ரூ. 10,00,000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Atul Chauhan - Initial work

## 🙏 Acknowledgments

- Google Cloud Translation API
- Nest.js community
- Next.js team
- Drizzle ORM contributors

## 📞 Support

For support, email atul012001@gmail.com or open an issue in the GitHub repository.

---

**Project Status**: ✅ Production Ready

**Last Updated**: Oct 5 2025

**Version**: 1.0.0