import { useState, useMemo, useCallback, useEffect } from "react"; // Added useEffect
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import ApprovedTicketTable from "./components/ApprovedTicketTable";
import ApprovedTicketDetailModal from "./components/ApprovedTicketDetailModal";
import Pagination from "@/components/ui/Pagination"; // Import Pagination

export default function ApprovedBookSection({
  allTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  updateApprovedCount,
  refreshData
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter
  const filteredTickets = allTickets
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    )
    .map(ticket => ({
      ...ticket,
      checked: checkedTickets[ticket.id] || false
    }));

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allChecked = paginatedTickets.length > 0 &&
    paginatedTickets.every((t) => t.checked);

  const toggleAll = (checked) => {
    const newChecked = { ...checkedTickets };
    paginatedTickets.forEach(ticket => {
      if (checked) {
        newChecked[ticket.id] = true;
      } else {
        delete newChecked[ticket.id];
      }
    });
    setCheckedTickets(newChecked);
  };

  const toggleOne = (id, checked) => {
    setCheckedTickets(prev => {
      const newState = { ...prev };
      if (checked) {
        newState[id] = true;
      } else {
        delete newState[id];
      }
      return newState;
    });
  };

  // Mở modal xem chi tiết ticket
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Xác nhận đã nhận sách từ modal (chuyển sang PICKED_UP)
  const handleConfirmApproved = (ticketId) => {
    console.log(`Xác nhận khách đã nhận sách ticket ${ticketId}`);
    updateTicketStatus(ticketId, "PICKED_UP");
    if (refreshData) refreshData();
    setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  // Cảnh báo từ modal
  const handleWarnTicket = (ticketId) => {
    console.log(`Cảnh báo ticket ${ticketId}`);
    alert(`Đã gửi cảnh báo cho ticket #${ticketId}`);
  };

  const confirmSelected = useCallback(() => {
    const selectedTickets = filteredTickets
      .filter(t => t.checked && t.status === "approved");

    if (selectedTickets.length === 0) {
      alert("Vui lòng chọn ít nhất một ticket chưa trả để xác nhận");
      return;
    }

    const selectedIds = selectedTickets.map(t => t.id);
    bulkUpdateTickets(selectedIds, "PICKED_UP");
    if (refreshData) refreshData();

    // Reset checkboxes
    setCheckedTickets(prev => {
      const newState = { ...prev };
      selectedTickets.forEach(t => {
        delete newState[t.id];
      });
      return newState;
    });
  }, [filteredTickets, bulkUpdateTickets, refreshData]);

  const confirmOne = useCallback((id) => {
    if (!id) return;

    const ticket = allTickets.find(t => t.id === id);
    if (ticket && (ticket.status === "approved" || ticket.status === "APPROVED")) {
      updateTicketStatus(id, "PICKED_UP");
      if (refreshData) refreshData();
    }
  }, [allTickets, updateTicketStatus, refreshData]);

  const handleWarnOne = (id) => {
    alert(`Đã gửi cảnh báo cho ticket #${id}`);
    console.log(`Cảnh báo ticket ${id}`);
  };

  const handleWarnSelected = () => {
    const selectedTickets = filteredTickets.filter(t => t.checked);
    if (selectedTickets.length === 0) return;
    alert(`Đã gửi cảnh báo cho ${selectedTickets.length} ticket(s)`);
  };

  const handleUpdateApprovedCount = useCallback((ticketId, newReturnedCount) => {
    if (typeof updateApprovedCount === 'function') {
      updateApprovedCount(ticketId, newReturnedCount);
    }
  }, [updateApprovedCount]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="flex gap-4">
          <ActionButtons
            onConfirm={confirmSelected}
            confirmLabel="Xác nhận"
            showReject={false}
            disabled={!Object.values(checkedTickets).some(Boolean)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <ApprovedTicketTable
          tickets={paginatedTickets}
          allChecked={allChecked}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
          onConfirmOne={confirmOne}
          onWarnOne={handleWarnOne}
          onViewTicket={handleViewTicket}
        />

        {filteredTickets.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Approved Ticket Detail Modal */}
      <ApprovedTicketDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onConfirm={handleConfirmApproved}
        onWarn={handleWarnTicket}
        onUpdateApprovedCount={handleUpdateApprovedCount}
      />
    </>
  );
}
