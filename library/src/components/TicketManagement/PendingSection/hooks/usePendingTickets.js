import { useState, useMemo } from "react";
import { filterPendingTickets } from "../utils/filters";

export default function usePendingTickets(initialData) {
  const [tickets, setTickets] = useState(initialData);
  const [search, setSearch] = useState("");

  // Filter chỉ lấy pending và rejected tickets
  const filteredTickets = useMemo(
    () => filterPendingTickets(tickets, search),
    [tickets, search]
  );

  const allChecked = filteredTickets.length > 0 &&
    filteredTickets.every((t) => t.checked);

  const toggleAll = (checked) => {
    setTickets((prev) =>
      prev.map((t) =>
        filteredTickets.find((f) => f.id === t.id)
          ? { ...t, checked }
          : t
      )
    );
  };

  const toggleOne = (id, checked) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, checked } : t
      )
    );
  };

  const confirmSelected = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.checked && t.status === "pending"
          ? { ...t, status: "waiting_pickup", checked: false }
          : t
      )
    );
  };

  const rejectSelected = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.checked
          ? { ...t, status: "rejected", checked: false }
          : t
      )
    );
  };

  const confirmOne = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id && t.status === "pending"
          ? { ...t, status: "waiting_pickup", checked: false }
          : t
      )
    );
  };

  const rejectOne = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "rejected", checked: false }
          : t
      )
    );
  };

  return {
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
  };
}