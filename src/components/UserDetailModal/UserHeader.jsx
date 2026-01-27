import InfoRow from "./InfoRow";

export default function UserHeader({ user, status }) {
    return (
        <div className="flex gap-8 mb-8">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl shrink-0">
                👤
            </div>

            <div className="text-primary space-y-3 min-w-0">
                <InfoRow label="Tên" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="ID" value={user.id} />
                <InfoRow label="Số điện thoại" value={user.phone || "—"} />
                <InfoRow label="Ngày tham gia" value={user.date || "—"} />

                <div className="flex gap-4 items-center mt-2">
                    <span className="font-semibold w-32">Trạng thái:</span>
                    <span
                        className={`font-semibold text-lg ${status === "active"
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                    >
                        {status === "active" ? "Hoạt động" : "Bị khóa"}
                    </span>
                </div>
            </div>
        </div>
    );
}