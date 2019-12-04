export class Sound {
  track: any;
  arrayBuffer: any;

  constructor(filepath) {
    this.getFile(filepath);
  }

  async play() {
    //@ts-ignore
    const trackSource = soundService.audioCtx.createBufferSource();
    trackSource.buffer = this.track;
    //@ts-ignore
    trackSource.connect(soundService.audioCtx.destination);
    trackSource.start();
  }

  async getFile(filepath) {
    const response = await fetch(filepath);
    this.arrayBuffer = await response.arrayBuffer();
  }
}

class SoundService {
  audioCtx;

  private sounds: any[] = [];

  initializeAudioCtx() {
    //@ts-ignore
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds.forEach(async sound => {
      sound.track = await this.audioCtx.decodeAudioData(sound.arrayBuffer);
    })
  }

  registerSound(sound: Sound) {
    this.sounds.push(sound);
  }
}

export const soundService = new SoundService();