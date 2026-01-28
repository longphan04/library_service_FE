// src/hooks/notiStaff.js
import { useState } from "react";
import axios from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";

const API_URL = "https://work-garage-sufficient-pgp.trycloudflare.com/notification/";

export default function useNotiStaff() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [prevIds, setPrevIds] = useState(new Set());

    // fetch all notifications
    const fetchNotifications = async (showToast = false) => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            const data = res.data.data || [];

            // Detect new notifications
            const currentIds = new Set(data.map(n => n.notification_id));
            if (showToast && prevIds.size > 0) {
                const newItems = data.filter(n => !prevIds.has(n.notification_id) && !n.is_read);
                if (newItems.length > 0) {
                    // Trigger toast for the latest new notification
                    const latest = newItems[0];
                    if (latest.type === 'BORROW_CREATED') {
                        toast.success("🔔 Có phiếu mới cần duyệt!", {
                            duration: 5000,
                            style: {
                                background: '#7A4A2E',
                                color: '#fff',
                                fontWeight: 'bold'
                            }
                        });
                    } else {
                        toast(latest.content || "Có thông báo mới", {
                            icon: '🔔',
                            duration: 4000
                        });
                    }
                }
            }

            setPrevIds(currentIds);
            setNotifications(data);

            const count = data.filter(n => !n.is_read).length;
            setUnreadCount(count);
            return data;
        } catch (err) {
            console.error("Fetch notifications failed:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // reset / refresh
    const reset = () => {
        fetchNotifications(false);
    };

    // mark specific notification as read
    const markAsRead = async (notificationId) => {
        if (!notificationId) return;
        try {
            await axios.patch(`${API_URL}${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.notification_id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Mark notification read failed:", err);
        }
    };

    // mark all as read
    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.notification_id);
            if (unreadIds.length === 0) {
                setUnreadCount(0);
                return;
            }

            await Promise.all(unreadIds.map(id => axios.patch(`${API_URL}${id}/read`)));

            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Mark all notifications read failed:", err);
            // Fallback: clear UI anyway
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    // Clear local notifications
    const clearNotification = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    return {
        notifications,
        unreadCount,
        hasUnread: unreadCount > 0,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearNotification,
        reset
    };
}
