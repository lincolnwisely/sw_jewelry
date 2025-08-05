import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiCall } from '../config/api';
import Detail from './details.tsx';
import { Item } from './types.ts';
import Page from './Page.tsx';

export default function Inventory() {

    const [inventory, setInventory] = useState<Item[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await apiCall(API_ENDPOINTS.INVENTORY);
                setInventory(data.data);
            } catch (err) {
                console.error('Error fetching items:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInventory();
    }, []);


    if (loading ) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!inventory) {
        return <div>No inventory found</div>;
    }



    return (
        <Page title="Inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory && inventory.map((item: Item) => (
                    <a href={item.id}>
                    <Detail key={item.id} {...item} />
                    </a>
                ))}
            </div>
        </Page>
    );
}
