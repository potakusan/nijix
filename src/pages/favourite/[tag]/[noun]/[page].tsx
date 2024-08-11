import { Wrapper } from "@/components/common/wrapper";
import dynamic from "next/dynamic";

export default function IndividualImagePage() {
  const MyPageLayout = dynamic(
    import("../../../../components/partials/favourites/mypage/_layout"),
    {
      ssr: false,
    }
  );

  return (
    <Wrapper>
      <MyPageLayout />
    </Wrapper>
  );
}
