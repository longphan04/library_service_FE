import { useEffect, useState, useCallback } from "react";
import UserHeader from "./UserHeader";
import BookHistory from "./BookHistory";
import UserActions from "./UserActions";
import { userManagementStaffService } from "@/services/userManagementStaff.service";
import Spinner from "@/components/ui/Spinner";

export default function UserDetailModal({ user, onClose, onSave }) {
    const [status, setStatus] = useState(user.status);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userManagementStaffService.getUserBorrowHistory(user.id);
            setHistoryData(data);
        } catch (err) {
            console.error("Error fetching user history:", err);
            setError("Không thể tải lịch sử mượn sách");
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    /* ================= ESC CLOSE ================= */
    useEffect(() => {
        const esc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [onClose]);

    useEffect(() => {
        setStatus(user.status);
    }, [user]);

    const isLocked = status === "locked";
    const isChanged = status !== user.status;

    const toggleStatus = () => {
        setStatus((prev) => (prev === "locked" ? "active" : "locked"));
    };

    const handleSave = () => {
        onSave({ ...user, status });
        onClose();
    };

    const sendWarning = (historyId) => {
        console.log(`Gửi cảnh báo cho lịch sử mượn #${historyId}`);
        alert(`Đã gửi cảnh báo cho lịch sử mượn #${historyId}`);
    };

    // Prepare user info for header from API or fallback to list data
    const apiUserInfo = historyData?.user || {};
    const displayUser = {
        ...user,
        name: apiUserInfo.full_name || user.name,
        email: apiUserInfo.email || user.email,
        id: apiUserInfo.member_id || user.id,
    };

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-bg-app w-[960px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl p-8"
            >
                <UserHeader user={displayUser} status={status} />

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        {error}
                        <button
                            onClick={fetchHistory}
                            className="ml-4 text-primary hover:underline"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <BookHistory
                        histories={historyData?.data || []}
                        onSendWarning={sendWarning}
                    />
                )}

                <UserActions
                    isLocked={isLocked}
                    isChanged={isChanged}
                    onToggleStatus={toggleStatus}
                    onSave={handleSave}
                    onClose={onClose}
                />
            </div>
        </div>
    );
}