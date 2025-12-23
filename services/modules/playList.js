import {
  pcRequest
} from "../request/index";

export function getMusicList(id) {
  return pcRequest.get({
    url: "/playlist/detail",
    data: {
      id,
    },
  });
}

// Get playlist tracks with pagination support
export function getPlaylistTracks(id, limit = 50, offset = 0) {
  return pcRequest.get({
    url: "/playlist/track/all",
    data: {
      id,
      limit,
      offset,
    },
  });
}