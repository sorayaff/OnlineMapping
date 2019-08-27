import { stringify } from 'qs';
import request from '@/utils/request';

export function getCountryByIP(params) {
  return request({
    url: `/taobao/service/getIpInfo.php?${stringify(params)}`,
    notification:false,
    method: 'get',
  });
}
