import headerRequest from '@/utils/HeaderRequest';
import { stringify } from 'qs';

// 获取查询到的数据集
export function getDataset({ tag1 = null, tag2 = null, start = 0, length = 16, algebra = 'and' }) {
  tag1 = tag1 ? tag1.replace(/\s+/g, ',') : tag1;
  tag2 = tag2 ? tag2.replace(/\s+/g, ',') : tag2;
  return headerRequest({
    url: 'v1.0/api/dataset/getDatasetByTags',
    method: 'GET',
    data: {
      tags: tag1,
      start: start,
      length: length,
      algebra: algebra,
    },
  });
}

// 获取查询到的图层
export function getLayer(payload) {
  return headerRequest({
    url: 'v1.0/api/dataset/' + payload + '/layersV2',
    method: 'GET',
  });
}

//获取标签组列表
export function getTagGroups() {
  return headerRequest({
    url: '/v1.0/api/tags/group/map?type=dataset',
    method: 'GET',
  });
}

//获取标签列表
export function getTags(groupId) {
  return headerRequest({
    url: '/v1.0/api/tags/group/' + groupId,
    method: 'GET',
  });
}

export function getDatasetByTags({tags=[],start=0,length=10,algebra='and'}) {
  return headerRequest({
    url: '/v1.0/api/dataset/getDatasetByTags',
    method: 'GET',
    data: {
      tags:tags.toString() ,
      start: start,
      length: length,
      algebra: algebra,
    },
  });
}
