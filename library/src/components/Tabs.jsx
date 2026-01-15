export default function Tabs() {
  const tabs = ["Quản lý sách", "Quản lý người dùng", "Quản lý phiếu"];

  return (
    <div className="flex gap-2 px-6 mt-4">
      {tabs.map((t, i) => (
        <button
          key={i}
          className={`px-4 py-2 rounded-t-xl text-sm
            ${i === 0
              ? "bg-primary text-white"
              : "bg-white text-gray-500"}
          `}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
