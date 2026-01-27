import axios from "@/utils/axiosConfig";

const API_BASE = "https://place-potentially-downloaded-lyrics.trycloudflare.com";

export const canceledTicketStaffService = {
    // Lấy danh sách ticket CANCELLED
    getCanceledTickets: async () => {
        try {
            const res = await axios.get(
                `${API_BASE}/borrow-ticket/?status=CANCELLED`
            );

            // Chuẩn hóa dữ liệu cho UI
            return res.data.data.map((item) => ({
                id: item.ticket_id,
                cardId: item.ticket_code,
                code: item.ticket_code,
                status: item.status, // "CANCELLED"
                userName: item.user.full_name,
                email: item.user.email || "—",
                requestedAt: item.requested_at,
                // Cancelled tickets might not have expiration dates relevant, maybe request date is more important

                // Các field UI hay dùng
                quantity: 0,
                checked: false,
            }));
        } catch (error) {
            console.error("Error fetching canceled tickets:", error);
            return [];
        }
    },

    // Lấy chi tiết ticket (mở modal)
    getCanceledTicketDetail: async (ticketId) => {
        try {
            const res = await axios.get(
                `${API_BASE}/borrow-ticket/${ticketId}`
            );
            const data = res.data.data;

            return {
                id: data.ticket_id,
                code: data.ticket_code,
                status: data.status,

                member: {
                    name: data.member.full_name,
                    email: data.member.email,
                    cardId: data.member.member_id,
                    phone: data.member.phone || "—",
                },

                items: data.items.map((item) => ({
                    copyId: item.copy.id,
                    note: item.copy.note,
                    bookId: item.book.book_id,
                    title: item.book.title,
                    cover: item.book.cover_url ? `${API_BASE}/public/${item.book.cover_url}` : null,
                    status: item.status,
                })),

                quantity: data.items.length,
                requestedAt: data.requested_at,
            };
        } catch (error) {
            console.error("Error fetching canceled ticket detail:", error);
            return null;
        }
    },
};
