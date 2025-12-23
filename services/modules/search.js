import {
  pcRequest
} from "../request/index";

export function getHotSearch() {
  return pcRequest.get({
    url: "/search/hot",
  });
}

export function getSuggestSearch(keywords) {
  return pcRequest.get({
    url: "/search/suggest",
    data: {
      keywords,
    },
  });
}

export function getSearchResult(keywords) {
  return pcRequest.get({
    url: "/search",
    data: {
      keywords
    }
  });
}