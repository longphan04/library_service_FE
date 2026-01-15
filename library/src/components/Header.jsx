import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white">
      <div>
        <h1 className="text-lg font-semibold text-primary">
          📚 Library system
        </h1>
        <p className="text-sm text-gray-500">
          Discover & Borrow book
        </p>
      </div>

      <div className="relative">
        <Bell className="text-primary" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full" />
      </div>
    </header>
  );
}
