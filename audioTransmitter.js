var audioTransmitter = (function () {
  var audioRecorder

  new AudioStream().getRecorder().then(recorder => {
    audioRecorder = recorder;
  });

  function start(_this) {
    _this.value = "HABLA";
    audioRecorder.start();
    _this.parentElement.parentElement.parentElement.style.background = '#141414 url(assets/wave.gif)';
    _this.parentElement.parentElement.parentElement.style.backgroundRepeat = 'repeat-x';
    _this.parentElement.parentElement.parentElement.style.backgroundSize = '100% 100%';
  }

  function stop(_this) {
    _this.value = "PRESIONA PARA HABLAR";
    audioRecorder.stop();
    _this.parentElement.parentElement.parentElement.style.background = '#141414';
  }

  function transmitAudioData(data) {
    var base64String = btoa(
      new Uint8Array(data)
        .reduce((onData, byte) => onData + String.fromCharCode(byte), ''));

    var dataToSend = constructData('binary', base64String)
    audioBridge.send(dataToSend);
  }

  function transmitMetadata(metadata) {
    var dataToSend = constructData('metadata', metadata);
    audioBridge.send(dataToSend);
  }

  function transmitStartData() {
    var dataToSend = constructData('started', 'started')
    audioBridge.send(dataToSend);
  }

  function transmitStopData() {
    var dataToSend = constructData('stopped', 'stopped')
    audioBridge.send(dataToSend);
  }

  function constructData(event, data) {
    dataToSend = {}
    dataToSend.user = gunDB._.opt.pid
    dataToSend.event = event
    dataToSend.timestamp = new Date().getTime();

    if (event == 'metadata') {
      dataToSend.data = JSON.stringify(data);
    } else if (event == 'binary') {
      dataToSend.data = data;
    }

    return dataToSend;
  }

  return {
    start: start,
    stop: stop,
    transmitStartData: transmitStartData,
    transmitStopData: transmitStopData,
    transmitMetadata: transmitMetadata,
    transmitAudioData: transmitAudioData
  };

})();
