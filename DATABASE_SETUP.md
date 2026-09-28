# Database Setup Guide - PostgreSQL

## Prerequisites

- PostgreSQL 12+ installed
- psql command-line tool
- Environment configured

## Step 1: Install PostgreSQL

### macOS (Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Windows
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

## Step 2: Create Database

### Using psql

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE highpeak;

# Create user with password
CREATE USER highpeak_user WITH PASSWORD 'secure_password';

# Grant privileges
ALTER ROLE highpeak_user SET client_encoding TO 'utf8';
ALTER ROLE highpeak_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE highpeak_user SET default_transaction_deferrable TO on;
ALTER ROLE highpeak_user SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE highpeak TO highpeak_user;

# Exit psql
\q
```

### Or using createdb command

```bash
createdb -U postgres highpeak
createuser -U postgres highpeak_user
psql -U postgres -d highpeak -c "ALTER ROLE highpeak_user WITH PASSWORD 'secure_password';"
psql -U postgres -d highpeak -c "GRANT ALL PRIVILEGES ON DATABASE highpeak TO highpeak_user;"
```

## Step 3: Enable pgvector Extension

This is needed for AI embeddings (chatbot knowledge retrieval).

```bash
# Connect to the database
psql -U postgres -d highpeak

# Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify installation
\dx

# Exit
\q
```

## Step 4: Configure Environment Variables

Create `.env.local` in project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL=postgresql://highpeak_user:secure_password@localhost:5432/highpeak

# Payload CMS
PAYLOAD_SECRET=your-very-secure-secret-key-at-least-32-characters

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

**For Production**, use:
```env
DATABASE_URL=postgresql://highpeak_user:secure_password@your-managed-db-host:5432/highpeak
NEXT_PUBLIC_SITE_URL=https://highpeak.co.ke
NODE_ENV=production
```

## Step 5: Initialize Database Schema

Install dependencies:
```bash
npm install
```

Run Payload migrations (creates all tables):
```bash
npm run payload:migrate
```

This will:
- Create all collection tables
- Set up relationships
- Create indexes
- Initialize vector columns for embeddings

## Step 6: Create Admin User

```bash
npm run payload:create-user
```

This interactive command will prompt for:
- Email address (admin account)
- Password (secure password)
- Role selection

## Step 7: Start Development Server

```bash
npm run dev
```

Access:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

## Database Schema

### Core Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| projects | Architecture projects | title, slug, category, location, year |
| services | Services offered | name, slug, description |
| articles | Journal/blog posts | title, slug, body, author |
| media | Media assets | file, alt text, metadata |
| leads | Enquiry management | name, email, projectType, status |
| users | Team members | email, name, role |
| chat_conversations | Chat history | messages, intent, status |
| chat_requests | Chatbot requests | type, status, priority |
| faqs | FAQ database | question, answer, category |

### Relationships

```
leads → chat_conversations (one-to-many)
chat_requests → leads (one-to-one)
chat_requests → users (assignment)
articles → projects (related content)
services → projects (related content)
faqs → services (one-to-one)
faqs → projects (one-to-one)
```

### Indexes

Automatic indexes on:
- `slug` fields (unique)
- `published` status
- `createdAt` timestamps
- `chatbotVisible` flags
- Lead status and source

## Backup & Recovery

### Backup Database

```bash
# Full backup
pg_dump -U highpeak_user -d highpeak > backup.sql

# Compressed backup
pg_dump -U highpeak_user -d highpeak | gzip > backup.sql.gz

# With verbose output
pg_dump -U highpeak_user -d highpeak -v > backup_verbose.sql
```

### Restore Database

```bash
# From SQL file
psql -U highpeak_user -d highpeak < backup.sql

# From compressed file
gunzip -c backup.sql.gz | psql -U highpeak_user -d highpeak

# Before restore, drop and recreate database
psql -U postgres -c "DROP DATABASE highpeak;"
psql -U postgres -c "CREATE DATABASE highpeak;"
```

## Monitoring & Maintenance

### Check Database Size

```bash
psql -U postgres -d highpeak -c "SELECT pg_size_pretty(pg_database_size('highpeak'));"
```

### View Active Connections

```bash
psql -U postgres -d highpeak -c "SELECT * FROM pg_stat_activity;"
```

### Vacuum & Analyze (Maintenance)

```bash
psql -U highpeak_user -d highpeak -c "VACUUM ANALYZE;"
```

## Troubleshooting

### Connection Refused

**Issue**: `could not connect to server: Connection refused`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

### Authentication Failed

**Issue**: `FATAL: password authentication failed`

**Solution**:
1. Verify password in `.env.local`
2. Reset user password:
```bash
psql -U postgres -d highpeak -c "ALTER ROLE highpeak_user WITH PASSWORD 'new_password';"
```

### Database Does Not Exist

**Issue**: `database "highpeak" does not exist`

**Solution**:
```bash
# Create database
createdb -U postgres highpeak
```

### pgvector Not Found

**Issue**: `ERROR: extension "vector" does not exist`

**Solution**:
```bash
# Install pgvector
sudo apt-get install postgresql-contrib

# Then enable in database
psql -U postgres -d highpeak -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## Production Deployment

For Vercel + AWS RDS PostgreSQL:

1. Create RDS PostgreSQL instance
2. Note endpoint, username, password
3. Add to environment variables:
   ```
   DATABASE_URL=postgresql://username:password@endpoint:5432/highpeak
   ```
4. Deploy to Vercel
5. Run migrations in production (if needed):
   ```bash
   npm run payload:migrate -- production
   ```

## Next Steps

1. ✅ Create database and user
2. ✅ Enable pgvector extension
3. ✅ Configure .env.local
4. ✅ Run migrations
5. ✅ Create admin user
6. Start Payload CMS: `npm run dev`
7. Access admin panel at `/admin`
8. Create initial content (projects, services, articles)
9. Configure chatbot knowledge base
