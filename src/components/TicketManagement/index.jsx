import PendingSection from "./PendingSection";
import CancelledSection from "./CancelledSection";
import ApprovedSection from "./ApprovedSection";
import PickedUpSection from "./PickedUpSection";
import ReturnedSection from "./ReturnedSection";

export default function TicketManagement({
  activeSection = "pending",
  allTickets,
  setAllTickets,
  updateTicketStatus,
  bulkUpdateTickets,
  updateApprovedCount,
  refreshData
}) {
  const renderSection = () => {
    const commonProps = {
      allTickets,
      setAllTickets,
      updateTicketStatus,
      bulkUpdateTickets,
      updateApprovedCount,
      refreshData
    };

    switch (activeSection) {
      case "pending":
        return <PendingSection {...commonProps} />;
      case "approved":
        return <ApprovedSection {...commonProps} />;
      case "picked-up":
        return <PickedUpSection {...commonProps} />;
      case "returned":
        return <ReturnedSection {...commonProps} />;
      case "cancelled":
        return <CancelledSection {...commonProps} />;
      default:
        return <PendingSection {...commonProps} />;
    }
  };

  return renderSection();
}