import { useState } from "react";
import Pagination from "../components/Pagination";
import TicketManagement from "../components/TicketManagement";

const ALL_TICKETS = [
  // Tab Duyệt yêu cầu
  {
    id: "t1",
    userName: "Leslie Maya",
    email: "leslie@gmail.com",
    cardId: "123456",
    quantity: 3,
    status: "pending",
    checked: false,
  },
  {
    id: "t2",
    userName: "Josie Deck",
    email: "josie@gmail.com",
    cardId: "j234535",
    quantity: 4,
    status: "pending",
    checked: false,
  },
  {
    id: "t6",
    userName: "David Wilson",
    email: "david@gmail.com",
    cardId: "d345678",
    quantity: 5,
    status: "rejected",
    checked: false,
  },
  
  // Tab Nhận sách
  {
    id: "t3",
    userName: "Mike Dean",
    email: "mike@gmail.com",
    cardId: "m454646",
    quantity: 3,
    status: "waiting_pickup",
    checked: false,
    expirationDate: "20/05/2024",
  },
  {
    id: "t5",
    userName: "Sarah Johnson",
    email: "sarah@gmail.com",
    cardId: "s789012",
    quantity: 2,
    status: "waiting_pickup",
    checked: false,
    expirationDate: "18/05/2024",
  },
  
  // Tab Trả sách
  {
    id: "t4",
    userName: "Mateus Cunha",
    email: "cunha@gmail.com",
    cardId: "c945633",
    quantity: 1,
    status: "received",
    checked: false,
    expirationDate: "15/05/2024",
  },
  {
    id: "t7",
    userName: "Emma Thompson",
    email: "emma@gmail.com",
    cardId: "e567890",
    quantity: 2,
    status: "received",
    checked: false,
    expirationDate: "17/05/2024",
  },
  {
    id: "t8",
    userName: "James Miller",
    email: "james@gmail.com",
    cardId: "j123456",
    quantity: 3,
    status: "completed",
    checked: false,
    expirationDate: "10/05/2024",
  },
];

export default function TicketManagementPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [allTickets, setAllTickets] = useState(ALL_TICKETS);

  const TABS = [
    { key: "pending", label: "Duyệt yêu cầu" },
    { key: "receive", label: "Nhận sách" },
    { key: "return", label: "Trả sách" },
  ];

  // Hàm cập nhật ticket
  const updateTicketStatus = (id, newStatus) => {
    setAllTickets(prev =>
      prev.map(ticket =>
        ticket.id === id
          ? { ...ticket, status: newStatus, checked: false }
          : ticket
      )
    );
  };

  // Hàm bulk update
  const bulkUpdateTickets = (ticketIds, newStatus) => {
    setAllTickets(prev =>
      prev.map(ticket =>
        ticketIds.includes(ticket.id) && ticket.status !== "rejected"
          ? { ...ticket, status: newStatus, checked: false }
          : ticket
      )
    );
  };

  return (
    <div className="p-6 bg-[#F5EBE0] min-h-screen">
      <div className="flex gap-10 border-b mb-6 text-lg">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 font-medium transition ${
              activeTab === tab.key
                ? "border-b-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{
              color: activeTab === tab.key ? "#7A4A2E" : undefined,
              borderColor: activeTab === tab.key ? "#7A4A2E" : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TicketManagement 
        activeSection={activeTab}
        allTickets={allTickets}
        setAllTickets={setAllTickets}
        updateTicketStatus={updateTicketStatus}
        bulkUpdateTickets={bulkUpdateTickets}
      />

      <div className="mt-6 flex justify-center">
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
      </div>
    </div>
  );
}