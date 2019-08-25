import React, { Component } from 'react';
import styles from './index.css';
import PDFViewer from '@/components/PDFiframe/index'
import mypdf from '@/assets/ldzbsczk.pdf'

class PDFJs {
  init = (source, element) => {
    const iframe = document.createElement('iframe');

    iframe.src =  `http://localhost:8000/pdfjs-2.1.266-dist/web/viewer.html?file=${source}`;
    iframe.width = '100%';
    iframe.height = '100%';

    element.appendChild(iframe);
  }
}

export default class PDFOnline extends Component {
  constructor() {
    super();
    this.myViewer = React.createRef();
  }

  render() {
    return (
      <div className={styles.pdfContainer}>
        <PDFViewer ref={this.myViewer} backend={PDFJs} src={mypdf} />
      </div>
    );
  }
}


