import { useEffect, useState } from "react";
import { AsideMenu } from "./AsideMenu/AsideMenu";
import { ImagesComponents } from "./ImagesComponent/ImagesComponent";
import { Parameters } from "./Parameters/Parameters";
import { Musics } from "./Music/Music";
import { audioPlayerService } from "./Music/MusicService";

import './App.css';

const allImages = import.meta.glob('../../../../../Data/Картинки/**/*.{png,jpg,jpeg,svg,gif,webp}', { 
  eager: true,
  query: '?url'
});

const foldersWithImages = Object.entries(allImages).reduce((acc, [path, module]) => {
  const parts = path.split('/');
  const rootName = parts[parts.length - 3];
  const folderName = parts[parts.length - 2];
  const imageName = parts[parts.length - 1];

  if (rootName !== 'Картинки') {
    if (!acc[rootName]) {
      acc[rootName] = {};
    }
    
    if (!acc[rootName][folderName]) {
      acc[rootName][folderName] = [];
    }

    acc[rootName][folderName].push({
      name: imageName,
      url: module.default
  });
  } else {
    if (!acc[folderName]) {
      acc[folderName] = [];
    }

    acc[folderName].push({
        name: imageName,
        url: module.default
    })};

  return acc;
}, {} as Record<string, Array<{name: string, url: string}>>);

const folders = Object.keys(foldersWithImages);


const allMetrics = import.meta.glob('../../../../../Data/Показатели/**/*.{js,ts}', {
  eager: true
});

const foldersStats = Object.entries(allMetrics).reduce((acc, [path, module]) => {
  const parts = path.split('/');
  const folderName = parts[parts.length - 1];

  acc[folderName.split('.')[0]] = module.default;

  return acc;
}, {} as Record<string, Array<{name: string, url: string}>>);


const allMusics = import.meta.glob('../../../../../Data/Музыка/**/*.{mp3,wav,ogg}', {
  eager: true,
  query: '?url'
});

const foldersWithMusics = Object.entries(allMusics).reduce((acc, [path, module]) => {
  const parts = path.split('/');
  const folderName = parts[parts.length - 2];
  const musicName = parts[parts.length - 1];

  if (!acc[folderName]) {
    acc[folderName] = [];
  }

  acc[folderName].push({
      name: musicName.split('.')[0],
      url: module.default
  });

  return acc;
}, {} as Record<string, Array<{name: string, url: string}>>);

const foldersMusics = Object.keys(foldersWithMusics);

const allImagesMonitors = import.meta.glob('../../../../../Data/Монитор/**/*.{png,jpg,jpeg,svg,gif,webp}', { 
  eager: true,
  query: '?url'
});

const foldersWithImagesMonitors = Object.entries(allImagesMonitors).reduce((acc, [path, module]) => {
  const parts = path.split('/');
  const folderName = parts[parts.length - 2];
  const imageName = parts[parts.length - 1];

  if (!acc[folderName]) {
      acc[folderName] = [];
  }

  acc[folderName].push({
      name: imageName,
      url: module.default
  });

  return acc;
}, {} as Record<string, Array<{name: string, url: string}>>);

const foldersMonitors = Object.keys(foldersWithImagesMonitors);

const App = () => {
  const [pageState, setPageState] = useState('Управление монитором');
  const isArrayAdditionalFolders = Array.isArray(foldersWithImages[pageState]);

  useEffect(() => {
    setTimeout(() => {
      audioPlayerService.init();
    }, 0);
  }, []);

  return (
    <div className={'app'}>
      <div className={'app__body'}>
        <AsideMenu 
          pageState={pageState} 
          setPageState={setPageState}
          options={folders}
        />

        <div className={'app__main'}>
          {pageState === 'Управление монитором' && <ImagesComponents folders={foldersMonitors} foldersWithImages={foldersWithImagesMonitors} isMonitor/>}
          {folders.includes(pageState) && <ImagesComponents folders={isArrayAdditionalFolders ? [pageState] : Object.keys(foldersWithImages[pageState])} foldersWithImages={isArrayAdditionalFolders ? {[pageState]:foldersWithImages[pageState]} : foldersWithImages[pageState]}/>}
          {pageState === 'Статы' && <Parameters options={Object.keys(foldersStats)} parameters={foldersStats}/>}
          {pageState === 'Музыка' && <Musics options={foldersMusics} musics={foldersWithMusics}/>}
        
        </div>
      </div>

{/* 
  <audio className="audio-loop" loop controls id="audio-loop"></audio> */}

 <div className="custom-native-audio-player">
  <div className="player-container">
    <div className="track-info">
      <div className="track-name" id={'track-info'}>МузыкА</div>
      <div/>
    </div>
    
    <div className="player-controls">
      <button className="control-btn prev-btn" title="Предыдущий трек" onClick={() => audioPlayerService.playPrev()}>
        <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
      </button>
      
      <audio controls id="audio" className="styled-audio-element">
        Your browser does not support the audio element.
      </audio>
      
      <button className="control-btn next-btn" title="Следующий трек" onClick={() => audioPlayerService.playNext()}>
        <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>
  </div>
</div>
</div>
  )
}

export default App;
