import { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import BookHistory from "./BookHistory";
import UserActions from "./UserActions";

export default function UserDetailModal({ user, onClose, onSave }) {
    const [status, setStatus] = useState(user.status);

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

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-bg-app w-[960px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl p-8"
            >
                <UserHeader user={user} status={status} />
                <BookHistory onSendWarning={sendWarning} />
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