import { WatchPage } from "@/components/watch/WatchPage";
import { makeWatchProps } from "@/lib/watchProps";

export default WatchPage;
export const getServerSideProps = makeWatchProps("movie");
