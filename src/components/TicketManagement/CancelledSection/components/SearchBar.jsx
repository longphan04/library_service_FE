import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm người dùng"
        className="pl-12 pr-4 py-3 rounded text-white focus:outline-none"
        style={{ backgroundColor: "#7D5B4F", minWidth: "320px" }}
      />
    </div>
  );
}