export const filterPendingTickets = (tickets, search) => {
  return tickets
    .filter((t) => t.status === "pending" || t.status === "rejected")
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    );
};