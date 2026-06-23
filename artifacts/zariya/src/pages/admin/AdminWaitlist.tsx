import { useState } from "react";
import { FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useEnsureData } from "@/hooks/useEnsureData";

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<Array<Record<string, string>>>([]);
  const loading = useEnsureData(async () => {
    const res = await api.admin.getWaitlist();
    if (res.data) setWaitlist(res.data.leads as Array<Record<string, string>>);
  }, []);
  if (loading) return <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading waitlist…</div>;
  return (
            <div className="p-6 md:p-8">
              <h1 className="text-xl font-extrabold text-foreground mb-2">Waitlist Signups ({waitlist.length})</h1>
              <p className="text-sm text-muted-foreground mb-6">People who signed up for early access from other cities.</p>
              {waitlist.length === 0 ? (
                <div className="p-10 rounded-2xl border border-dashed border-border text-center">
                  <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No waitlist signups yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {["Name", "Phone", "Email", "City / District", "Category", "Joined"].map((h) => (
                          <th key={h} className="text-left px-3 py-2.5 font-bold text-muted-foreground text-[10px] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {waitlist.map((entry, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-3 font-semibold text-foreground">{entry.name}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.phone}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.email}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.district}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.category}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          
  );
}
