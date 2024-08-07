import { ArtistMetaResultSet } from "@/types/api/artist";
import { ImageResultSet } from "@/types/api/search/images";

export const generateOriginalUrl = (
  data:
    | ImageResultSet
    | ArtistMetaResultSet
    | false
    | { id: string; source: string; author_id: string },
  id?: string,
  source?: string,
  author_id?: string
) => {
  if (data === false) {
    data = {
      id: id!,
      source: source!,
      author_id: author_id!,
    };
  }
  if (data.source === "twitter") {
    return "https://twitter.com/__/status/" + data.id;
  } else if (data.source === "nijie") {
    return (
      "https://nijie.info/view.php?id=" + (data.id || "").replace("n_", "")
    );
  } else if (data.source === "pixiv") {
    return (
      "https://www.pixiv.net/artworks/" +
      (data.id || "").replace("p_", "").replace(/_\d+$/, "")
    );
  } else if (data.source === "booth") {
    return `https://${data.author_id.replace("b_", "")}.booth.pm/items/${(
      data.id || ""
    ).replace("b_", "")}`;
  } else {
    return "/";
  }
};
