import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ReturnedTicketTable from "./components/ReturnedTicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import Pagination from "@/components/ui/Pagination";

export default function ReturnedBookSection({
    allTickets,
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

    // Lọc tickets dựa trên search term
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

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                    <SearchBar search={search} setSearch={setSearch} />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <ReturnedTicketTable
                    tickets={paginatedTickets}
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

            <TicketDetailModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
            />
        </>
    );
}
