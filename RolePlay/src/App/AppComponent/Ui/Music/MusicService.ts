class AudioPlayerService {
  private playlist: {name: string, url: string}[] = [];
  private currentIndex: number = -1;
  private audioElement: HTMLAudioElement | null = null;
  private setCurrentMusics: ((val: string) => void) | null = null;

  init() {
    if (!this.audioElement) {
      this.audioElement = document.getElementById('audio') as HTMLAudioElement;
      this.audioElement.addEventListener('ended', this.playNext.bind(this));

      this.audioElement.addEventListener('play', () => {
        const playButton = document.querySelector('.styled-audio-element::-webkit-media-controls-play-button');
        playButton.classList.remove('paused');
      });

      this.audioElement.addEventListener('pause', () => {
       const playButton = document.querySelector('.styled-audio-element::-webkit-media-controls-play-button');
       playButton.classList.add('paused');
      });
    }
  }

  setPlaylist(tracks: {name: string, url: string}[], setCurrentMusics: (val: string) => void) {
    this.setCurrentMusics = setCurrentMusics;
    this.playlist = tracks;
  }

  playTrack(index: number) {
    if (!this.playlist.length || index < 0 || index >= this.playlist.length) {
      return;
    }
    
    this.currentIndex = index;
    const track = this.playlist[this.currentIndex];
    
    if (this.audioElement) {
      this.audioElement.src = track.url;
      this.audioElement.play();
      document.getElementById('track-info').innerHTML = track.name;
    }
  }

  playPrev() {
    if (!this.playlist.length) return;
    
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.playlist.length - 1;
    }
    
    this.setCurrentMusics && this.setCurrentMusics(this.playlist[prevIndex].url);
    this.playTrack(prevIndex);
  }

  playNext() {
    if (!this.playlist.length) return;
    
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    this.setCurrentMusics && this.setCurrentMusics(this.playlist[nextIndex].url);
    this.playTrack(nextIndex);
  }

  getCurrentTrack() {
    return this.currentIndex >= 0 ? this.playlist[this.currentIndex].url : '';
  }
}

export const audioPlayerService = new AudioPlayerService();