import axios from "@/utils/axiosConfig";

const API_BASE = "https://work-garage-sufficient-pgp.trycloudflare.com";

export const pickedUpTicketStaffService = {
    // Lấy danh sách ticket đã nhận sách (PICKED_UP)
    getPickedUpTickets: async () => {
        try {
            const res = await axios.get(`${API_BASE}/borrow-ticket?status=PICKED_UP`);
            return res.data.data.map((t) => ({
                id: t.ticket_id,
                cardId: t.ticket_code,
                userName: t.user?.full_name || t.member?.full_name || "—",
                email: t.user?.email || t.member?.email || "",
                status: "picked_up",
                originalStatus: t.status,
                quantity: t.items ? t.items.length : 0,
                pickedUpAt: t.picked_up_at,
                dueDate: t.due_date,
                isOverdue: t.is_overdue || false
            }));
        } catch (error) {
            console.error("Error fetching picked-up tickets:", error);
            return [];
        }
    },

    // Lấy chi tiết ticket
    getTicketDetail: async (ticketId) => {
        try {
            const res = await axios.get(`${API_BASE}/borrow-ticket/${ticketId}`);
            const data = res.data.data;

            return {
                ticketId: data.ticket_id,
                user: {
                    name: data.member.full_name,
                    email: data.member.email,
                    cardId: data.member.member_id,
                    phone: data.member.phone || "—",
                },
                books: data.items.map((item) => ({
                    id: item.copy.id,
                    bookId: item.book.book_id,
                    name: item.book.title,
                    image: item.book.cover_url ? `${API_BASE}/public/${item.book.cover_url}` : null,
                    status: item.status.toLowerCase(),
                    copyNote: item.copy.note,
                    author: "—",
                    category: "—"
                })),
                quantity: data.items.length,
                requestedAt: data.requested_at,
                approvedAt: data.approved_at,
                pickupExpiresAt: data.pickup_expires_at,
                pickedUpAt: data.picked_up_at,
                dueDate: data.due_date,
            };
        } catch (error) {
            console.error("Error fetching ticket detail:", error);
            return null;
        }
    },

    // Cập nhật trạng thái sang RETURNED (Trả sách)
    updateStatus: (id, status = "RETURNED") => {
        return axios.put(
            `${API_BASE}/borrow-ticket/${id}/staff`,
            { status }
        );
    }
};
