import { useState } from "react";
import Pagination from "../components/Pagination";
import TicketManagement from "../components/TicketManagement";

export default function TicketManagementPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const TABS = [
    { key: "pending", label: "Duyệt yêu cầu" },
    { key: "receive", label: "Nhận sách" },
    { key: "return", label: "Trả sách" },
  ];

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

      <TicketManagement activeSection={activeTab} />

      <div className="mt-6 flex justify-center">
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
      </div>
    </div>
  );
}