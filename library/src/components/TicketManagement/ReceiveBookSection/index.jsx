import { initialReceiveTickets } from "./utils/constants";
import useReceiveTickets from "./hooks/useReceiveTickets";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import ReceiveTicketTable from "./components/ReceiveTicketTable";

export default function ReceiveBookSection() {
  const {
    search,
    setSearch,
    filteredTickets,
    allChecked,
    toggleAll,
    toggleOne,
    confirmSelected,
    confirmOne,
  } = useReceiveTickets(initialReceiveTickets);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <ActionButtons 
          onConfirm={confirmSelected} 
          confirmLabel="Xác nhận"
          showReject={false}
        />
      </div>

      <ReceiveTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
      />
    </>
  );
}