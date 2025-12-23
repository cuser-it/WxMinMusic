// pages/music-player/music-player.js
import { playerStore, audioContext } from "../../../store/playerStore";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { reaction } from "mobx-miniprogram";

const app = getApp();

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

const modeNames = ["order", "repeat", "random"];

Page({
  data: {
    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    isPlaying: true,

    playSongIndex: 0,
    // playSongList removed - access directly from playerStore to avoid large setData
    playlistTotalCount: 0, // Track total count for UI display
    isFirstPlay: true,

    playModeName: "order",

    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false,

    lyricScrollTop: 0,
    showPlaylist: false,
    scrollToSongId: '', // For scroll-into-view in playlist

    // Lyric scroll control
    userInteractingWithLyrics: false,
    lyricScrollTimer: null,

    // Pagination for playlist
    displayedSongList: [],
    pageSize: 50,
    currentLoadedCount: 0,
    hasMoreData: true,
    isLoadingMore: false,
  },
  onLoad(options) {
    // 0.获取设备信息
    this.setData({
      contentHeight: app.globalData.contentHeight,
    });

    // 1.获取传入的id
    const id = options.id;


    // 2.绑定store
    this.storeBindings = createStoreBindings(this, {
      store: playerStore,
      fields: [
        "id",
        "currentSong",
        "durationTime",
        "currentTime",
        "lyricInfos",
        "currentLyricText",
        "currentLyricIndex",
        "isPlaying",
        "playModeIndex",
        // Removed playSongList from bindings to avoid large setData
        "playSongIndex",
      ],
      actions: [
        "playMusicWithSongIdAction",
        "changeMusicStatusAction",
        "playNewMusicAction",
        "changePlayModeAction",
      ],
    });

    // 3.根据id播放歌曲
    if (id) {
      this.playMusicWithSongIdAction(id);
    }

    // 4. setup reactions for side effects
    // Update progress
    this.disposer1 = reaction(
      () => playerStore.currentTime,
      (currentTime) => {
        this.updateProgress(currentTime);
      }
    );

    // Update lyric scroll (only if user is not interacting)
    this.disposer2 = reaction(
      () => playerStore.currentLyricIndex,
      (currentLyricIndex) => {
        // Don't auto-scroll if user is manually scrolling
        if (!this.data.userInteractingWithLyrics) {
          this.setData({
            lyricScrollTop: currentLyricIndex * 35,
          });
        }
      }
    );

    // Update play mode name
    this.disposer3 = reaction(
      () => playerStore.playModeIndex,
      (playModeIndex) => {
        this.setData({ playModeName: modeNames[playModeIndex] });
      }
    );

    // Debug: Log currentSong updates
    this.disposer4 = reaction(
      () => playerStore.currentSong,
      (song) => {

        this.storeBindings.updateStoreBindings();
      }
    );

    // Track playlist count for UI display
    this.disposer5 = reaction(
      () => playerStore.playSongList.length,
      (count) => {
        this.setData({ playlistTotalCount: count });
      }
    );

    // Initialize playlist count
    this.setData({ playlistTotalCount: playerStore.playSongList.length });
  },

  updateProgress: throttle(
    function (currentTime) {
      if (this.data.isSliderChanging) return;
      // 1.记录当前的时间 2.修改sliderValue
      const sliderValue = (currentTime / this.data.durationTime) * 100;
      this.setData({ currentTime, sliderValue });
    },
    800,
    { leading: false, trailing: false }
  ),

  // ==================== 事件监听 ====================
  onNavBackTap() {
    wx.navigateBack();
  },
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current });

    // Clear lyric interaction flag when switching to lyrics page
    // This ensures auto-scroll works immediately after page change
    if (event.detail.current === 1) { // Lyrics page
      if (this.data.lyricScrollTimer) {
        clearTimeout(this.data.lyricScrollTimer);
      }
      this.setData({
        userInteractingWithLyrics: false,
        lyricScrollTimer: null
      });
    }
  },

  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentPage: index });

    // Clear lyric interaction flag when switching to lyrics page
    if (index === 1) { // Lyrics page
      if (this.data.lyricScrollTimer) {
        clearTimeout(this.data.lyricScrollTimer);
      }
      this.setData({
        userInteractingWithLyrics: false,
        lyricScrollTimer: null
      });
    }
  },

  onSliderChange(event) {
    this.data.isWaiting = true;
    setTimeout(() => {
      this.data.isWaiting = false;
    }, 1500);
    // 1.获取点击滑块位置对应的value
    const value = event.detail.value;

    // 2.计算出要播放的位置时间
    const currentTime = (value / 100) * this.data.durationTime;

    // 3.设置播放器, 播放计算出的时间
    audioContext.seek(currentTime / 1000);
    this.setData({ currentTime, isSliderChanging: false, sliderValue: value });
  },
  // 节流throttle
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value;

    // 2.根据当前的值, 计算出对应的时间
    const currentTime = (value / 100) * this.data.durationTime;
    this.setData({ currentTime });

    // 3.当前正在滑动
    this.data.isSliderChanging = true;
  }, 100),
  onPlayOrPauseTap() {
    this.changeMusicStatusAction();
  },
  onPrevBtnTap() {
    this.playNewMusicAction(false);
  },
  onNextBtnTap() {
    this.playNewMusicAction(true);
  },

  // Lyric tap to seek
  onLyricTap(event) {
    const { index, time } = event.currentTarget.dataset;

    // Convert milliseconds to seconds for audioContext.seek()
    const seekTime = time / 1000;



    // Seek audio to the tapped lyric's timestamp
    playerStore.seekToTime(seekTime);
  },

  // Handle user touching lyrics (pause auto-scroll)
  onLyricTouchStart() {
    this.pauseLyricAutoScroll();
  },

  onLyricTouchMove() {
    this.pauseLyricAutoScroll();
  },

  onLyricTouchEnd() {
    this.pauseLyricAutoScroll();
  },

  pauseLyricAutoScroll() {
    // Clear existing timer
    if (this.data.lyricScrollTimer) {
      clearTimeout(this.data.lyricScrollTimer);
    }

    // Set flag to prevent auto-scroll
    this.setData({ userInteractingWithLyrics: true });

    // Resume auto-scroll after 2 seconds
    const timer = setTimeout(() => {
      this.setData({
        userInteractingWithLyrics: false,
        lyricScrollTimer: null
      });

    }, 2000);

    this.setData({ lyricScrollTimer: timer });
  },


  onModeBtnTap() {
    this.changePlayModeAction();
  },
  onPlaylistBtnTap() {


    // Initialize pagination when opening playlist
    // Access playSongList directly from store to avoid large setData
    const totalSongs = playerStore.playSongList.length;
    const currentSongId = this.data.currentSong.id;

    // Find the index of current song in the full playlist
    const currentSongIndex = playerStore.playSongList.findIndex(song => song.id === currentSongId);

    // Calculate how many songs to load initially to include the current song
    let initialLoad = this.data.pageSize;
    if (currentSongIndex !== -1 && currentSongIndex >= this.data.pageSize) {
      // Load enough songs to include the current song
      initialLoad = Math.min(
        Math.ceil((currentSongIndex + 1) / this.data.pageSize) * this.data.pageSize,
        totalSongs
      );
    }

    this.setData({
      showPlaylist: true,
      displayedSongList: playerStore.playSongList.slice(0, initialLoad),
      currentLoadedCount: initialLoad,
      hasMoreData: initialLoad < totalSongs,
      isLoadingMore: false,
      scrollToSongId: currentSongId ? `song-${currentSongId}` : ''
    });
  },
  onClosePlaylistTap() {
    this.setData({
      showPlaylist: false,
      scrollToSongId: '' // Reset scroll target
    });
  },
  loadMoreSongs() {
    // Prevent duplicate loading
    if (this.data.isLoadingMore || !this.data.hasMoreData) {
      return;
    }

    const totalSongs = playerStore.playSongList.length;
    const currentCount = this.data.currentLoadedCount;

    // Check if there's more data to load
    if (currentCount >= totalSongs) {
      this.setData({ hasMoreData: false });
      return;
    }

    // Set loading state
    this.setData({ isLoadingMore: true });

    // Simulate slight delay for smooth UX (optional, can be removed if not needed)
    setTimeout(() => {
      const nextBatchSize = Math.min(this.data.pageSize, totalSongs - currentCount);
      const newSongs = playerStore.playSongList.slice(currentCount, currentCount + nextBatchSize);

      this.setData({
        displayedSongList: [...this.data.displayedSongList, ...newSongs],
        currentLoadedCount: currentCount + nextBatchSize,
        hasMoreData: currentCount + nextBatchSize < totalSongs,
        isLoadingMore: false
      });
    }, 100);
  },
  onScrollToLower() {
    // Triggered when scrolling near the bottom
    this.loadMoreSongs();
  },
  onPlaySongTap(event) {
    const displayedIndex = event.currentTarget.dataset.index;
    const selectedSong = this.data.displayedSongList[displayedIndex];

    // Find the actual index in the full playSongList from store
    const actualIndex = playerStore.playSongList.findIndex(song => song.id === selectedSong.id);

    if (actualIndex !== -1) {
      this.setData({ showPlaylist: false });
      this.playMusicWithSongIdAction(selectedSong.id);
    }
  },
  stopProp() {
    // Prevent event propagation
  },

  onUnload() {
    if (this.storeBindings) {
      this.storeBindings.destroyStoreBindings();
    }
    if (this.disposer1) this.disposer1();
    if (this.disposer2) this.disposer2();
    if (this.disposer3) this.disposer3();
    if (this.disposer4) this.disposer4();
    if (this.disposer5) this.disposer5();
  },
});
