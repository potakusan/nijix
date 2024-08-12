import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace(`/f/${router.query.id}/_/_/1`);
    }
  }, [router.isReady]);

  return null;
}
