export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <svg
                className="w-24 h-24 text-zinc-700 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
            </svg>
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                Không tìm thấy phim nào
            </h3>
            <p className="text-zinc-500">
                Thử thay đổi bộ lọc hoặc thêm phim mới
            </p>
        </div>
    );
}
