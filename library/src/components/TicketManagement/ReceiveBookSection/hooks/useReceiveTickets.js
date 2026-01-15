import { useState, useMemo } from "react";

export default function useReceiveTickets(initialData) {
  const [tickets, setTickets] = useState(initialData);
  const [search, setSearch] = useState("");

  // Filter chỉ lấy waiting_pickup tickets
  const filteredTickets = useMemo(
    () => tickets
      .filter((t) => t.status === "waiting_pickup")
      .filter((t) =>
        t.userName.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      ),
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
        t.checked && t.status === "waiting_pickup"
          ? { ...t, status: "received", checked: false }
          : t
      )
    );
  };

  const confirmOne = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id && t.status === "waiting_pickup"
          ? { ...t, status: "received", checked: false }
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
    confirmOne,
  };
}