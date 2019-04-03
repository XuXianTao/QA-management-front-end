
const is_dev = process.env.NODE_ENV === 'development';
const url = is_dev?'ws://dev.local:9508': 'ws://xuxiantao.xin:9508'

let WsImportProgress = function(obj) {
  let ws = new WebSocket(url);
  ws.onopen = () => {
    obj.onOpen(ws)
  }
  ws.onmessage = (ev) => {
    obj.onMessage(ws, ev)
  }
  ws.onerror = ev => {
    obj.onError(ev)
  }
  
  return ws
}

export default WsImportProgress
