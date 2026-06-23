import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit2, Save, ChevronDown, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useEnsureData } from "@/hooks/useEnsureData";
import { UserType } from "@/types";
import { Badge, inputCls } from "@/pages/admin/shared";

export default function AdminUsers() {
  const { users, ensureAdminUsers, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<{ name: string; phone: string; type: UserType }>({ name: "", phone: "", type: "user" });

  const loading = useEnsureData(() => ensureAdminUsers(), [ensureAdminUsers]);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading users…</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold text-foreground">Users ({users.length})</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary w-56" />
        </div>
      </div>

      <div className="space-y-2">
        {filteredUsers.map((u) => {
          const isEditing = editingUserId === u.id;
          return (
            <div key={u.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={u.type} />
                  {u.serviceCategory && <span className="text-xs text-muted-foreground hidden sm:inline">· {u.serviceCategory}</span>}
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) { setEditingUserId(null); return; }
                      setEditingUserId(u.id);
                      setEditUserData({ name: u.name, phone: u.phone, type: u.type });
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                  >
                    {isEditing ? <ChevronDown className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30 space-y-3">
                      <p className="text-xs font-bold text-muted-foreground pt-3 uppercase tracking-wide">Edit User</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                          <input value={editUserData.name} onChange={(e) => setEditUserData((d) => ({ ...d, name: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">Phone</label>
                          <input value={editUserData.phone} onChange={(e) => setEditUserData((d) => ({ ...d, phone: e.target.value }))} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Role / Type</label>
                        <select value={editUserData.type} onChange={(e) => setEditUserData((d) => ({ ...d, type: e.target.value as UserType }))} className={inputCls}>
                          <option value="user">user — Just Browsing</option>
                          <option value="service_provider">service_provider — Service Provider</option>
                          <option value="business_owner">business_owner — Business Owner</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { updateUser(u.id, editUserData); setEditingUserId(null); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                        <button type="button" onClick={() => setEditingUserId(null)} className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {filteredUsers.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">No users found.</div>}
      </div>
    </div>
  );
}
