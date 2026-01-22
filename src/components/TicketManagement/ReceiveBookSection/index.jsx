import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import ReceiveTicketTable from "./components/ReceiveTicketTable";
import ReceiveTicketDetailModal from "./components/ReceiveTicketDetailModal"; // Thêm import

export default function ReceiveBookSection({ 
  allTickets, 
  updateTicketStatus,
  bulkUpdateTickets 
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null); // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter chỉ lấy waiting_pickup tickets
  const filteredTickets = allTickets
    .filter((t) => t.status === "waiting_pickup")
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
    updateTicketStatus(ticketId, "received");
    setCheckedTickets(prev => ({ ...prev, [ticketId]: false }));
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const confirmSelected = () => {
    const selectedIds = filteredTickets
      .filter(t => t.checked)
      .map(t => t.id);
    
    if (selectedIds.length > 0) {
      bulkUpdateTickets(selectedIds, "received");
      // Reset checkboxes
      const resetChecks = {};
      selectedIds.forEach(id => {
        resetChecks[id] = false;
      });
      setCheckedTickets(prev => ({ ...prev, ...resetChecks }));
    }
  };

  const confirmOne = (id) => {
    updateTicketStatus(id, "received");
    setCheckedTickets(prev => ({ ...prev, [id]: false }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <ActionButtons 
          onConfirm={confirmSelected} 
          confirmLabel="Xác nhận"
          showReject={false}
        />
      </div>

      <ReceiveTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
        onViewTicket={handleViewTicket} // Thêm prop mới
      />

      {/* Receive Ticket Detail Modal */}
      <ReceiveTicketDetailModal
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