import PendingSection from "./PendingSection";
import ReceiveBookSection from "./ReceiveBookSection";
import ReturnBookSection from "./ReturnBookSection";

export default function TicketManagement({ activeSection = "pending" }) {
  const renderSection = () => {
    switch (activeSection) {
      case "pending":
        return <PendingSection />;
      case "receive":
        return <ReceiveBookSection />;
      case "return":
        return <ReturnBookSection />;
      default:
        return <PendingSection />;
    }
  };

  return renderSection();
}