import { SlideshowType } from "@/types/api/slideshow";
import { DeleteIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  SlideFade,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Slide } from "yet-another-react-lightbox";
import { ResetModal } from "./reset";
import { ShareModal } from "./share";

export const NavBarButton: FC<{
  _artist?: string;
  hideFavourite?: boolean;
  hideReset?: boolean;
  dataset?: Slide[] | undefined;
  onFavouriteShares?: boolean;
  lightBox?: (
    data: Slide[] | undefined,
    Slideshow: SlideshowType,
    setSlideshow: Dispatch<SetStateAction<SlideshowType>>,
    rawIds?: string[]
  ) => JSX.Element | null;
}> = ({
  _artist,
  hideFavourite,
  hideReset,
  lightBox,
  dataset,
  onFavouriteShares,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isResetOpen, onToggle: onResetToggle } = useDisclosure();
  const { isOpen: isShareOpen, onToggle: onShareToggle } = useDisclosure();
  const router = useRouter();
  const [Slideshow, setSlideshow] = useState<SlideshowType>({
    open: false,
    initial: 0,
  });
  return (
    <Box position="fixed" bottom="2" right="2">
      <VStack>
        {onFavouriteShares && (
          <SlideFade in={isOpen} offsetY="500px">
            <Tooltip label="シェア" placement="left">
              <IconButton
                aria-label="favourite"
                icon={<ShareIcon />}
                onClick={() => {
                  onShareToggle();
                }}
              />
            </Tooltip>
          </SlideFade>
        )}
        {!hideFavourite && (
          <SlideFade in={isOpen} offsetY="500px">
            <Tooltip label="お気に入り" placement="left">
              <IconButton
                aria-label="favourite"
                icon={<StarIcon />}
                onClick={() => {
                  router.push("/favourite/_/_/1");
                  onToggle();
                }}
              />
            </Tooltip>
          </SlideFade>
        )}
        {!hideReset && (
          <SlideFade in={isOpen} offsetY="500px">
            <Tooltip label="検索条件リセット" placement="left">
              <IconButton
                aria-label="reset"
                icon={<DeleteIcon />}
                onClick={() => {
                  onResetToggle();
                  onToggle();
                }}
              />
            </Tooltip>
          </SlideFade>
        )}
        {lightBox && (
          <>
            <SlideFade in={isOpen} offsetY="500px">
              <Tooltip label="スライドショー開始" placement="left">
                <IconButton
                  aria-label="slideshow"
                  onClick={() => {
                    setSlideshow({ open: true, initial: 0 });
                  }}
                  icon={<SlideShowIcon />}
                />
              </Tooltip>
            </SlideFade>
            {lightBox(dataset, Slideshow, setSlideshow)}
          </>
        )}
        <Tooltip label="操作" placement="left">
          <IconButton
            onClick={onToggle}
            aria-label="control"
            icon={<HamburgerIcon />}
          />
        </Tooltip>
      </VStack>
      <ResetModal
        _artist={_artist}
        isOpen={isResetOpen}
        onResetToggle={onResetToggle}
      />
      {isShareOpen && (
        <ShareModal isOpen={isShareOpen} onShareToggle={onShareToggle} />
      )}
    </Box>
  );
};

const SlideShowIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 17V20H18V22H6V20H11V17H4C3.44772 17 3 16.5523 3 16V4H2V2H22V4H21V16C21 16.5523 20.5523 17 20 17H13ZM10 6V13L15 9.5L10 6Z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 448 512"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"></path>
  </svg>
);
