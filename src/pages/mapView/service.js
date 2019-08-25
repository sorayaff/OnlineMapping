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
export function getLayer(datasetId) {
  let id = datasetId.datasetId;
  return headerRequest({
    url: 'v1.0/api/dataset/'+id+'/layersV2',
    method: 'GET',
  });
}

