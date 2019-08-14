import { parse, stringify } from 'qs';
import { Icon, notification } from 'antd';
// 获取本地存储
export function getLocalData({ dataName }) {
  return localStorage.getItem(dataName);
}

// 设置本地存储
export function setLoalData({ dataName, dataList }) {
  localStorage.setItem(dataName, dataList);
}

// 本地存储是否存在
export function isSetLoacl({ dataName }) {
  return localStorage.hasOwnProperty(dataName);
}

// 本地存储删除
export function delLoalData(arr) {
  arr.forEach((item, index) => {
    localStorage.removeItem(item);
  });
}

export const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1225009_up9fzs0e5u.js',
});


// 判断空对象
export function isEmptyObject(obj) {
  if (obj) {
    let arr = Object.keys(obj);
    if (arr.length === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function ApiNotification(code, message) {
  let successTest = /^2\d*/,
    warningText = /^4\d*/,
    errorText = /^[56]\d*/;
  let tipTest = '';
  if (successTest.test(code)) {
    tipTest = 'success';
  } else if (warningText.test(code)) {
    tipTest = 'warning';
  } else if (errorText.test(code)) {
    tipTest = 'error';
  } else {
    tipTest = 'error';
    message = '系统繁忙，请稍后再试';
  }
  if (code === 600) {
    message = '网络连接超时';
  }
  // 取消登录过期的提示
  if (/^NOT_ACCEPTABLE:+/.test(message)) {
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  } else {
    notification[tipTest]({ message: tipTest, description: message });
  }
}
