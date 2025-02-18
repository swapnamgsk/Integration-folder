'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirect
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createItem } from '@/lib/actions/Useractions';

export default function ClientComponent() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();

  const handleAddItem = async () => {
    try {
      await createItem({ name, price: parseFloat(price) });
      toast.success('Item created successfully!');
      setName('');
      setPrice('');
      router.push('/items'); // Redirect to the items page after adding
    } catch (error) {
      toast.error('Failed to create item');
    }
  };

  return (
    <div>
      <h2>Add New Item</h2>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
      />
      <Input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Item Price"
        type="number"
      />
      <Button onClick={handleAddItem}>Add Item</Button>
    </div>
  );
}

