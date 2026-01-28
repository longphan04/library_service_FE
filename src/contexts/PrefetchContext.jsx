import { createContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

export const PrefetchContext = createContext(null);

/**
 * Context provider for caching and prefetching API requests.
 */
export const PrefetchProvider = ({ children }) => {
    // Cache stores: key -> { promise, data, timestamp, error }
    const cache = useRef(new Map());

    // In-flight requests map to handle deduplication: key -> promise
    const inFlight = useRef(new Map());

    /**
     * Prefetch function to be used by components.
     * @param {string} key - Unique key for the request (e.g., 'book-123')
     * @param {Function} fetcher - Function that returns a promise (the API call)
     * @param {Object} options - { ttl: number (ms) }
     */
    const prefetch = useCallback((key, fetcher, options = {}) => {
        const { ttl = 5 * 60 * 1000 } = options; // Default TTL: 5 minutes
        const now = Date.now();

        // Check if valid cache exists
        if (cache.current.has(key)) {
            const cached = cache.current.get(key);
            if (now - cached.timestamp < ttl) {
                return cached.promise; // Return existing resolved/rejected promise
            } else {
                cache.current.delete(key); // Expired
            }
        }

        // Check if already in flight
        if (inFlight.current.has(key)) {
            return inFlight.current.get(key);
        }

        // Execute fetcher
        console.log(`[Prefetch] Fetching: ${key}`);
        const promise = fetcher()
            .then(data => {
                // Success: store in cache
                // Note: We deliberately store the PROMISE that resolves to data, 
                // but we also structure the cache entry to hold the raw data for sync access if needed later.
                // For simplicity here, we just updating the cache entry.
                cache.current.set(key, {
                    promise: Promise.resolve(data),
                    data,
                    timestamp: Date.now(),
                    error: null
                });
                return data;
            })
            .catch(error => {
                // Failure: decide whether to cache errors or not. 
                // Usually we might want to cache errors briefly or not at all.
                // Here we won't cache errors to allow retry.
                inFlight.current.delete(key);
                throw error;
            })
            .finally(() => {
                // Cleanup in-flight map
                inFlight.current.delete(key);
            });

        inFlight.current.set(key, promise);

        // Optimistically set cache with the pending promise so subsequent prefetch calls hit the cache
        // (Wait, 'inFlight' check handles immediate subsequent calls. 
        //  The cache set in .then() handles future calls).

        return promise;
    }, []);

    /**
     * Get data synchronously if it exists and is valid.
     */
    const getCachedData = useCallback((key) => {
        const cached = cache.current.get(key);
        if (cached && (Date.now() - cached.timestamp < 300000)) { // Hardcoded generic TTL check for sync access
            return cached.data;
        }
        return undefined;
    }, []);

    const value = {
        prefetch,
        getCachedData
    };

    return (
        <PrefetchContext.Provider value={value}>
            {children}
        </PrefetchContext.Provider>
    );
};

PrefetchProvider.propTypes = {
    children: PropTypes.node.isRequired
};
