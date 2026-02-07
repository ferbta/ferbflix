'use client';

import { useState, useEffect, useCallback } from 'react';
import FilmCard from '@/components/FilmCard';
import FilmModal from '@/components/FilmModal';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Film, FilmStatus, CreateFilmInput } from '@/types/film';

export default function Home() {
    const [films, setFilms] = useState<Film[]>([]);
    const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFilm, setEditingFilm] = useState<Film | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilmStatus | ''>('');

    // Fetch films
    const fetchFilms = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/films?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch films');

            const data = await response.json();

            // Sort films: DOWNLOADED at the end, others first (maintaining chronological order)
            const sortedData = data.sort((a: Film, b: Film) => {
                // If one is DOWNLOADED and the other isn't, DOWNLOADED goes to the end
                if (a.status === 'DOWNLOADED' && b.status !== 'DOWNLOADED') return 1;
                if (a.status !== 'DOWNLOADED' && b.status === 'DOWNLOADED') return -1;
                // Otherwise maintain original order (chronological)
                return 0;
            });

            setFilms(sortedData);
            setFilteredFilms(sortedData);
        } catch (error) {
            console.error('Error fetching films:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, statusFilter]);

    useEffect(() => {
        fetchFilms();
    }, [fetchFilms]);

    // Handle add/edit film
    const handleSubmit = async (data: CreateFilmInput) => {
        try {
            if (editingFilm) {
                // Update existing film
                const response = await fetch(`/api/films/${editingFilm.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw new Error('Failed to update film');

                const updatedFilm = await response.json();
                setFilms(prev => prev.map(f => f.id === updatedFilm.id ? updatedFilm : f));
                setFilteredFilms(prev => prev.map(f => f.id === updatedFilm.id ? updatedFilm : f));
            } else {
                // Create new film
                const response = await fetch('/api/films', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw new Error('Failed to create film');

                const newFilm = await response.json();
                setFilms(prev => [newFilm, ...prev]);
                setFilteredFilms(prev => [newFilm, ...prev]);
            }

            setIsModalOpen(false);
            setEditingFilm(null);
        } catch (error) {
            console.error('Error submitting film:', error);
            throw error;
        }
    };

    // Handle delete film
    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phim này?')) return;

        try {
            const response = await fetch(`/api/films/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete film');

            setFilms(prev => prev.filter(f => f.id !== id));
            setFilteredFilms(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting film:', error);
        }
    };

    // Handle edit film
    const handleEdit = (film: Film) => {
        setEditingFilm(film);
        setIsModalOpen(true);
    };

    // Handle add new film
    const handleAddNew = () => {
        setEditingFilm(null);
        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-red-900/20 to-purple-900/20 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                        Ferbflix
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base md:text-lg">
                        Khám phá và quản lý bộ sưu tập phim của bạn
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Search, Filter, and Add Button - All in one line on desktop */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 sm:mb-8">
                    {/* Search */}
                    <div className="flex-1">
                        <SearchBar onSearch={setSearchQuery} />
                    </div>

                    {/* Filter */}
                    <div className="w-full md:w-48 lg:w-64">
                        <FilterDropdown onFilterChange={setStatusFilter} currentFilter={statusFilter} />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddNew}
                        className="w-full md:w-auto px-6 py-3 md:py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm md:text-base">Thêm phim</span>
                    </button>
                </div>

                {/* Film Grid */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : filteredFilms.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {filteredFilms.map((film) => (
                            <FilmCard
                                key={film.id}
                                film={film}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <FilmModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingFilm(null);
                }}
                onSubmit={handleSubmit}
                film={editingFilm}
            />
        </main>
    );
}
