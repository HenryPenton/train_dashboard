import React from "react";

type SidebarItem = {
  CommonName: string;
  naptanID: string;
};

export default function SidebarListItem({
  item,
  selected,
  onClick,
}: {
  item: SidebarItem;
  selected: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <li
      className={`mb-2 cursor-pointer px-2 py-1 rounded ${selected ? "bg-blue-100" : ""}`}
      onClick={() => onClick(item.naptanID)}
    >
      {item.CommonName}
    </li>
  );
}
