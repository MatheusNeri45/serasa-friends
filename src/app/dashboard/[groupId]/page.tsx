import GroupPageClient from "@/app/components/dashboard/group-page";


export default function GroupPage({ params }: { params: { groupId: string } }) {
  return <GroupPageClient groupId={params.groupId} />;
}