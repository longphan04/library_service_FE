import { useState, useMemo, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import ReturnTicketTable from "./components/ReturnTicketTable";
import ReturnTicketDetailModal from "./components/ReturnTicketDetailModal"; // Thêm import

export default function ReturnBookSection({
  allTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  updateReturnedCount
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter chỉ lấy received và completed tickets
  const filteredTickets = allTickets
    .filter((t) => t.status === "received" || t.status === "completed")
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
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
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Xác nhận đã trả từ modal
  const handleConfirmReturn = (ticketId, returnedBooks) => {
    console.log(`Xác nhận đã trả ticket ${ticketId} với ${returnedBooks.length} sách`);
    updateTicketStatus(ticketId, "completed");
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
      .filter(t => t.checked && t.status === "received");

    if (selectedTickets.length === 0) {
      alert("Vui lòng chọn ít nhất một ticket để xác nhận");
      return;
    }

    // Set returnedCount = quantity cho mỗi ticket
    selectedTickets.forEach(ticket => {
      if (typeof updateReturnedCount === 'function') {
        updateReturnedCount(ticket.id, ticket.quantity);
      }
    });

    // Reset checkboxes
    setCheckedTickets(prev => {
      const newState = { ...prev };
      selectedTickets.forEach(t => {
        delete newState[t.id];
      });
      return newState;
    });
  }, [filteredTickets, updateReturnedCount]);

  const confirmOne = useCallback((id) => {
    if (!id) return;

    const ticket = allTickets.find(t => t.id === id);
    if (ticket && ticket.status === "received") {
      // Set returnedCount = quantity và status = completed
      if (typeof updateReturnedCount === 'function') {
        updateReturnedCount(id, ticket.quantity);
      }
    }
  }, [allTickets, updateReturnedCount]);

  const handleWarnOne = (id) => {
    alert(`Đã gửi cảnh báo cho ticket #${id}`);
    console.log(`Cảnh báo ticket ${id}`);
  };

  const handleWarnSelected = () => {
    const selectedTickets = filteredTickets.filter(t => t.checked);
    if (selectedTickets.length === 0) return;
    alert(`Đã gửi cảnh báo cho ${selectedTickets.length} ticket(s)`);
  };

  const handleUpdateReturnedCount = useCallback((ticketId, newReturnedCount) => {
    if (typeof updateReturnedCount === 'function') {
      updateReturnedCount(ticketId, newReturnedCount);
    }
  }, [updateReturnedCount]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <div className="flex gap-4">
          <ActionButtons
            onConfirm={confirmSelected}
            confirmLabel="Xác nhận"
            showReject={false}
          />
          <button
            onClick={handleWarnSelected}
            className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "#FF8B37" }}
            disabled={!filteredTickets.some(t => t.checked)}
          >
            Cảnh báo
          </button>
        </div>
      </div>

      <ReturnTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
        onWarnOne={handleWarnOne}
        onViewTicket={handleViewTicket}
      />

      {/* Return Ticket Detail Modal */}
      <ReturnTicketDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onConfirm={handleConfirmReturn}
        onWarn={handleWarnTicket}
        onUpdateReturnedCount={handleUpdateReturnedCount}
      />
    </>
  );
}