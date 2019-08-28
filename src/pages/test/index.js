import React from 'react';
import router from 'umi/router';
import { Slider ,Tree} from 'antd';
import moment from 'moment';
import { stringify} from 'qs'
const {TreeNode} = Tree;
export default class Test extends React.Component {
  handleClick = () => {
    router.push({
      pathname: '/mapView',
      query: {
        id: '11111',
        name: 'ye',
      },
    });
  };


  render() {
    const style = {
      float: 'left',
      width: 300,
      marginLeft: 70,
    };
    const marks = {
      0: '0°C',
      26: '26°C',
      37: '37°C',
      100: {
        style: {
          color: '#f50',
        },
        label: <strong>100°C</strong>,
      },
    };
    let t1 = moment('1990-01-01 00:00:00').valueOf();
    let t2 = moment('2010-01-01 00:00:00').valueOf();
    const transTime = (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    };

    let aa = stringify({a:'aaa',b:'bbbbb'})
    return <div>
      {aa}
      <div onClick={this.handleClick}>
        test
      </div>
      <Tree checkable>
        <TreeNode title={"sad"} ley='111' checkable={false}/>
        <TreeNode title={"sad"} ley='111'/>
        <TreeNode title={"sad"} ley='112'/>
      </Tree>
      <div style={style}>
        <Slider  min={t1} max={t2} tipFormatter={(value) => transTime(value)}/>
      </div>
    </div>;
  }
}
