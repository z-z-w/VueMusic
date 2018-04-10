import {commonParams, options} from "./config";
import axios from "axios/index";
import jsonp from "../common/js/jsonp";

export function getTopList() {
    const url = '/api/getTopList';

    const data = Object.assign({}, commonParams, {
      format: 'json',
      notice: 0,
      platform: 'h5',
      needNewCode: 1
    });

    return axios.get(url, {
      params: data
    }).then((res) => {
      return Promise.resolve(res.data);
    })
}

export function getMusicList(id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 957098848,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })

  return jsonp(url, data, options);
}