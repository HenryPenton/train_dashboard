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
      className={`mb-2 cursor-pointer px-2 py-1 rounded ${selected ? "bg-blue-100" : ""}`}
      onClick={() => onClick(item.naptanID)}
    >
      {item.CommonName}
    </li>
  );
}
