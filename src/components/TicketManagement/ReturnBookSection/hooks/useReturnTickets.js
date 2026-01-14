import { useState, useMemo } from "react";

export default function useReturnTickets(initialData) {
  const [tickets, setTickets] = useState(initialData);
  const [search, setSearch] = useState("");

  // Filter chỉ lấy received tickets
  const filteredTickets = useMemo(
    () => tickets
      .filter((t) => t.status === "received" || t.status === "completed")
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
        t.checked && t.status === "received"
          ? { ...t, status: "completed", checked: false }
          : t
      )
    );
  };

  const confirmOne = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id && t.status === "received"
          ? { ...t, status: "completed", checked: false }
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