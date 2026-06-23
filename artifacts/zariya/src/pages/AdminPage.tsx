import { Redirect, useRoute } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { ADMIN_SECTIONS, type AdminSectionId } from "@/pages/admin/shared";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminProfiles from "@/pages/admin/AdminProfiles";
import AdminListings from "@/pages/admin/AdminListings";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminWaitlist from "@/pages/admin/AdminWaitlist";

const SECTION_COMPONENTS: Record<AdminSectionId, React.ComponentType> = {
  overview: AdminOverview,
  users: AdminUsers,
  profiles: AdminProfiles,
  listings: AdminListings,
  jobs: AdminJobs,
  waitlist: AdminWaitlist,
};

export default function AdminPage() {
  const [, params] = useRoute("/app/admin/:section");
  const section = params?.section as AdminSectionId | undefined;

  if (!section || !ADMIN_SECTIONS.some((s) => s.id === section)) {
    return <Redirect to="/app/admin/overview" />;
  }

  const Section = SECTION_COMPONENTS[section];

  return (
    <AdminLayout section={section}>
      <Section />
    </AdminLayout>
  );
}
