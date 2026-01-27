import { useEffect, useState, useCallback } from "react";
import UserHeader from "./UserHeader";
import BookHistory from "./BookHistory";
import UserActions from "./UserActions";
import { userManagementStaffService } from "@/services/userManagementStaff.service";
import Spinner from "@/components/ui/Spinner";
import ConfirmModal from "@/components/modal/ConfirmModal";

export default function UserDetailModal({ user, onClose, onSave }) {
    const [status, setStatus] = useState(user.status);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

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
        setShowConfirm(true);
    };

    const confirmToggle = () => {
        const nextStatus = status === "locked" ? "active" : "locked";
        onSave({ ...user, status: nextStatus });
        setStatus(nextStatus);
        setShowConfirm(false);
    };

    const sendWarning = (historyId) => {
        console.log(`Gửi cảnh báo cho lịch sử mượn #${historyId}`);
        alert(`Đã gửi cảnh báo cho lịch sử mượn #${historyId}`);
    };

    // Prepare user info for header from API or fallback to list data
    const profile = historyData?.data || {};
    const apiUserInfo = profile.user || {};

    const displayUser = {
        ...user,
        name: profile.full_name || user.name,
        email: apiUserInfo.email || user.email,
        id: profile.member_id || user.id,
        avatar: profile.avatar_url || user.avatar
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
                    onSave={() => { }} // Not used in UserActions.jsx but kept for prop consistency
                    onClose={onClose}
                />
            </div>

            <ConfirmModal
                open={showConfirm}
                title={`Bạn có chắc chắn muốn ${status === "locked" ? "mở khóa" : "khóa"} tài khoản người dùng này?`}
                confirmVariant={status === "active" ? "danger" : "success"}
                onConfirm={confirmToggle}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}