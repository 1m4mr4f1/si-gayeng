export default function StatusBadge({ status }: { status: string }) {
  // Mapping gaya Tailwind berdasarkan status
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PROSES: "bg-blue-100 text-blue-700 border-blue-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  };

  // Mapping label tampilan
  const labels: Record<string, string> = {
    PENDING: "Menunggu",
    PROSES: "Diproses",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {labels[status] || status}
    </span>
  );
}