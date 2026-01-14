export default function UserActions({ 
    isLocked, 
    isChanged, 
    onToggleStatus, 
    onSave, 
    onClose 
}) {
    return (
        <div className="flex justify-center gap-8 mt-8">
            <button
                onClick={onToggleStatus}
                className={`px-8 py-3 rounded-full font-semibold text-lg ${
                    isLocked
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-500 text-white hover:bg-red-600"
                } transition-colors`}
            >
                {isLocked ? "🔓 Mở khóa tài khoản" : "🔒 Khóa tài khoản"}
            </button>

            <button
                onClick={onSave}
                disabled={!isChanged}
                className="px-10 py-3 rounded-full bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                💾 Lưu thay đổi
            </button>

            <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
                ↩️ Quay lại
            </button>
        </div>
    );
}