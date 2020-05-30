/**
* @param {二进制文件流} file 
* @param {回调函数，返回base64} fn 
*/
function changeFileToBaseURL(file, fn) {
  // 创建读取文件对象
  var fileReader = new FileReader();
  //如果file没定义返回null
  if (file == undefined) return fn(null);
  // 读取file文件,得到的结果为base64位
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    // 把读取到的base64
    var imgBase64Data = this.result;
    fn(imgBase64Data);
  }
}

/**
 * 将base64转换为文件
 * @param {baseURL} dataurl 
 * @param {文件名称} filename 
 * @return {文件二进制流}
*/
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
* canvas压缩图片
* @param {参数obj} param 
* @param {文件二进制流} param.file 必传
* @param {输出图片宽度} param.width 不传初始赋值-1，等比缩放不用传高度
* @param {输出图片名称} param.fileName 不传初始赋值image
* @param {压缩图片程度} param.quality 不传初始赋值0.66。值范围0~1
* @param {回调函数} param.succ 必传 @return { base64, file }, compressInfo
*/
export default function pressImg(param) {
  //如果没有回调函数就不执行
  if (param && param.succ) {
    //如果file没定义返回null
    if (param.file == undefined) return param.succ(null);
    //给参数附初始值
    param.targetSize = param.hasOwnProperty("targetSize") ? param.targetSize : -1;
    param.width = param.hasOwnProperty("width") ? param.width : -1;
    param.fileName = param.hasOwnProperty("fileName") ? param.fileName : "image";
    param.quality = param.hasOwnProperty("quality") ? param.quality : 0.66;
    var _this = this;
    // 得到文件类型
    var fileType = param.file.type;
    if (fileType.indexOf("image") == -1) {
      console.log('请选择图片文件^_^');
      return param.succ(null);
    }
    // 读取file文件,得到的结果为base64位
    changeFileToBaseURL(param.file, function (base64) {
      if (base64) {
        var image = new Image();
        image.src = base64;
        image.onload = function () {
          var scale = this.width / this.height;
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = param.width == -1 ? this.width : param.width;
          canvas.height = param.width == -1 ? this.height : parseInt(param.width / scale);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          var newImageData = canvas.toDataURL(fileType, param.quality);
          var resultFile = dataURLtoFile(newImageData, param.fileName);

          param.succ({
            base64: newImageData,
            file: resultFile
          }, `${(param.file.size / 1024 / 1024).toFixed(2)}M compress to ${(resultFile.size / 1024 / 1024).toFixed(2)}M`);
        }
      }
    });
  }
}