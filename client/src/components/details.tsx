import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS, apiCall } from '../config/api';
import React from 'react';
import { Item } from './types.ts';

export default function Detail(_item?: Item) {
    //get id from route to fetch itemif not provided in props
    const { id } = useParams(); 
    const isPreview = _item;

    const [item, setItem] = useState(_item ? _item : null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await apiCall(API_ENDPOINTS.INVENTORY_BY_ID(id));
                setItem(data.data);
            } catch (err) {
                console.error('Error fetching item:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (!item || !item._id) {
            fetchItem();
        } else {
            setLoading(false);
        }
    }, [id, item]);
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }


    if (!item) {
        return <div>Item not found</div>
    }
   
    return (
        <div>
            <img src={item.image} alt={item.title} width={500} height={500} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
            <p>In Stock: {item.inStock}</p>

                {item.tags && item.tags.length > 0  && !isPreview&& (
                    <p>Tags: {item.tags.join(', ')}</p>
                )}
        </div>
    )
}