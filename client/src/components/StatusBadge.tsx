const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    sold: "bg-red-100 text-red-700",
    reserved: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        styles[status.toLowerCase()] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};
export default StatusBadge;