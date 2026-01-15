// ==========================================
// Hook: useBorrowTicket
// Mô tả: Custom hook để quản lý borrow tickets (phiếu mượn sách)
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import borrowTicketService from '../services/borrow-ticket.service';

/**
 * Custom hook để quản lý borrow tickets của user
 * @returns {Object} - { tickets, loading, error, refetch }
 */
const useBorrowTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await borrowTicketService.getMyTickets();
            setTickets(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch borrow tickets');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        error,
        refetch: fetchTickets,
    };
};

/**
 * Custom hook để fetch borrow ticket by ID
 * @param {string|number} id - Ticket ID
 * @returns {Object} - { ticket, loading, error, refetch }
 */
export const useBorrowTicketDetail = (id) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTicket = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await borrowTicketService.getById(id);
            setTicket(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch borrow ticket');
            setTicket(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    return {
        ticket,
        loading,
        error,
        refetch: fetchTicket,
    };
};

export default useBorrowTicket;
