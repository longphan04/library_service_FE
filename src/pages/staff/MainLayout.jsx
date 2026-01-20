import { useState } from "react";
import Header from "@/components/layouts/Header";
import Tabs from "@/components/ui/TabStaff";
import BookManagement from "./BookManagement";
import UserManagement from "./UserManagement";
import TicketManagement from "./TicketManagement";

function MainLayout() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <>
      <div className="fixed inset-0 bg-bg-app -z-10" />
      <div className="relative z-10 min-h-screen">
        <Header />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "books" && <BookManagement />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "tickets" && <TicketManagement />}
      </div>
    </>
  );
}

export default MainLayout;