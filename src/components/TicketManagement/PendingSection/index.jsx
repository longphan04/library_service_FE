import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PendingTicketTable from "./components/PendingTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";

export default function PendingSection({ 
  allTickets, 
  updateTicketStatus,
  bulkUpdateTickets 
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter chỉ lấy pending và rejected tickets
  const filteredTickets = allTickets
    .filter((t) => t.status === "pending" || t.status === "rejected")
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

  // Xác nhận toàn bộ ticket từ modal
  const handleConfirmTicket = (ticketId, books) => {
    console.log(`Xác nhận ticket ${ticketId} với ${books.length} sách`);
    updateTicketStatus(ticketId, "waiting_pickup");
    setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  // Từ chối toàn bộ ticket từ modal
  const handleRejectTicket = (ticketId) => {
    console.log(`Từ chối ticket ${ticketId}`);
    updateTicketStatus(ticketId, "rejected");
    setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const confirmSelected = () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);
    
    if (selectedIds.length > 0) {
      bulkUpdateTickets(selectedIds, "waiting_pickup");
      // Reset checkboxes
      const resetChecks = {};
      selectedIds.forEach(id => {
        resetChecks[id] = false;
      });
      setCheckedTickets(prev => ({ ...prev, ...resetChecks }));
    }
  };

  const rejectSelected = () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked && t.status === "pending")
      .map(t => t.id);
    
    if (selectedIds.length > 0) {
      bulkUpdateTickets(selectedIds, "rejected");
      // Reset checkboxes
      const resetChecks = {};
      selectedIds.forEach(id => {
        resetChecks[id] = false;
      });
      setCheckedTickets(prev => ({ ...prev, ...resetChecks }));
    }
  };

  const confirmOne = (id) => {
    updateTicketStatus(id, "waiting_pickup");
    setCheckedTickets(prev => ({ ...prev, [id]: false }));
  };

  const rejectOne = (id) => {
    updateTicketStatus(id, "rejected");
    setCheckedTickets(prev => ({ ...prev, [id]: false }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <ActionButtons 
          onConfirm={confirmSelected} 
          onReject={rejectSelected} 
          confirmLabel="Xác nhận"
          showReject={true}
        />
      </div>

      <PendingTicketTable
        tickets={filteredTickets}
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
    </>
  );
}