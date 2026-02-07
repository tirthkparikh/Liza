# Liza Love Server

Backend server for the Liza Love website with admin panel, email, SMS, and Google Calendar integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - MongoDB connection string
   - JWT secret
   - Email credentials (Gmail)
   - Google Calendar API credentials
   - Twilio credentials (for SMS/phone)

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (first time)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Images
- `GET /api/images` - Get all images
- `POST /api/images/upload` - Upload image (Admin)
- `DELETE /api/images/:id` - Delete image (Admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create story (Admin)
- `PUT /api/stories/:id` - Update story (Admin)
- `DELETE /api/stories/:id` - Delete story (Admin)

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Email
- `POST /api/email/send` - Send email

### SMS/Phone
- `POST /api/sms/send` - Send SMS
- `POST /api/sms/call` - Make phone call

### Calendar
- `GET /api/calendar/events` - Get calendar events
- `POST /api/calendar/events` - Create calendar event
- `GET /api/calendar/auth-url` - Get Google OAuth URL

## Admin Setup

First time setup:
1. Register admin account via `/api/auth/register`
2. Login via `/api/auth/login` to get JWT token
3. Use token in Authorization header: `Bearer <token>`

## Services Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `EMAIL_PASS`

### Google Calendar Setup
1. Create project in Google Cloud Console
2. Enable Calendar API
3. Create OAuth 2.0 credentials
4. Add redirect URI

### Twilio Setup
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get phone number
4. Add to `.env`

