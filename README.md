# CareerAI - AI-Powered Resume Analyzer & Job Matching Platform

CareerAI analyzes resumes, matches candidates with job descriptions, identifies skill gaps, and generates AI-powered resume improvements and interview questions.

## Tech Stack
-  React.js
- Python & Django REST Framework
- PostgreSQL
- Ollama (Llama 3.2)
- TF-IDF text similarity
- JWT Authentication

## Run Locally

### Backend

```powershell
Set-Location backend
python -m pip install -r requirements.txt
Copy-Item .env.example .env
# Configure the database and SECRET_KEY in .env.
python manage.py migrate
python manage.py runserver
```

### Frontend

```powershell
Set-Location frontend
npm ci
npm run dev
```

Results:

![image](https://github.com/prasadmagdum/CareerAI/blob/7cc09c4ec1a1befbd0c87aed6e147de3dc7ffd28/Screenshot%202026-10-16%20125805.png),

![image](https://github.com/prasadmagdum/CareerAI/blob/7cc09c4ec1a1befbd0c87aed6e147de3dc7ffd28/Screenshot%202026-10-16%20125828.png),

![image](https://github.com/prasadmagdum/CareerAI/blob/7cc09c4ec1a1befbd0c87aed6e147de3dc7ffd28/Screenshot%202026-10-16%20125847.png) 
