import {
  pcRequest
} from "../request/index";

export function getBgmdetil(ids) {
  return pcRequest.get({
    url: "/song/detail",
    data: {
      ids,
    },
  });
}
export function getSongUrl(id,level="lossless") {
  return pcRequest.get({
    url: "/song/url",
    data: {
      id,
      level
    },
  });
}
export function getLyric(id) {
  return pcRequest.get({
    url: "/lyric",
    data: {
      id
    },
  });
}
export function getLyric2(id) {
  return pcRequest.get({
    url: "/lyric/new",
    data: {
      id
    },
  });
}
