"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; 
import { createCrud, deleteCrud, getAllCruds } from "@/lib/actions/Useractions";

interface Crud {
  _id: string;
  name: string;
  description: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Crud[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ✅ Fetch all items on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllCruds();
        if (response?.success && Array.isArray(response.cruds)) {
          // ✅ Convert `_id` to a string for TypeScript compatibility
          const formattedCruds: Crud[] = response.cruds.map((item) => ({
            ...item,
            _id: String(item._id), // Convert `_id` to string
          }));
          setItems(formattedCruds);
        } else {
          setItems([]); 
          toast.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setItems([]);
        toast.error("Something went wrong while fetching items");
      }
    }
    fetchData();
  }, []);

  // ✅ Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Name and description are required!");
      return;
    }
  
    console.log("Submitting data:", { name, description }); // Log the data being sent
  
    try {
      const response = await createCrud(name, description);
      if (response.success && response.crud) {
        const newItem = { ...response.crud, _id: String(response.crud._id) };
        setItems((prev) => [...prev, newItem]);
        setName("");
        setDescription("");
        toast.success("Item added successfully!");
      } else {
        toast.error(response.error || "Failed to add item");
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Something went wrong while adding item");
    }
  }
  

  // ✅ Handle delete operation
  async function handleDelete(id: string) {
    try {
      const response = await deleteCrud(id);
      if (response.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting item");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CRUD Items</h1>

      {/* ✅ Form to create new item */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
        <Button type="submit">Add Item</Button>
      </form>

      {/* ✅ Display list of items */}
      <ul className="mt-6 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item._id} className="flex justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <Button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No items found.</p>
        )}
      </ul>
    </div>
  );
}
