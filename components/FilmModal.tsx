'use client';

import { useState, useEffect } from 'react';
import { Film, FilmStatus, CreateFilmInput } from '@/types/film';

interface FilmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateFilmInput) => Promise<void>;
    film?: Film | null;
}

export default function FilmModal({ isOpen, onClose, onSubmit, film }: FilmModalProps) {
    const [formData, setFormData] = useState<CreateFilmInput>({
        vietnameseName: '',
        englishName: '',
        episodeCount: 0,
        imageUrl: '',
        filmUrl: '',
        status: FilmStatus.NOT_COMPLETED,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (film) {
            setFormData({
                vietnameseName: film.vietnameseName,
                englishName: film.englishName,
                episodeCount: film.episodeCount,
                imageUrl: film.imageUrl,
                filmUrl: film.filmUrl,
                status: film.status,
            });
        } else {
            setFormData({
                vietnameseName: '',
                englishName: '',
                episodeCount: 0,
                imageUrl: '',
                filmUrl: '',
                status: FilmStatus.NOT_COMPLETED,
            });
        }
        setErrors({});
    }, [film, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.vietnameseName.trim()) {
            newErrors.vietnameseName = 'Tên tiếng Việt là bắt buộc';
        }
        if (!formData.englishName.trim()) {
            newErrors.englishName = 'Tên tiếng Anh là bắt buộc';
        }
        if (!formData.episodeCount || formData.episodeCount < 1) {
            newErrors.episodeCount = 'Số tập phải lớn hơn 0';
        }
        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'URL hình ảnh là bắt buộc';
        }
        if (!formData.filmUrl.trim()) {
            newErrors.filmUrl = 'URL phim là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'episodeCount' ? parseInt(value) || 0 : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        {film ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Vietnamese Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Tên tiếng Việt <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="vietnameseName"
                            value={formData.vietnameseName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Nhập tên phim bằng tiếng Việt"
                        />
                        {errors.vietnameseName && (
                            <p className="mt-1 text-sm text-red-500">{errors.vietnameseName}</p>
                        )}
                    </div>

                    {/* English Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Tên tiếng Anh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="englishName"
                            value={formData.englishName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Enter film name in English"
                        />
                        {errors.englishName && (
                            <p className="mt-1 text-sm text-red-500">{errors.englishName}</p>
                        )}
                    </div>

                    {/* Episode Count */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Số tập <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="episodeCount"
                            value={formData.episodeCount}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Nhập số tập"
                        />
                        {errors.episodeCount && (
                            <p className="mt-1 text-sm text-red-500">{errors.episodeCount}</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            URL hình ảnh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="https://example.com/poster.jpg"
                        />
                        {errors.imageUrl && (
                            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
                        )}
                    </div>

                    {/* Film URL */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            URL phim <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="filmUrl"
                            value={formData.filmUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="https://example.com/film"
                        />
                        {errors.filmUrl && (
                            <p className="mt-1 text-sm text-red-500">{errors.filmUrl}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                            <option value={FilmStatus.NOT_COMPLETED}>Còn tiếp</option>
                            <option value={FilmStatus.COMPLETED}>Hoàn thành</option>
                            <option value={FilmStatus.DOWNLOADED}>Đã tải xuống</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang lưu...' : film ? 'Cập nhật' : 'Thêm phim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
