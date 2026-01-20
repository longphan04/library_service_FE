export const filterReceiveTickets = (tickets, search) => {
  return tickets
    .filter((t) => t.status === "waiting_pickup")
    .filter((t) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    );
};