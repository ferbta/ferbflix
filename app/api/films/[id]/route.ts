import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FilmStatus } from '@/types/film';

// PATCH /api/films/[id] - Update a film
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { vietnameseName, englishName, episodeCount, imageUrl, filmUrl, status } = body;

        const updateData: any = {};
        if (vietnameseName) updateData.vietnameseName = vietnameseName;
        if (englishName) updateData.englishName = englishName;
        if (episodeCount) updateData.episodeCount = parseInt(episodeCount);
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (filmUrl) updateData.filmUrl = filmUrl;
        if (status && Object.values(FilmStatus).includes(status)) {
            updateData.status = status;
        }

        const film = await prisma.film.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(film);
    } catch (error) {
        console.error('Error updating film:', error);
        return NextResponse.json(
            { error: 'Failed to update film' },
            { status: 500 }
        );
    }
}

// DELETE /api/films/[id] - Delete a film
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.film.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Film deleted successfully' });
    } catch (error) {
        console.error('Error deleting film:', error);
        return NextResponse.json(
            { error: 'Failed to delete film' },
            { status: 500 }
        );
    }
}
