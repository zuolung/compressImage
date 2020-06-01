# compressimage-ro
   compress image， size 30% after compressed
### 安装
    npm i compressimage-ro -S
###  使用
```
import React from "react";
import pressImg from "compressImage-ro";

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleChange = () => {
    console.log(this.refs)
    pressImg({
      file: this.refs["fileImg"].files[0],
      succ: (resultFile, compressInfo) => {
        //如果不是null就是压缩成功
        if (resultFile) {
          //TODO
          console.log(resultFile, compressInfo)
          document.querySelector("#showImage").src = resultFile.base64;
          this.setState({
            compressInfo
          })
        }
      }
    })
  }

  render() {
    return (
      <div>
        <input
          type="file"
          ref="fileImg"
          className="fileImg"
          style={{ outline: "none" }}
          onChange={this.handleChange}
        />
        <img src="" id="showImage" style={{ width: 400 }} />
        <div style={{ margin: 50, color: "green" }}>{this.state.compressInfo}</div>
      </div>
    )
  }
}
```
