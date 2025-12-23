import { pcRequest } from "../request/index";

export function getTopMV(offset = 0, limit = 20) {
  return pcRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
    },
  });
}
export function getTopOtherMV(offset = 0, limit = 20, area = "港台") {
  return pcRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
      area,
    },
  });
}
export function getMVUrl(id) {
  return pcRequest.get({
    url: "/mv/url",
    data: {
      id,
    },
  });
}

export function getMVInfo(mvid) {
  return pcRequest.get({
    url: "/mv/detail",
    data: {
      mvid,
    },
  });
}

export function getMVRelated(id) {
  return pcRequest.get({
    url: "/related/allvideo",
    data: {
      id,
    },
  });
}
