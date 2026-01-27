import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import SearchBar from "./components/SearchBar";
import CancelledTicketTable from "./components/CancelledTicketTable";
import CancelledTicketDetailModal from "./components/CancelledTicketDetailModal";
import Pagination from "@/components/ui/Pagination";

export default function CancelledBookSection({
  allTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  refreshData
}) {
  const [search, setSearch] = useState("");
  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null); // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleReload = async () => {
    setLoading(true);
    try {
      if (refreshData) {
        await refreshData();
      }
      setSearch("");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // Reset page khi search thay đổi
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

  // Logic phân trang
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allChecked = paginatedTickets.length > 0 &&
    paginatedTickets.every((t) => t.checked);

  const toggleAll = (checked) => {
    const newChecked = {};
    paginatedTickets.forEach(ticket => {
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
        <div className="flex gap-2 items-center">
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
        <div />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <CancelledTicketTable
          tickets={paginatedTickets}
          allChecked={allChecked}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
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