
# Return to Office App

A web application for managing office visits and remote work.

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

When deploying, make sure to set the environment variables in your hosting platform:

- For Netlify/Vercel: Set the environment variables in their dashboard
- For other platforms: Refer to their documentation on how to set environment variables

## Important Security Notes

- **NEVER** commit your `.env` file to Git
- **NEVER** commit the `dist` directory to Git
- Always use environment variables for secrets

