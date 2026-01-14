export const getStatusLabel = (status) => {
  const statusMap = {
    pending: "Chờ duyệt",
    waiting_pickup: "Đã xác nhận",
    rejected: "Bị từ chối",
    received: "Đã trả",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    pending: "gray",
    waiting_pickup: "yellow",
    rejected: "gray",
    received: "green",
  };
  return colorMap[status] || "gray";
};