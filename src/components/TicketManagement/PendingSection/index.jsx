import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PendingTicketTable from "./components/PendingTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import useNotiStaff from "@/hooks/useNotiStaff";
import { borrowTicketStaffService } from "@/services/borrowTicketStaff.service";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

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

  const { clearNotification } = useNotiStaff();

  useEffect(() => {
    clearNotification();
  }, []);

  // Filter chỉ lấy pending và rejected tickets
  const filteredTickets = allTickets
    .filter((t) => t.status === "pending" || t.status === "rejected")
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase())
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

  const confirmSelected = async () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);

    for (const id of selectedIds) {
      await borrowTicketStaffService.updateStatus(id, "APPROVED");
      updateTicketStatus(id, "APPROVED");
    }

    if (refreshData) refreshData();
    setCheckedTickets({});
  };

  const rejectSelected = async () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);

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
  };

  const confirmOne = async (id) => {
    try {
      await borrowTicketStaffService.updateStatus(id, "APPROVED");

      // Xóa ticket khỏi danh sách pending
      updateTicketStatus(id, "APPROVED");
      if (refreshData) refreshData();

      setCheckedTickets(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error(err);
      alert("Duyệt phiếu thất bại");
    }
  };

  const rejectOne = async (id) => {
    try {
      await borrowTicketStaffService.updateStatus(id, "CANCELLED");

      updateTicketStatus(id, "CANCELLED");
      if (refreshData) refreshData();
      setCheckedTickets(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error(err);
      alert("Từ chối phiếu thất bại");
    }
  };

  const {
    currentItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
    resetPage,
  } = usePagination(filteredTickets, 6);

  useEffect(() => {
    resetPage();
  }, [search]);


  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <ActionButtons
          onConfirm={confirmSelected}
          onReject={rejectSelected}
          confirmLabel="Xác nhận"
          showReject={true}
          disabled={Object.values(checkedTickets).every(v => !v)}
        />
      </div>

      <PendingTicketTable
        tickets={currentItems}
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
        onConfirm={handleConfirmTicket}
        onReject={handleRejectTicket}
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
    </>
  );
}