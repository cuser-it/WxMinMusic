import { PCEventStore } from "pc-event-store";
import { getPlaylistDetail } from "../services/index";
const recommendStore = new PCEventStore({
  state: {
    recommendSongInfo: {},
  },
  actions: {
    fetchRecommendSongsAction(ctx) {
      getPlaylistDetail().then((res) => {
        ctx.recommendSongInfo = res.playlist;
      });
    },
  },
});


export default recommendStore