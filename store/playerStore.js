import {
    observable,
    action
} from 'mobx-miniprogram'
import {
    getBgmdetil,
    getLyric,
    getSongUrl
} from '../services/index'

export const audioContext = wx.getBackgroundAudioManager()

function parseLyric(lyricString) {
    const lines = lyricString.split("\n");
    const pattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
    const lrcData = lines
        .map((line) => {
            const match = line.match(pattern);
            if (match) {
                const time =
                    parseInt(match[1], 10) * 60 * 1000 +
                    parseInt(match[2], 10) * 1000 +
                    (match[3].length === 3 ? parseInt(match[3], 10) : parseInt(match[3], 10) * 10);
                return {
                    time,
                    text: match[4].trim(),
                };
            }
            return null;
        })
        .filter((item) => item);
    return lrcData;
}

export const playerStore = observable({
    // State
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,
    isPlaying: false,
    playModeIndex: 0, // 0: order, 1: repeat, 2: random
    playSongList: [],
    playSongIndex: 0,

    // Actions
    setPlaySongList: action(function (list) {
        this.playSongList = list
    }),

    setPlaySongIndex: action(function (index) {
        this.playSongIndex = index
    }),

    playMusicWithSongIdAction: action(function (id) {
        if (this.id === id && this.isPlaying) {
            return
        }

        this.id = id
        this.isPlaying = true
        this.lyricInfos = []
        this.currentLyricText = ""
        this.currentLyricIndex = -1
        this.currentTime = 0
        this.durationTime = 0

        // 1. Get Detail
        getBgmdetil(id).then(res => {

            if (res.songs && res.songs.length > 0) {
                this.currentSong = res.songs[0]
                this.durationTime = res.songs[0].dt
                audioContext.title = this.currentSong.name
                audioContext.epname = this.currentSong.al.name
                audioContext.singer = this.currentSong.ar[0].name
                audioContext.coverImgUrl = this.currentSong.al.picUrl
            } else {
                console.error('No song details found for id:', id);
            }
        }).catch(err => {
            console.error('getBgmdetil error:', err);
        })

        // 2. Get URL
        getSongUrl(id).then(res => {
            const url = res.data[0].url
            if (url) {
                audioContext.src = url
                audioContext.play()
            }
        })

        // 3. Get Lyric
        getLyric(id).then(res => {
            const lyricString = res.lrc.lyric
            const lyrics = parseLyric(lyricString)
            this.lyricInfos = lyrics
        })
    }),

    changeMusicStatusAction: action(function () {
        this.isPlaying = !this.isPlaying
        if (this.isPlaying) {
            audioContext.play()
        } else {
            audioContext.pause()
        }
    }),

    changePlayModeAction: action(function () {
        this.playModeIndex = (this.playModeIndex + 1) % 3
    }),

    seekToTime: action(function (timeInSeconds) {
        if (!audioContext.src) {
            console.warn('No audio source, cannot seek');
            return;
        }

        // Seek to the specified time
        audioContext.seek(timeInSeconds);

        // Update current time immediately for UI responsiveness
        this.currentTime = timeInSeconds * 1000;


    }),

    playNewMusicAction: action(function (isNext = true) {
        let index = this.playSongIndex
        const length = this.playSongList.length
        if (length === 0) return

        if (this.playModeIndex === 2) { // Random
            let newIndex = Math.floor(Math.random() * length)
            if (length > 1) {
                while (newIndex === index) {
                    newIndex = Math.floor(Math.random() * length)
                }
            }
            index = newIndex
        } else {
            // Order or Repeat (Manual switch)
            if (isNext) {
                index = index + 1
            } else {
                index = index - 1
            }
            if (index >= length) index = 0
            if (index < 0) index = length - 1
        }

        this.playSongIndex = index
        const nextSong = this.playSongList[index]
        if (nextSong) {
            this.playMusicWithSongIdAction(nextSong.id)
        }
    }),

    restartMusic: action(function () {
        this.isPlaying = true
        this.currentTime = 0
        this.currentLyricIndex = -1
        this.currentLyricText = ""

        // Re-assign src to force restart
        const url = audioContext.src
        if (url) {
            audioContext.src = url
            audioContext.title = this.currentSong.name
            audioContext.epname = this.currentSong.al.name
            audioContext.singer = this.currentSong.ar[0].name
            audioContext.coverImgUrl = this.currentSong.al.picUrl
            audioContext.play()
        }
    }),

    // Sync Actions
    setAudioStatus: action(function (isPlaying) {
        this.isPlaying = isPlaying
    }),

    setAudioTime: action(function (currentTime) {
        this.currentTime = currentTime

        if (!this.lyricInfos.length) return
        let index = -1
        for (let i = 0; i < this.lyricInfos.length; i++) {
            if (this.lyricInfos[i].time > currentTime) {
                index = i - 1
                break
            }
        }
        // If reached end
        if (index === -1 && currentTime > this.lyricInfos[0]?.time) {
            index = this.lyricInfos.length - 1
        }

        if (index !== this.currentLyricIndex) {
            this.currentLyricIndex = index
            this.currentLyricText = this.lyricInfos[index]?.text || ""
        }
    })
})

// Audio Context Listeners
audioContext.onPlay(() => {
    playerStore.setAudioStatus(true)
})
audioContext.onPause(() => {
    playerStore.setAudioStatus(false)
})
audioContext.onStop(() => {
    playerStore.setAudioStatus(false)
})
audioContext.onTimeUpdate(() => {
    const currentTime = audioContext.currentTime * 1000
    playerStore.setAudioTime(currentTime)
})
audioContext.onEnded(() => {
    if (playerStore.playModeIndex === 1) { // Repeat One
        playerStore.restartMusic()
    } else {
        playerStore.playNewMusicAction(true)
    }
})

export default playerStore
