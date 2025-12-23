import {
  pcRequest
} from "../request/index";

export function getMusicBanner(type = 0) {
  return pcRequest.get({
    url: "/banner",
    data: {
      type,
    },
  });
}

export function getPlaylistDetail(id = 3778678) {
  return pcRequest.get({
    url: "/personalized",
    data: {
      id,
    },
  });
}
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return pcRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset,
    },
  });
}

export function getSongMenuTag() {
  return pcRequest.get({
    url: "/playlist/hot",
  });
}
export function RecommendNewMusic() {
  return pcRequest.get({
    url: "/personalized/newsong",
  });
}