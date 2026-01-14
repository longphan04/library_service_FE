import { initialReturnTickets } from "./utils/constants";
import useReturnTickets from "./hooks/useReturnTickets";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import ReturnTicketTable from "./components/ReturnTicketTable";

export default function ReturnBookSection() {
  const {
    search,
    setSearch,
    filteredTickets,
    allChecked,
    toggleAll,
    toggleOne,
    confirmSelected,
    confirmOne,
  } = useReturnTickets(initialReturnTickets);

  const handleWarnOne = (id) => {
    alert(`Đã gửi cảnh báo cho ticket #${id}`);
    console.log(`Cảnh báo ticket ${id}`);
  };

  const handleWarnSelected = () => {
    const selectedTickets = filteredTickets.filter(t => t.checked);
    if (selectedTickets.length === 0) return;
    alert(`Đã gửi cảnh báo cho ${selectedTickets.length} ticket(s)`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <div className="flex gap-4">
          <ActionButtons 
            onConfirm={confirmSelected} 
            confirmLabel="Xác nhận"
            showReject={false}
          />
          <button
            onClick={handleWarnSelected}
            className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "#FF8B37" }}
            disabled={!filteredTickets.some(t => t.checked)}
          >
            Cảnh báo
          </button>
        </div>
      </div>

      <ReturnTicketTable
        tickets={filteredTickets}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onConfirmOne={confirmOne}
        onWarnOne={handleWarnOne}
      />
    </>
  );
}