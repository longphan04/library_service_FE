export const filterApprovedTickets = (tickets, search) => {
  return tickets
    .filter((t) => t.status === "received" || t.status === "completed")
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    );
};