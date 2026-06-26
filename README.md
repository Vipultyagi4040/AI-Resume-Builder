# AI Resume Builder

AI-powered Resume Builder with Interview Preparation - Built with React, Node.js, Express, and MySQL.

## Features

- **User Authentication** - Sign up, Login, Logout, Google OAuth, Password Reset
- **AI Resume Generation** - Generate professional resumes from text descriptions using Groq AI
- **Resume Management** - Save, view, and delete resumes
- **6 Resume Templates** - Modern Professional, Creative Designer, Tech Developer, Executive Manager, Simple Clean, Academic Research
- **PDF Download** - Export resumes as PDF
- **Interview Preparation** - AI-generated interview questions based on selected skills
- **MySQL Database** - Persistent storage for users and resumes

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS + DaisyUI
- React Router v7
- React Hook Form
- Axios
- jsPDF / html2pdf.js
- React Icons
- React Hot Toast

### Backend
- Node.js + Express.js
- MySQL (mysql2)
- JWT Authentication
- Bcryptjs (password hashing)
- Nodemailer (email service)
- Groq AI API (LLaMA 3.3 70B)
- UUID

## Project Structure

```
AIResume/
├── Frontend/           # React + Vite Frontend
│   ├── src/
│   │   ├── api/        # API service calls
│   │   ├── components/ # React components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Page components
│   │   └── utils/      # PDF generation utilities
│   └── package.json
└── server/             # Node.js + Express Backend
    ├── config/         # Database connection
    ├── controllers/    # Route controllers
    ├── models/         # MySQL query models
    ├── routes/         # API routes
    ├── services/       # Groq AI, Email services
    ├── utils/          # JWT token generation
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MySQL Server (running on localhost:3306)
- Groq API Key (from https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vipultyagi4040/AI-Resume-Builder.git
   cd AI-Resume-Builder
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   PORT=9090
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ai_resume_db
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Setup Frontend**
   ```bash
   cd Frontend
   npm install
   ```

### Running the Project

1. **Start MySQL Server** (via XAMPP/WAMP/MySQL Workbench)

2. **Start Backend Server** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:9090`

3. **Start Frontend Dev Server** (Terminal 2)
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Database

The application automatically creates the database and tables on first run:
- `auth_users` - Stores user accounts
- `resumes` - Stores saved resumes

## API Endpoints

### Auth Routes
- `POST /api/v1/auth/signup` - Create new account
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/google` - Google OAuth login

### Resume Routes
- `POST /api/v1/resume/generate` - Generate resume with AI
- `POST /api/v1/resume/save` - Save resume to database
- `GET /api/v1/resume/user/:userEmail` - Get all user resumes
- `GET /api/v1/resume/:id` - Get single resume
- `DELETE /api/v1/resume/:id` - Delete resume

### Interview Routes
- `POST /api/v1/interview/questions/skills` - Generate interview questions by skills
- `GET /api/v1/interview/questions` - Get fallback interview questions

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set Framework Preset to `Vite`
4. Add Environment Variable: `VITE_API_URL` = your backend URL
5. Deploy

### Backend (Render/Railway)
1. Set root directory to `server/`
2. Add environment variables from `.env.example`
3. Deploy as Node.js service

## Default Credentials (for testing)

You can create a new account via the Sign Up page, or use these test credentials:
- Email: `test@example.com`
- Password: `test123`

## Screenshots

### Home Page
![Home](https://github.com/Vipultyagi4040/AI-Resume-Builder/blob/main/screenshots/home.png)

### Resume Generator
![Generate Resume](https://github.com/Vipultyagi4040/AI-Resume-Builder/blob/main/screenshots/generate.png)

### Interview Prep
![Interview Prep](https://github.com/Vipultyagi4040/AI-Resume-Builder/blob/main/screenshots/interview.png)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Built by Vipul Tyagi - [@Vipultyagi4040](https://github.com/Vipultyagi4040)
