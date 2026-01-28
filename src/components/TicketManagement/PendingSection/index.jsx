import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PendingTicketTable from "./components/PendingTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import useNotiStaff from "@/hooks/useNotiStaff";
import { borrowTicketStaffService } from "@/services/borrowTicketStaff.service";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/modal/ConfirmModal";

export default function PendingSection({
  allTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  refreshData
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", onConfirm: () => { } });
  const [showReject, setShowReject] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { clearNotification } = useNotiStaff();

  const handleReload = async () => {
    setLoading(true);
    try {
      if (refreshData) {
        await refreshData();
      }
      setSearch("");
    } finally {
      setTimeout(() => setLoading(false), 500); // Thêm delay nhỏ để thấy hiệu ứng
    }
  };

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    clearNotification();
  }, []);

  // Filter chỉ lấy pending và rejected tickets
  const filteredTickets = allTickets
    .filter((t) => t.status === "pending" || t.status === "rejected")
    .filter((t) =>
      t.userName?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toString().includes(search)
    )
    .map(ticket => ({
      ...ticket,
      checked: checkedTickets[ticket.id] || false
    }));

  const allChecked = filteredTickets.length > 0 &&
    filteredTickets.every((t) => t.checked);

  const toggleAll = (checked) => {
    const newChecked = {};
    filteredTickets.forEach(ticket => {
      newChecked[ticket.id] = checked;
    });
    setCheckedTickets(prev => ({ ...prev, ...newChecked }));
  };

  const toggleOne = (id, checked) => {
    setCheckedTickets(prev => ({ ...prev, [id]: checked }));
  };

  // Mở modal xem chi tiết ticket
  const handleViewTicket = async (ticket) => {
    const detail = await borrowTicketStaffService.getTicketDetail(ticket.id);

    setSelectedTicket({
      ...ticket,
      userInfo: detail.user,
      books: detail.books,
    });

    setIsModalOpen(true);
  };

  // Xác nhận toàn bộ ticket từ modal
  const handleConfirmTicket = async (ticketId) => {
    try {
      await borrowTicketStaffService.updateStatus(ticketId, "APPROVED");

      updateTicketStatus(ticketId, "APPROVED");
      if (refreshData) refreshData();

      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error(err);
      alert("Duyệt phiếu thất bại");
    }
  };

  // Từ chối toàn bộ ticket từ modal
  const handleRejectTicket = async (ticketId) => {
    try {
      await borrowTicketStaffService.updateStatus(ticketId, "CANCELLED");

      updateTicketStatus(ticketId, "CANCELLED");
      if (refreshData) refreshData();
      setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error(err);
      alert("Từ chối phiếu thất bại");
    }
  };

  const confirmSelected = () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);

    if (selectedIds.length === 0) return;

    setConfirmConfig({
      title: `Bạn có chắc chắn muốn duyệt ${selectedIds.length} phiếu đã chọn?`,
      onConfirm: async () => {
        for (const id of selectedIds) {
          await borrowTicketStaffService.updateStatus(id, "APPROVED");
          updateTicketStatus(id, "APPROVED");
        }
        if (refreshData) refreshData();
        setCheckedTickets({});
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const rejectSelected = () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);

    if (selectedIds.length === 0) return;

    setConfirmConfig({
      title: `Bạn có chắc chắn muốn từ chối ${selectedIds.length} phiếu đã chọn?`,
      onConfirm: async () => {
        try {
          for (const id of selectedIds) {
            await borrowTicketStaffService.updateStatus(id, "CANCELLED");
            updateTicketStatus(id, "CANCELLED");
          }
          if (refreshData) refreshData();
          setCheckedTickets({});
        } catch (err) {
          console.error(err);
          alert("Từ chối các phiếu đã chọn thất bại");
        }
        setShowReject(false);
      }
    });
    setShowReject(true);
  };

  const confirmOne = (id) => {
    setConfirmConfig({
      title: "Bạn có chắc chắn muốn duyệt phiếu mượn này?",
      onConfirm: async () => {
        try {
          await borrowTicketStaffService.updateStatus(id, "APPROVED");
          updateTicketStatus(id, "APPROVED");
          if (refreshData) refreshData();
          setCheckedTickets({});
          setIsModalOpen(false);
          setSelectedTicket(null);
        } catch (err) {
          console.error(err);
          alert("Duyệt phiếu thất bại");
        }
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const rejectOne = (id) => {
    setConfirmConfig({
      title: "Bạn có chắc chắn muốn từ chối phiếu mượn này?",
      onConfirm: async () => {
        try {
          await borrowTicketStaffService.updateStatus(id, "CANCELLED");
          updateTicketStatus(id, "CANCELLED");
          if (refreshData) refreshData();
          setCheckedTickets({});
          setIsModalOpen(false);
          setSelectedTicket(null);
        } catch (err) {
          console.error(err);
          alert("Từ chối phiếu thất bại");
        }
        setShowReject(false);
      }
    });
    setShowReject(true);
  };

  // Logic phân trang
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <SearchBar search={search} setSearch={setSearch} />
          <button
            onClick={handleReload}
            className="p-3 rounded-full hover:rotate-360 transition-all duration-1000 text-primary cursor-pointer bg-white/10"
            title="Làm mới"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <ActionButtons
          onConfirm={confirmSelected}
          onReject={rejectSelected}
          confirmLabel="Xác nhận"
          showReject={true}
          disabled={Object.values(checkedTickets).every(v => !v)}
        />
      </div>

      <PendingTicketTable
        tickets={paginatedTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
        onRejectOne={rejectOne}
        onViewTicket={handleViewTicket}
      />

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onConfirm={confirmOne}
        onReject={rejectOne}
      />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        title={confirmConfig.title}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmModal
        open={showReject}
        title={confirmConfig.title}
        confirmVariant="danger"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setShowReject(false)}
      />
    </>
  );
}