import { Wrapper } from "@/components/common/wrapper";
import dynamic from "next/dynamic";

export default function IndividualImagePage() {
  const SharedLayout = dynamic(
    import("../../../../../components/partials/favourites/shared/_layout"),
    {
      ssr: false,
    }
  );

  return (
    <Wrapper>
      <SharedLayout />
    </Wrapper>
  );
}
