import { FC, useEffect, useState } from "react";
import { FavouriteIcon, UnfavouriteIcon } from "./_icons";
import { useRouter } from "next/router";
import { Box, Card, CardBody, Heading, Text, Tooltip } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FavContentType } from "@/types/api/favs";

export const FavButton: FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [favStatus, setFavStatus] = useState<boolean | null>(null);
  useEffect(() => {
    if (router.isReady) {
      try {
        const favDir = JSON.parse(
          window.localStorage.getItem("favs") || "[]"
        ) as FavContentType[];
        setFavStatus(!!favDir.find((item) => item.id === id));
      } catch (e) {
        console.log(e);
      }
    }
  }, [router.isReady, id]);

  const toggleFav = () => {
    try {
      let favDir = JSON.parse(
        window.localStorage.getItem("favs") || "[]"
      ) as FavContentType[];
      const isExists = !!favDir.find((item) => item.id === id);
      if (isExists) {
        favDir = favDir.filter((item) => item.id !== id);
      } else {
        favDir.push({ id: id, added_at: dayjs().unix() });
      }
      window.localStorage.setItem("favs", JSON.stringify(favDir));
      setFavStatus(!isExists);
    } catch (e) {
      console.log(e);
    }
  };
  if (favStatus === null) return null;
  return (
    <Tooltip
      label={`イラストをお気に入り${favStatus ? "から削除" : "に追加"}します`}
      fontSize="sm"
    >
      <Box sx={{ cursor: "pointer" }} onClick={toggleFav}>
        {favStatus ? <FavouriteIcon /> : <UnfavouriteIcon />}
      </Box>
    </Tooltip>
  );
};

export const FavBox: FC<{ id?: string }> = ({ id }) => {
  const router = useRouter();
  const _id = id ? id : (router.query.id as string) || "";
  return (
    <Box>
      <Card backgroundColor={"teal.400"}>
        <CardBody>
          <Box>
            <Heading
              as="div"
              size="md"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text color="white">お気に入り</Text>
              <FavButton id={_id} />
            </Heading>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};
