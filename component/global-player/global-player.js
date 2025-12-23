import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { playerStore } from '../../store/playerStore';

Component({
    behaviors: [storeBindingsBehavior],

    data: {
        hasSongs: false
    },

    storeBindings: {
        store: playerStore,
        fields: {
            currentSong: 'currentSong',
            isPlaying: 'isPlaying',
            id: 'id'
        }
    },

    lifetimes: {
        attached() {
            // Initialize hasSongs immediately from store to reduce flicker
            const hasSongs = !!playerStore.id;
            if (hasSongs) {
                this.setData({ hasSongs });
            }
        }
    },

    observers: {
        'id': function (newId) {
            // Update hasSongs when id changes
            this.setData({ hasSongs: !!newId });
        }
    },

    methods: {
        navigateToPlayer() {
            wx.navigateTo({
                url: '/packagePlayer/pages/music-player/music-player'
            });
        }
    }
});
