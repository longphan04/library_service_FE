import { useContext } from 'react';
import { PrefetchContext } from '../contexts/PrefetchContext';

/**
 * Hook to access prefetching capabilities.
 */
const usePrefetch = () => {
    const context = useContext(PrefetchContext);
    if (!context) {
        throw new Error('usePrefetch must be used within a PrefetchProvider');
    }
    return context;
};

export default usePrefetch;
