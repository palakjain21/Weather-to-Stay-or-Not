import { useState, useEffect, useCallback, useRef } from 'react';
import { getProperties, GetPropertiesParams, Property } from '../lib/property.api';

interface UsePropertiesResult {
    properties: Property[];
    isLoading: boolean;
    error: Error | null;
    hasMore: boolean;
    loadMore: () => void;
    reset: () => void;
}

export const useProperties = (
    params: Omit<GetPropertiesParams, 'cursor' | 'limit'>
): UsePropertiesResult => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
    
    const isLoadingRef = useRef(false);
    
    const prevParamsRef = useRef(params);
    
    const limit = 20;

    const fetchProperties = useCallback(async (cursor: number | undefined, append: boolean = false) => {
        if (isLoadingRef.current) return;
        
        try {
            isLoadingRef.current = true;
            setIsLoading(true);
            setError(null);
            
            const response = await getProperties({
                ...params,
                cursor,
                limit
            });
            
            if (append) {
                setProperties(prev => [...prev, ...response.properties]);
            } else {
                setProperties(response.properties);
            }
            
            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch properties');
            setError(error);
        } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, [params, limit]);

    const loadMore = useCallback(() => {
        if (!hasMore || isLoadingRef.current || !nextCursor) return;
        
        fetchProperties(nextCursor, true);
    }, [hasMore, nextCursor, fetchProperties]);

    const reset = useCallback(() => {
        setProperties([]);
        setHasMore(true);
        setNextCursor(undefined);
        fetchProperties(undefined, false);
    }, [fetchProperties]);

    const paramsChanged = useCallback(() => {
        const prev = prevParamsRef.current;
        const curr = params;
        
        if (prev.searchText !== curr.searchText) return true;
        if (prev.temperatureMin !== curr.temperatureMin) return true;
        if (prev.temperatureMax !== curr.temperatureMax) return true;
        if (prev.humidityMin !== curr.humidityMin) return true;
        if (prev.humidityMax !== curr.humidityMax) return true;
        
        if (prev.weatherCondition?.length !== curr.weatherCondition?.length) return true;
        if (prev.weatherCondition && curr.weatherCondition) {
            for (let i = 0; i < prev.weatherCondition.length; i++) {
                if (prev.weatherCondition[i] !== curr.weatherCondition[i]) return true;
            }
        }
        
        return false;
    }, [params]);

    useEffect(() => {
        if (paramsChanged()) {
            prevParamsRef.current = params;
            setProperties([]);
            setHasMore(true);
            setNextCursor(undefined);
            fetchProperties(undefined, false);
        }
    }, [params, paramsChanged, fetchProperties]);

    useEffect(() => {
        fetchProperties(undefined, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        properties,
        isLoading,
        error,
        hasMore,
        loadMore,
        reset
    };
};