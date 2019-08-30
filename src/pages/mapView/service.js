import headerRequest from '@/utils/HeaderRequest';
import request from '@/utils/request';
import imgRequest from '@/utils/imgRequest';
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

//按标签查找数据集
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

//返回用户自定义colormap样式列表
export function getColormapList() {
  return request({
    url: '/v1.0/api/colormap/custom',
    method: 'GET',
    headers:{
      AccessKey:'d26c2762b29145e796b3ccdeb4668bd6',
      SecretKey:'ef0588377a2f072527dfc107d7c52c87'
    }
  });
}

//获取某个colormap的具体样式
export function getColormapById(colormapId) {
  return request({
    url: '/v1.0/api/colormap/custom/' + colormapId.colorMapId,
    method: 'GET',
    headers:{
      AccessKey:'d26c2762b29145e796b3ccdeb4668bd6',
      SecretKey:'ef0588377a2f072527dfc107d7c52c87'
    }
  });
}

//获取某个colormap的图片
export function getColormapPicById(colormapId) {
  return imgRequest({
    url: '/v1.0/api/colormap/img/' + colormapId.colorMapId,
    method: 'GET',
    headers:{
      AccessKey:'d26c2762b29145e796b3ccdeb4668bd6',
      SecretKey:'ef0588377a2f072527dfc107d7c52c87'
    }
  });
}
