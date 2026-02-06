import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FilmStatus } from '@/types/film';

// GET /api/films - Fetch all films with optional search and filter
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') as FilmStatus | null;

        const where: any = {};

        // Search by Vietnamese or English name
        if (search) {
            where.OR = [
                { vietnameseName: { contains: search, mode: 'insensitive' } },
                { englishName: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by status
        if (status && Object.values(FilmStatus).includes(status)) {
            where.status = status;
        }

        const films = await prisma.film.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(films);
    } catch (error) {
        console.error('Error fetching films:', error);
        return NextResponse.json(
            { error: 'Failed to fetch films' },
            { status: 500 }
        );
    }
}

// POST /api/films - Create a new film
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { vietnameseName, englishName, episodeCount, imageUrl, filmUrl, status } = body;

        // Validation
        if (!vietnameseName || !englishName || !episodeCount || !imageUrl || !filmUrl || !status) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (!Object.values(FilmStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status value' },
                { status: 400 }
            );
        }

        const film = await prisma.film.create({
            data: {
                vietnameseName,
                englishName,
                episodeCount: parseInt(episodeCount),
                imageUrl,
                filmUrl,
                status,
            },
        });

        return NextResponse.json(film, { status: 201 });
    } catch (error) {
        console.error('Error creating film:', error);
        return NextResponse.json(
            { error: 'Failed to create film' },
            { status: 500 }
        );
    }
}
