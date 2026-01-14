import { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import BookManagement from "./pages/BookManagement";
import UserManagement from "./pages/UserManagement";
import TicketManagement from "./pages/TicketManagement";

function App() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <>
      <div className="fixed inset-0 bg-[#F5EBE0] -z-10" />
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

export default App;
