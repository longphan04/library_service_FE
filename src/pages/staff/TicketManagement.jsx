import { useState, useEffect, useCallback } from "react";
import Pagination from "@/components/ui/Pagination";
import TicketManagement from "@/components/TicketManagement";
import { borrowTicketStaffService } from "@/services/borrowTicketStaff.service";
import { canceledTicketStaffService } from "@/services/canceledTicketStaff.service";
import { approvedTicketStaffService } from "@/services/approvedTicketStaff.service";
import { pickedUpTicketStaffService } from "@/services/pickedUpTicketStaff.service";
import { returnedTicketStaffService } from "@/services/returnedTicketStaff.service";

export default function TicketManagementPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [allTickets, setAllTickets] = useState([]);

  const TABS = [
    { key: "pending", label: "Duyệt yêu cầu" },
    { key: "approved", label: "Nhận sách" },
    { key: "picked-up", label: "Đã mượn" },
    { key: "returned", label: "Đã trả sách" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  const fetchTickets = useCallback(() => {
    if (activeTab === "pending") {
      borrowTicketStaffService.getPendingTickets().then(setAllTickets);
    }
    else if (activeTab === "cancelled") {
      canceledTicketStaffService.getCanceledTickets().then(setAllTickets);
    }
    else if (activeTab === "approved") {
      approvedTicketStaffService.getApprovedTickets().then(setAllTickets);
    }
    else if (activeTab === "picked-up") {
      pickedUpTicketStaffService.getPickedUpTickets().then(setAllTickets);
    }
    else if (activeTab === "returned") {
      returnedTicketStaffService.getReturnedTickets().then(setAllTickets);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Hàm cập nhật ticket
  const updateTicketStatus = async (id, newStatus) => {
    await approvedTicketStaffService.updateStatus(id, newStatus);

    setAllTickets(prev =>
      prev.map(ticket =>
        ticket.id === id
          ? { ...ticket, status: newStatus, checked: false }
          : ticket
      )
    );
  };

  // Hàm bulk update
  const bulkUpdateTickets = async (ticketIds, newStatus) => {
    await approvedTicketStaffService.updateStatus(ticketIds, newStatus);

    setAllTickets(prev =>
      prev.map(ticket =>
        ticketIds.includes(ticket.id) && ticket.status !== "rejected"
          ? {
            ...ticket,
            status: newStatus,
            returnedCount: (newStatus === "completed" || newStatus === "RETURNED") ? (ticket.quantity || ticket.items?.length || 0) : ticket.returnedCount,
            checked: false
          }
          : ticket
      )
    );
  };

  const updateApprovedCount = (ticketId, returnedCount) => {
    setAllTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
            ...ticket,
            returnedCount: returnedCount,
            status: returnedCount >= ticket.quantity ? "completed" : ticket.status, checked: false
          }
          : ticket
      )
    );
  };

  return (
    <div className="p-6 bg-bg-app min-h-screen">
      <div className="flex gap-10 border-b mb-6 text-lg hover:cursor-pointer">
        {TABS.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 font-medium transition ${activeTab === tab.key
              ? "border-b-2"
              : "text-gray-500 hover:text-gray-700"
              }`}
            style={{
              color: activeTab === tab.key ? "#FF8B37" : undefined,
              borderColor: activeTab === tab.key ? "#7A4A2E" : undefined,
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <TicketManagement
        activeSection={activeTab}
        allTickets={allTickets}
        setAllTickets={setAllTickets}
        updateTicketStatus={updateTicketStatus}
        bulkUpdateTickets={bulkUpdateTickets}
        updateApprovedCount={updateApprovedCount}
        refreshData={fetchTickets}
      />
    </div>
  );
}