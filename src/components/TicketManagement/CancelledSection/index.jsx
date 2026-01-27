import { useState } from "react";
import SearchBar from "./components/SearchBar";
import CancelledTicketTable from "./components/CancelledTicketTable";
import CancelledTicketDetailModal from "./components/CancelledTicketDetailModal";

export default function CancelledBookSection({
  allTickets,
  updateTicketStatus,
  bulkUpdateTickets
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null); // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Xác nhận đã nhận từ modal
  const handleConfirmTicket = (ticketId, books) => {
    console.log(`Xác nhận đã nhận ticket ${ticketId}`);
    updateTicketStatus(ticketId, "BORROWED");
    setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <div />
      </div>

      <CancelledTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewTicket={handleViewTicket}
      />

      {/* Cancelled Ticket Detail Modal */}
      <CancelledTicketDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onConfirm={handleConfirmTicket}
      />
    </>
  );
}