import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { SDResponseType } from "@/types/api/image/sd";
import { Fragment } from "react";

export default function SDTagsBox() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<SDResponseType>(
    id ? `/image/sd?id=${encodeURIComponent(id as string)}` : null,
    fetcher
  );
  if (error) return <>Error</>;
  if (isLoading || !data) return <SkeletonSDTagsBox />;
  if (!isLoading && (!data || data.body.tags.length === 0)) {
    return (
      <Box mt={4}>
        <Card>
          <CardHeader pb={1}>
            <Heading size="md">AI Report</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text fontSize="sm" my={4}>
              AI分析結果は現在作成中です。
              <br />
              画像をクロール後最大24時間でレポートが作成されます。
              <br />
              <br />* レポートが作成されるまでタグ機能などが利用できません
            </Text>
          </CardBody>
        </Card>
      </Box>
    );
  }
  const toPercentage = (number: number) => Number(number.toFixed(4)) * 100;

  const ratings = [
    { key: "general", data: toPercentage(data.body.ratings.general) },
    { key: "questionable", data: toPercentage(data.body.ratings.questionable) },
    { key: "sensitive", data: toPercentage(data.body.ratings.sensitive) },
    { key: "explicit", data: toPercentage(data.body.ratings.explicit) },
  ];

  return (
    <Box mt={4}>
      <Card>
        <CardHeader pb={1}>
          <Heading size="md">AI Report</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <Tabs>
            <TabList>
              <Tab>Ratings</Tab>
              <Tab>Taggings</Tab>
            </TabList>
            <TabPanels>
              <TabPanel pl={0} py={4}>
                {ratings
                  .sort((a, b) => b.data - a.data)
                  .map((item) => {
                    return (
                      <Fragment key={item.key}>
                        <Heading size="xs">
                          {item.key}: {item.data.toFixed(2)}%
                        </Heading>
                        <Progress
                          my={4}
                          colorScheme="green"
                          size="md"
                          value={item.data}
                        />
                      </Fragment>
                    );
                  })}
              </TabPanel>
              <TabPanel
                pl={0}
                py={4}
                sx={{ maxHeight: "450px", overflow: "auto" }}
              >
                {data.body.tags
                  .sort((a, b) => b.point - a.point)
                  .map((item) => {
                    const p = toPercentage(item.point);
                    return (
                      <Fragment key={item.title}>
                        <Heading size="xs">
                          {item.title}: {p.toFixed(2)}%
                        </Heading>
                        <Progress
                          my={4}
                          colorScheme="green"
                          size="md"
                          value={p}
                        />
                      </Fragment>
                    );
                  })}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
}

const SkeletonSDTagsBox = () => (
  <Box mt={4}>
    <Card>
      <CardHeader pb={1}>
        <Heading size="md">AI Report</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Tabs>
          <TabList>
            <Tab isDisabled>Ratings</Tab>
            <Tab isDisabled>Taggings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel pl={0} py={4}>
              {[...new Array(4)].map((_, i) => {
                return (
                  <Fragment key={i}>
                    <Skeleton>
                      <Heading size="xs">&nbsp;</Heading>
                    </Skeleton>
                    <Skeleton my={4} colorScheme="green">
                      <Progress size="md" />
                    </Skeleton>
                  </Fragment>
                );
              })}
            </TabPanel>
            <TabPanel
              pl={0}
              py={4}
              sx={{ maxHeight: "450px", overflow: "auto" }}
            ></TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  </Box>
);
