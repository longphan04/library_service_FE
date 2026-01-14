import { initialPendingTickets } from "./utils/constants";
import usePendingTickets from "./hooks/usePendingTickets";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import PendingTicketTable from "./components/PendingTicketTable";

export default function PendingSection() {
  const {
    tickets,
    search,
    setSearch,
    filteredTickets,
    allChecked,
    toggleAll,
    toggleOne,
    confirmSelected,
    rejectSelected,
    confirmOne,
    rejectOne,
  } = usePendingTickets(initialPendingTickets);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <ActionButtons 
          onConfirm={confirmSelected} 
          onReject={rejectSelected} 
          confirmLabel="Xác nhận"
          showReject={true}
        />
      </div>

      <PendingTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
        onRejectOne={rejectOne}
      />
    </>
  );
}