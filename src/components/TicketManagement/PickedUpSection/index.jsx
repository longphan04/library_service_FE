import { useState, useMemo, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PickedUpTicketTable from "./components/PickedUpTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import Pagination from "@/components/ui/Pagination";

export default function PickedUpBookSection({
    allTickets,
    updateTicketStatus,
    bulkUpdateTickets,
    refreshData
}) {
    const [search, setSearch] = useState("");
    const [checkedTickets, setCheckedTickets] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Reset page khi search thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredTickets = allTickets
        .filter((t) =>
            t.userName?.toLowerCase().includes(search.toLowerCase()) ||
            t.email?.toLowerCase().includes(search.toLowerCase()) ||
            t.id?.toString().includes(search)
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

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Xác nhận trả sách
    const handleConfirmReturn = (ticketId) => {
        updateTicketStatus(ticketId, "RETURNED");
        if (refreshData) refreshData();
        setCheckedTickets(prev => {
            const newState = { ...prev };
            delete newState[ticketId];
            return newState;
        });
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const confirmSelected = useCallback(() => {
        const selectedIds = filteredTickets
            .filter(t => t.checked)
            .map(t => t.id);

        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một phiếu để xác nhận trả sách");
            return;
        }

        bulkUpdateTickets(selectedIds, "RETURNED");
        if (refreshData) refreshData();
        setCheckedTickets(prev => {
            const newState = { ...prev };
            selectedIds.forEach(id => delete newState[id]);
            return newState;
        });
    }, [filteredTickets, bulkUpdateTickets, refreshData]);

    const confirmOne = useCallback((id) => {
        updateTicketStatus(id, "RETURNED");
        if (refreshData) refreshData();
        setCheckedTickets(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    }, [updateTicketStatus, refreshData]);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                    <SearchBar search={search} setSearch={setSearch} />
                </div>
                <div className="flex gap-4">
                    <ActionButtons
                        onConfirm={confirmSelected}
                        confirmLabel="Xác nhận trả"
                        disabled={!Object.values(checkedTickets).some(Boolean)}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <PickedUpTicketTable
                    tickets={paginatedTickets}
                    allChecked={allChecked}
                    onToggleAll={toggleAll}
                    onToggleOne={toggleOne}
                    onConfirmOne={confirmOne}
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

            <TicketDetailModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onConfirm={handleConfirmReturn}
            />
        </>
    );
}
