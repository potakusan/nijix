import { FavContentType } from "@/types/api/favs";
import { GLOBAL_ITEM_NUMBERS_PER_PAGE } from "../../_config/config";

export const getFavsList = () => {
  const p = JSON.parse(
    window.localStorage.getItem("favs") || "[]"
  ) as FavContentType[];
  return p;
};

export const getFavsId = (page: number = 1, full: boolean = false) => {
  const g = getFavsList();
  const m = g
    .sort((a, b) => b.added_at - a.added_at)
    .reduce((group: string[], item) => {
      if (!group) group = [];
      group.push(item.id);
      return group;
    }, []);
  if (g.length === 0) return ["_"];
  return full
    ? m
    : m.slice(
        (page - 1) * GLOBAL_ITEM_NUMBERS_PER_PAGE,
        page * GLOBAL_ITEM_NUMBERS_PER_PAGE
      );
};
