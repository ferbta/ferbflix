'use client';

import { FilmStatus } from '@/types/film';

interface FilterDropdownProps {
    onFilterChange: (status: FilmStatus | '') => void;
    currentFilter: FilmStatus | '';
}

export default function FilterDropdown({ onFilterChange, currentFilter }: FilterDropdownProps) {
    return (
        <div className="relative">
            <select
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value as FilmStatus | '')}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none cursor-pointer transition-all"
            >
                <option value="">Tất cả trạng thái</option>
                <option value={FilmStatus.COMPLETED}>Hoàn thành</option>
                <option value={FilmStatus.NOT_COMPLETED}>Chưa hoàn thành</option>
                <option value={FilmStatus.DOWNLOADED}>Đã tải xuống</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                    className="h-5 w-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
}
