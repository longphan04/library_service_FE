import { useState, useMemo, useCallback, useEffect } from "react";
import { userManagementStaffService } from "@/services/userManagementStaff.service";

const ITEMS_PER_PAGE = 5;

export default function useUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState({});

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userManagementStaffService.getMembers();
            setUsers(data);
        } catch (err) {
            setError(err.message || "Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /* ===== FILTER + SEARCH ===== */
    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];

        return users.filter(user => {
            const matchSearch =
                (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [users, searchTerm, statusFilter]);

    /* ===== PAGINATION ===== */
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    /* ===== SELECT ===== */
    const toggleUser = (id, checked) => {
        setSelectedUsers(prev => ({
            ...prev,
            [id]: checked
        }));
    };

    const toggleSelectAll = () => {
        const isAllSelected = currentItems.every(
            user => selectedUsers[user.id]
        );

        const newSelected = { ...selectedUsers };

        currentItems.forEach(user => {
            newSelected[user.id] = !isAllSelected;
        });

        setSelectedUsers(newSelected);
    };

    const selectedIds = Object.keys(selectedUsers)
        .filter(id => selectedUsers[id])
        .map(Number);

    const isAllSelected =
        currentItems.length > 0 &&
        currentItems.every(user => selectedUsers[user.id]);

    /* ===== ACTIONS ===== */
    const lockUsers = async () => {
        try {
            await Promise.all(selectedIds.map(id => userManagementStaffService.updateUserStatus(id, "locked")));
            setUsers(prev =>
                prev.map(user =>
                    selectedIds.includes(user.id)
                        ? { ...user, status: "locked" }
                        : user
                )
            );
            setSelectedUsers({});
        } catch (err) {
            alert("Lỗi khi khóa người dùng");
        }
    };

    const unlockUsers = async () => {
        try {
            await Promise.all(selectedIds.map(id => userManagementStaffService.updateUserStatus(id, "active")));
            setUsers(prev =>
                prev.map(user =>
                    selectedIds.includes(user.id)
                        ? { ...user, status: "active" }
                        : user
                )
            );
            setSelectedUsers({});
        } catch (err) {
            alert("Lỗi khi mở khóa người dùng");
        }
    };

    return {
        users,
        setUsers,
        loading,
        error,
        fetchUsers,

        currentItems,
        currentPage,
        totalPages,
        setCurrentPage,

        searchTerm,
        setSearchTerm,

        statusFilter,
        setStatusFilter,

        selectedUsers,
        selectedIds,
        isAllSelected,

        toggleUser,
        toggleSelectAll,

        lockUsers,
        unlockUsers
    };
}