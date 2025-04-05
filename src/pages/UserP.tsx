import { useState } from "react";
import { UserData } from "@/hooks/useFetchResults";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";

export const UserPage = () => {
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "Alice Johnson", position: "alice@example.com", institution: "", faculty: "" },
    { id: "2", name: "Bob Smith", position: "bob@example.com", institution: "", faculty: "" },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState({ name: "", position: "", institution: "", faculty: "" });

  const handleOpen = (user: UserData | null = null) => {
    setEditingUser(user);
    setNewUser(
      user
        ? { name: user.name, position: user.position, institution: user.institution, faculty: user.faculty }
        : { name: "", position: "", institution: "", faculty: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...newUser } : u));
    } else {
      const newId = String(users.length + 1);
      const newUserData: UserData = {
        id: newId,
        name: newUser.name,
        position: newUser.position,
        institution: newUser.institution,
        faculty: newUser.faculty,
      };
      setUsers([...users, newUserData]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="container mx-auto p-6 h-screen">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Button onClick={() => handleOpen()} className="mb-4">
        Add User
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="border-b">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.position}</td>
                <td className="p-2 flex space-x-2">
                  <Button variant="outline" onClick={() => handleOpen(user)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user details below." : "Enter user details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.position}
              onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
            />
            <Input
              placeholder="Institution"
              value={newUser.institution}
              onChange={(e) => setNewUser({ ...newUser, institution: e.target.value })}
            />
            <Input
              placeholder="Faculty"
              value={newUser.faculty}
              onChange={(e) => setNewUser({ ...newUser, faculty: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};