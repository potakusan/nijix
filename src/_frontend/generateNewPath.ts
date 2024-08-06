import { ReadonlyURLSearchParams } from "next/navigation";

export const generateNewPath = (
  searches: ReadonlyURLSearchParams,
  tag: string,
  noun: string,
  newTag: string | null = null,
  newNoun: string | null = null,
  artist?: string
): string => {
  let tags = tag === "_" ? [] : tag.split(",");
  let nouns = noun === "_" ? [] : noun.split(",");

  if (newTag) {
    if (tags.indexOf(newTag) === -1) {
      tags.push(newTag);
    } else {
      tags = tags.filter((item) => item !== newTag);
    }
  }
  if (newNoun) {
    if (nouns.indexOf(newNoun) === -1) {
      nouns.push(newNoun);
    } else {
      nouns = nouns.filter((item) => item !== newNoun);
    }
  }
  if (artist) {
    return `/artist/${artist}/${tags.length === 0 ? "_" : tags.join(",")}/${
      nouns.length === 0 ? "_" : nouns.join(",")
    }/1?${searches.toString()}`;
  }
  return `/search/${tags.length === 0 ? "_" : tags.join(",")}/${
    nouns.length === 0 ? "_" : nouns.join(",")
  }/1?${searches.toString()}`;
};
