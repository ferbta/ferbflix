# Film Management Application

A Netflix-style film management web application built with Next.js, MongoDB, Prisma, and Tailwind CSS.

## Features

- 🎬 **Film Management**: Add, edit, and delete films with ease
- 🔍 **Search**: Search films by Vietnamese or English name
- 🎯 **Filter**: Filter films by status (Completed, Not Completed, Downloaded)
- 🎨 **Netflix-inspired UI**: Dark theme with smooth animations and hover effects
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ⚡ **Optimistic UI**: Instant feedback for better user experience
- 🎭 **Status Badges**: Color-coded status indicators

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## Prerequisites

- Node.js 18+ (currently using 20.9.0)
- MongoDB database (MongoDB Atlas or local instance)
- npm or yarn

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /Users/ferb/.gemini/antigravity/playground/ferbflix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `DATABASE_URL` in `.env` with your MongoDB connection string:
     ```
     DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/filmdb?retryWrites=true&w=majority"
     ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push the schema to your database**:
   ```bash
   npx prisma db push
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
ferbflix/
├── app/
│   ├── api/
│   │   └── films/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts      # PATCH, DELETE endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard page
├── components/
│   ├── FilmCard.tsx              # Film card component
│   ├── FilmModal.tsx             # Add/Edit modal
│   ├── SearchBar.tsx             # Search input
│   ├── FilterDropdown.tsx        # Status filter
│   ├── LoadingSpinner.tsx        # Loading state
│   └── EmptyState.tsx            # Empty state
├── lib/
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   └── film.ts                   # TypeScript types
└── .env                          # Environment variables
```

## Database Schema

```prisma
model Film {
  id             String     @id @default(auto()) @map("_id") @db.ObjectId
  vietnameseName String
  englishName    String
  episodeCount   Int
  imageUrl       String
  filmUrl        String
  status         FilmStatus
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

enum FilmStatus {
  COMPLETED
  NOT_COMPLETED
  DOWNLOADED
}
```

## API Endpoints

### GET /api/films
Fetch all films with optional search and filter parameters.

**Query Parameters:**
- `search` (optional): Search by Vietnamese or English name
- `status` (optional): Filter by status (COMPLETED, NOT_COMPLETED, DOWNLOADED)

### POST /api/films
Create a new film.

**Request Body:**
```json
{
  "vietnameseName": "string",
  "englishName": "string",
  "episodeCount": number,
  "imageUrl": "string",
  "filmUrl": "string",
  "status": "COMPLETED" | "NOT_COMPLETED" | "DOWNLOADED"
}
```

### PATCH /api/films/[id]
Update an existing film.

**Request Body:** (all fields optional)
```json
{
  "vietnameseName": "string",
  "englishName": "string",
  "episodeCount": number,
  "imageUrl": "string",
  "filmUrl": "string",
  "status": "COMPLETED" | "NOT_COMPLETED" | "DOWNLOADED"
}
```

### DELETE /api/films/[id]
Delete a film by ID.

## Usage

1. **Add a Film**: Click the "Thêm phim" button to open the modal and fill in the film details
2. **Search**: Type in the search bar to find films by name (Vietnamese or English)
3. **Filter**: Use the dropdown to filter films by status
4. **Edit**: Hover over a film card and click "Chỉnh sửa"
5. **Delete**: Hover over a film card and click "Xóa"

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the `DATABASE_URL` environment variable
4. Deploy

### Other Platforms

Ensure the platform supports:
- Node.js 18+
- Environment variables
- MongoDB connection

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |

## Troubleshooting

### Prisma Client Issues
If you encounter Prisma client errors, regenerate the client:
```bash
npx prisma generate
```

### Database Connection Issues
- Verify your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that the database user has proper permissions

### Build Errors
Clear the Next.js cache and rebuild:
```bash
rm -rf .next
npm run build
```

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
