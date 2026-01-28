import axios from "@/utils/axiosConfig";

const API_BASE = "https://place-potentially-downloaded-lyrics.trycloudflare.com";

export const approvedTicketStaffService = {
    // Lấy danh sách ticket APPROVED (để duyệt trả sách)
    getApprovedTickets: async () => {
        try {
            const res = await axios.get(`${API_BASE}/borrow-ticket?status=APPROVED`);

            // Map data từ API approved
            return res.data.data.map((t) => ({
                id: t.ticket_id,
                cardId: t.ticket_code,
                userName: t.user?.full_name || "—",
                email: t.user?.email || "",
                status: "approved", // Map sang trạng thái 'approved' để hiện nút "Duyệt nhận" trên UI
                originalStatus: t.status, // Giữ status gốc nếu cần
                quantity: 0, // API list approved không có quantity items, mặc định 0 hoặc cần xử lý sau
                // Note: JSON mẫu không có items list ở level này, có thể cần lấy từ detail hoặc giả định
                returnedCount: 0,
                expirationDate: t.pickup_expires_at, // Hạn lấy sách
                isOverdue: t.is_overdue || false
            }));
        } catch (error) {
            console.error("Error fetching approved tickets:", error);
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
                    id: item.copy.id, // ID của bản sao
                    bookId: item.book.book_id,
                    name: item.book.title,
                    image: item.book.cover_url ? `${API_BASE}/public/${item.book.cover_url}` : null,
                    status: item.status.toLowerCase(),
                    copyNote: item.copy.note,
                    author: "—", // API chưa trả về tác giả
                    category: "—"
                })),
                quantity: data.items.length,
                requestedAt: data.requested_at,
                approvedAt: data.approved_at,
                pickupExpiresAt: data.pickup_expires_at,
                dueDate: data.due_date,
            };
        } catch (error) {
            console.error("Error fetching ticket detail:", error);
            return null;
        }
    },
    // Cập nhật trạng thái ticket
    updateStatus: (id, status) => {
        return axios.put(
            `${API_BASE}/borrow-ticket/${id}/staff`,
            { status }
        );
    }
};
