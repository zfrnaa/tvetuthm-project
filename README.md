# UTHM TVET Assessment System

A comprehensive web-based dashboard for evaluating and managing Technical and Vocational Education and Training (TVET) programs using the CIPP (Context, Input, Process, Product) evaluation model.

## 📋 Overview

**Pusat Data Penilaian CIPP Program TVET (DPPT)** is a data management and quality assessment system designed for TVET programs at Universiti Tun Hussein Onn Malaysia (UTHM). The system provides actionable insights for TVET assessment excellence through data visualization, program evaluation, and comprehensive reporting.

## ✨ Features

### Core Functionality
- **Dashboard Analytics**: Real-time visualization of program assessments and ratings
- **Program Management**: Track and evaluate TVET programs across multiple faculties
- **Assessment Tracking**: Monitor evaluation progress using the CIPP model
- **Report Generation**: Export detailed reports in PDF and CSV formats
- **Multi-language Support**: Interface available in multiple languages

### Assessment Clusters
The system evaluates programs across five key dimensions:
1. **Industry Networking** (Jaringan Industri)
2. **Curriculum Development & Delivery** (Pembangunan & Penyampaian Kurikulum)
3. **Quality of Instructors & TVET Resources** (Kualiti Tenaga Pengajar & Sumber TVET)
4. **Accreditation & Recognition** (Akreditasi & Pengiktirafan)
5. **Graduate Employability** (Kebolehpasaran Graduan)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Radix UI** & **Material UI** for component libraries
- **TanStack Table** for data tables
- **React Router** for navigation
- **AG Charts** & **ApexCharts** for data visualization

### Backend & Authentication
- **Firebase** for database and real-time data
- **Clerk** for authentication and user management
- **Express.js** for API server

### State Management & Data Fetching
- **TanStack Query (React Query)** for server state management
- Context API for global state

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Clerk account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/zfrnaa/tvetuthm-project.git
cd tvetuthm-repack-project
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

**⚠️ IMPORTANT: Never commit your .env file to git!**

Copy the example file and add your credentials:
\`\`\`bash
cp .env.example .env
\`\`\`

Then edit \`.env\` with your actual credentials:
\`\`\`env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. (Optional) Run with backend server:
\`\`\`bash
npm run dev:all
\`\`\`

### Build for Production
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── assets/          # Static assets (images, fonts)
├── auth/            # Authentication logic and server
├── components/      # Reusable UI components
│   ├── data-display/    # Tables and charts
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components (sidebar, footer)
│   ├── programs/        # Program management components
│   └── ui/             # UI primitives
├── hooks/           # Custom React hooks
├── lib/             # Utilities and contexts
│   ├── contexts/        # React contexts
│   └── utils/          # Helper functions
├── pages/           # Page components
├── styles/          # Global styles
└── types/           # TypeScript type definitions
\`\`\`

## 📊 Key Features Breakdown

### Dashboard
- Overview of total programs and evaluations
- Assessment trends visualization
- Highest-rated program highlights
- Recent assessment activity

### Report Generation
- Detailed PDF reports using React-PDF
- CSV export functionality
- Customizable report templates
- Multi-cluster assessment breakdown

### Program Management
- Faculty-wise program organization
- Star rating system
- Program evaluation tracking
- Historical data analysis

## 🧪 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking
- \`npm run backend\` - Run backend server with nodemon
- \`npm run dev:all\` - Run both frontend and backend concurrently

## 🔒 Security Best Practices

1. **Never commit .env files** - Already configured in .gitignore
2. **Use .env.example** - Template provided for team collaboration
3. **Rotate credentials regularly** - Especially if exposed
4. **Review commits** - Before pushing, check for accidental credential inclusion
5. **Use environment-specific files** - .env.local, .env.development, etc.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. **Never commit sensitive data** - Double-check before committing
4. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
5. Push to the branch (\`git push origin feature/AmazingFeature\`)
6. Open a Pull Request

## 📄 License

This project is part of UTHM's educational technology initiative.

## 👥 Support

For support and inquiries, please contact the UTHM TVET Assessment team.

---

**Version**: 1.2.1
**Built with** ❤️ for TVET excellence at UTHM