import PendingSection from "./PendingSection";
import ReceiveBookSection from "./ReceiveBookSection";
import ReturnBookSection from "./ReturnBookSection";

export default function TicketManagement({ 
  activeSection = "pending",
  allTickets,
  setAllTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  updateReturnedCount
}) {
  const renderSection = () => {
    const commonProps = {
      allTickets,
      setAllTickets,
      updateTicketStatus,
      bulkUpdateTickets,
      updateReturnedCount
    };

    switch (activeSection) {
      case "pending":
        return <PendingSection {...commonProps} />;
      case "receive":
        return <ReceiveBookSection {...commonProps} />;
      case "return":
        return <ReturnBookSection {...commonProps} />;
      default:
        return <PendingSection {...commonProps} />;
    }
  };

  return renderSection();
}