// import { deleteItem, getItems, updateItem } from "@/lib/actions";

// export default async function ServerComponent() {
//   const items = await getItems();

//   return (
//     <div>
//       <h2>Items</h2>
//       {items.length === 0 ? (
//         <p>No items available.</p>
//       ) : (
//         <div>
//           {items.map((item: Item) => (
//             <div key={item._id} style={{ marginBottom: '1rem' }}>
//               <span>{item.name} - {item.price}</span>
//               <button onClick={() => handleUpdate(item._id, { name: item.name, price: item.price + 10 })}>Update</button>
//               <button onClick={() => handleDelete(item._id)}>Delete</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const handleUpdate = async (id: string, data: { name: string; price: number }) => {
//   try {
//     await updateItem(id, data);
//     toast.success('Item updated successfully!');
//   } catch (error) {
//     toast.error('Failed to update item');
//   }
// };

// const handleDelete = async (id: string) => {
//   try {
//     await deleteItem(id);
//     toast.success('Item deleted successfully!');
//   } catch (error) {
//     toast.error('Failed to delete item');
//   }
// };
