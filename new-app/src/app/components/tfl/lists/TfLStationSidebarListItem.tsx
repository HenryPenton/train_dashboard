export type SidebarItem = {
  CommonName: string;
  naptanID: string;
};

export default function TfLStationSidebarListItem({
  item,
  matchingId,
  onClick,
}: {
  item: SidebarItem;
  matchingId: string | null;
  onClick: (id: string) => void;
}) {
  const selected = item.naptanID === matchingId;
  return (
    <li
      className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 ${
        selected 
          ? "bg-blue-600 text-white shadow-md" 
          : "text-gray-300 hover:bg-[#2a2d35] hover:text-white"
      }`}
      onClick={() => onClick(item.naptanID)}
    >
      <div className="font-medium">{item.CommonName}</div>
      <div className="text-xs opacity-70 mt-1">{item.naptanID}</div>
    </li>
  );
}