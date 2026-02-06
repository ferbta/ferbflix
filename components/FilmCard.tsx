'use client';

import React from 'react';
import { Film } from '@/types/film';
import Image from 'next/image';

interface FilmCardProps {
    film: Film;
    onEdit: (film: Film) => void;
    onDelete: (id: string) => void;
}

const getStatusBadge = (status: string) => {
    const badges = {
        COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/50',
        NOT_COMPLETED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        DOWNLOADED: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    };
    return badges[status as keyof typeof badges] || badges.NOT_COMPLETED;
};

const getStatusLabel = (status: string) => {
    const labels = {
        COMPLETED: 'Hoàn thành',
        NOT_COMPLETED: 'Chưa hoàn thành',
        DOWNLOADED: 'Đã tải xuống',
    };
    return labels[status as keyof typeof labels] || status;
};

export default function FilmCard({ film, onEdit, onDelete }: FilmCardProps) {
    const [showOverlay, setShowOverlay] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Close overlay when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setShowOverlay(false);
            }
        };

        if (showOverlay) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showOverlay]);

    const handleCardClick = () => {
        // Show overlay on mobile/tablet tap (first click shows, doesn't toggle)
        if (!showOverlay) {
            setShowOverlay(true);
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
            onClick={handleCardClick}
        >
            {/* Film Poster */}
            <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
                <Image
                    src={film.imageUrl}
                    alt={film.vietnameseName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Overlay on hover or tap */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(film.filmUrl, '_blank');
                                setShowOverlay(false);
                            }}
                            className="w-full bg-green-600/90 hover:bg-green-600 text-white font-semibold py-2.5 sm:py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Xem
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(film);
                                setShowOverlay(false);
                            }}
                            className="w-full bg-white/90 hover:bg-white text-black font-semibold py-2.5 sm:py-2 px-4 rounded transition-colors text-sm sm:text-base active:scale-95"
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(film.id);
                                setShowOverlay(false);
                            }}
                            className="w-full bg-red-600/90 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-2 px-4 rounded transition-colors text-sm sm:text-base active:scale-95"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>

            {/* Film Info */}
            <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <h3 className="font-bold text-white text-sm sm:text-base md:text-lg line-clamp-1" title={film.vietnameseName}>
                    {film.vietnameseName}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm line-clamp-1" title={film.englishName}>
                    {film.englishName}
                </p>

                <div className="flex items-center justify-between pt-1 sm:pt-2 gap-2">
                    {/* Episode Count Badge */}
                    <span className="px-2 py-0.5 sm:py-1 rounded text-xs font-medium border bg-purple-500/20 text-purple-400 border-purple-500/50 whitespace-nowrap">
                        {film.episodeCount} tập
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 sm:py-1 rounded text-xs font-medium border ${getStatusBadge(film.status)} whitespace-nowrap`}>
                        {getStatusLabel(film.status)}
                    </span>
                </div>
            </div>
        </div>
    );
}
