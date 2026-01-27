import { useState, useMemo, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PickedUpTicketTable from "./components/PickedUpTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/modal/ConfirmModal";

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
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ title: "", onConfirm: () => { } });

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
        const newChecked = {};
        paginatedTickets.forEach(ticket => {
            newChecked[ticket.id] = checked;
        });
        setCheckedTickets(prev => ({ ...prev, ...newChecked }));
    };

    const toggleOne = (id, checked) => {
        setCheckedTickets(prev => ({ ...prev, [id]: checked }));
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Xác nhận trả sách
    const handleConfirmReturn = (ticketId) => {
        setConfirmConfig({
            title: "Xác nhận khách hàng đã trả sách cho phiếu này?",
            onConfirm: () => {
                updateTicketStatus(ticketId, "RETURNED");
                if (refreshData) refreshData();
                setCheckedTickets(prev => {
                    const newState = { ...prev };
                    delete newState[ticketId];
                    return newState;
                });
                setIsModalOpen(false);
                setSelectedTicket(null);
                setShowConfirm(false);
            }
        });
        setShowConfirm(true);
    };

    const confirmSelected = useCallback(() => {
        const selectedIds = filteredTickets
            .filter(t => t.checked)
            .map(t => t.id);

        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một phiếu để xác nhận trả sách");
            return;
        }

        setConfirmConfig({
            title: `Xác nhận đã trả sách cho ${selectedIds.length} phiếu đã chọn?`,
            onConfirm: () => {
                bulkUpdateTickets(selectedIds, "RETURNED");
                if (refreshData) refreshData();
                setCheckedTickets(prev => {
                    const newState = { ...prev };
                    selectedIds.forEach(id => delete newState[id]);
                    return newState;
                });
                setShowConfirm(false);
            }
        });
        setShowConfirm(true);
    }, [filteredTickets, bulkUpdateTickets, refreshData]);

    const confirmOne = useCallback((id) => {
        setConfirmConfig({
            title: "Xác nhận khách hàng đã trả sách cho phiếu này?",
            onConfirm: () => {
                updateTicketStatus(id, "RETURNED");
                if (refreshData) refreshData();
                setCheckedTickets(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
                setShowConfirm(false);
            }
        });
        setShowConfirm(true);
    }, [updateTicketStatus, refreshData]);

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

            <ConfirmModal
                open={showConfirm}
                title={confirmConfig.title}
                onConfirm={confirmConfig.onConfirm}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
