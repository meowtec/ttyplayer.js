# ttyplayer.js
====

ttyplayer.js 是一个浏览器端的 tty 播放器。(IE 10+, Chrome, Firefox, Safari)

[https://meowtec.github.io/ttyplayer.js/](https://meowtec.github.io/ttyplayer.js/)

### Usage
首先安装 ttyrec.

```shell
brew install ttyrec
```

录制 tty 文件：

```shell
ttyrec tty.rec
```

使用 ttyplayer.js 播放 tty 记录文件

```javascript
new TermPlayer({
  parent: document.getElementById('target'),
  // cols, rows 与你的 term 保持一致
  // 下面是推荐尺寸：
  cols: 80,
  rows: 30
}).load('./tty.rec')
```
