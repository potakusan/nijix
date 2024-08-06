import { ArtistMetaResultSet } from "@/types/api/artist";

export const generateOriginalAuthorUrl = (data: ArtistMetaResultSet) => {
  if (data.source === "twitter") {
    return "https://x.com/i/user/" + data.author_id;
  } else if (data.source === "nijie") {
    return (
      "https://nijie.info/members.php?id=" + data.author_id.replace("n_", "")
    );
  } else if (data.source === "pixiv") {
    return (
      "https://www.pixiv.net/users/" +
      data.author_id.replace("p_", "").replace(/_\d+$/, "")
    );
  } else if (data.source === "booth") {
    return `https://${data.author_id.replace("b_", "")}.booth.pm/`;
  } else {
    return "/";
  }
};
