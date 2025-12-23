import { getMusicList, getPlaylistTracks } from "../../services/index";
import { playerStore } from "../../store/playerStore";

Component({
  properties: {
    musicid1: {
      type: Number,
      value: 0,
      observer: async function (newVal, oldVal) {
        // 当musicid1属性变化时，执行数据获取和更新
        if (newVal !== oldVal && newVal !== 0) {
          try {
            // Get playlist metadata (basic info)
            const res = await getMusicList(newVal);
            this.setData({
              playlist: res.playlist,
              isLoaded: true,
            });

            // Initialize server-side pagination
            this.data.playlistId = newVal;
            this.data.totalTracks = res.playlist.trackCount;
            await this.loadInitialTracks();

            wx.hideLoading();
          } catch (error) {
            console.error('Failed to load playlist:', error);
            wx.hideLoading();
            wx.showToast({
              title: '加载失败',
              icon: 'none'
            });
          }
        }
      },
    },
  },
  data: {
    playlist: "",
    musicId: "",
    isLoaded: false,

    // Server-side pagination
    playlistId: 0,
    displayedTracks: [],
    pageSize: 50,
    currentOffset: 0,
    totalTracks: 0,
    hasMoreData: true,
    isLoadingMore: false,
  },
  methods: {
    async loadInitialTracks() {
      try {
        const res = await getPlaylistTracks(this.data.playlistId, this.data.pageSize, 0);

        if (res.songs && res.songs.length > 0) {
          this.setData({
            displayedTracks: res.songs,
            currentOffset: res.songs.length,
            hasMoreData: res.songs.length < this.data.totalTracks,
            isLoadingMore: false
          });
        }
      } catch (error) {
        console.error('Failed to load initial tracks:', error);
        this.setData({ isLoadingMore: false });
      }
    },

    async loadMoreSongs() {
      // Prevent duplicate loading
      if (this.data.isLoadingMore || !this.data.hasMoreData) {
        return;
      }

      // Check if we've loaded all tracks
      if (this.data.currentOffset >= this.data.totalTracks) {
        this.setData({ hasMoreData: false });
        return;
      }

      // Set loading state
      this.setData({ isLoadingMore: true });

      try {
        // Fetch next batch from server
        const res = await getPlaylistTracks(
          this.data.playlistId,
          this.data.pageSize,
          this.data.currentOffset
        );

        if (res.songs && res.songs.length > 0) {
          const newOffset = this.data.currentOffset + res.songs.length;

          this.setData({
            displayedTracks: [...this.data.displayedTracks, ...res.songs],
            currentOffset: newOffset,
            hasMoreData: newOffset < this.data.totalTracks,
            isLoadingMore: false
          });
        } else {
          // No more songs returned
          this.setData({
            hasMoreData: false,
            isLoadingMore: false
          });
        }
      } catch (error) {
        console.error('Failed to load more tracks:', error);
        this.setData({ isLoadingMore: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    },

    onScrollToLower() {
      // Triggered when scrolling near the bottom
      this.loadMoreSongs();
    },

    ck1(e) {
      let id = e.currentTarget.dataset.id.id;

      const playlist = this.data.displayedTracks;
      const index = playlist.findIndex(item => item.id == id);

      if (index !== -1) {
        // Set the displayed tracks as the play list
        playerStore.setPlaySongList(this.data.displayedTracks);
        playerStore.setPlaySongIndex(index);
        playerStore.playMusicWithSongIdAction(id);

        wx.navigateTo({
          url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
        });
      }
    },
  },
});
