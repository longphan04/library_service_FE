import axios from "@/utils/axiosConfig";

const API_BASE = "https://place-potentially-downloaded-lyrics.trycloudflare.com";

export const borrowTicketStaffService = {
    // Lấy danh sách ticket pending
    getPendingTickets: async () => {
        const res = await axios.get(
            `${API_BASE}/borrow-ticket?status=Pending`
        );

        return res.data.data.map((t) => ({
            id: t.ticket_id,
            cardId: t.ticket_code,
            userName: t.user?.full_name || "—",
            email: t.user?.email || "",
            status: t.status.toLowerCase(),
            requested_at: t.requested_at,
        }));
    },

    // Lấy danh sách đang mượn
    getBorrowingTickets: async () => {
        const res = await axios.get(
            `${API_BASE}/borrow-ticket?status=BORROWED`
        );

        return res.data.data.map((t) => ({
            id: t.ticket_id,
            cardId: t.ticket_code,
            userName: t.user?.full_name || "—",
            email: t.user?.email || "",
            quantity: t.items ? t.items.length : 0,
            expirationDate: t.pickup_expires_at, // Hạn lấy sách/trả sách
            isOverdue: t.is_overdue || false,
        }));
    },

    // Lấy danh sách đã trả
    getApprovedHistoryTickets: async () => {
        const res = await axios.get(
            `${API_BASE}/borrow-ticket?status=RETURNED`
        );

        return res.data.data.map((t) => ({
            id: t.ticket_id,
            cardId: t.ticket_code,
            userName: t.user?.full_name || "—",
            email: t.user?.email || "",
            status: t.status.toLowerCase(), // returned
            quantity: t.items ? t.items.length : 0,
            expirationDate: t.due_date, // Hạn trả (để tham khảo)
            approvedAt: t.approved_at,
            returnedAt: t.picked_up_at,
        }));
    },

    // Lấy chi tiết 1 ticket (modal)
    getTicketDetail: async (ticketId) => {
        const res = await axios.get(
            `${API_BASE}/borrow-ticket/${ticketId}`
        );

        const data = res.data.data;

        return {
            ticketId: data.ticket_id,
            user: {
                name: data.member.full_name,
                email: data.member.email,
                cardId: data.ticket_code,
            },
            books: data.items.map((item) => ({
                id: item.book.book_id,
                name: item.book.title,
                image: `${API_BASE}/public/${item.book.cover_url}`,
                author: "—",
                category: "—",
                quantity: 1,
            })),
        };
    },

    updateStatus(id, status) {
        return axios.put(
            `${API_BASE}/borrow-ticket/${id}/staff`,
            { status }
        );
    }
};
