import { useState } from "react";
<<<<<<< HEAD
import HeaderStaff from "@/componants/layouts/HeaderStaff";
import Tabs from "@/componants/ui/TabStaff";
=======
import Header from "@/components/layouts/Header";
import Tabs from "@/components/ui/TabStaff";
>>>>>>> User_brch
import BookManagement from "./BookManagement";
import UserManagement from "./UserManagement";
import TicketManagement from "./TicketManagement";

function MainLayout() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <>
      <div className="fixed inset-0 bg-bg-app -z-10" />
      <div className="relative z-10 min-h-screen">
        <HeaderStaff />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "books" && <BookManagement />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "tickets" && <TicketManagement />}
      </div>
    </>
  );
}

export default MainLayout;