import { useEffect, useState } from "react";
import FeedTabs from "@/components/Feed/FeedTabs";
import { useSearchParams } from "react-router-dom";
import FeedPosts from "@/components/Feed/FeedPosts";

const Feed = () => {
  const [searchParams] = useSearchParams();

  const initialTab =
    searchParams.get("feed") === "following"
      ? "/following"
      : searchParams.get("tag")
      ? `/${searchParams.get("tag")}`
      : "/";

  const [currentTab, setCurrentTab] = useState<string>(initialTab);

  useEffect(() => {
    const feedParam = searchParams.get("feed");
    const tagParam = searchParams.get("tag");
    if (feedParam === "following" && currentTab !== "/following") {
      setCurrentTab("/following");
    } else if (tagParam && currentTab !== `/${tagParam}`) {
      setCurrentTab(`/${tagParam}`);
    } else if (!tagParam && !feedParam && currentTab !== "/") {
      setCurrentTab("/");
    }
  }, [searchParams, currentTab]);

  return (
    <div>
      <FeedTabs currentTab={currentTab} />
      <FeedPosts currentTab={currentTab} />
    </div>
  );
};

export default Feed;
