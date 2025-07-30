interface IProps {
    musics: {name: string, url: string}[];
    options: string[];
}

import { SwitcherHeader } from "../SwitcherHeader/SwitcherHeader";
import { useMemo, useState } from "react";
import { audioPlayerService } from "./MusicService.ts";
import './Musics.css';

export const Musics = (props: IProps) => {
    const [pageState, setPageState] = useState(props.options[0]);
    const [currentAudio, setCurrentAudio] = useState<string>('');

    const curentMusics = useMemo(() => {
        const curr = props.musics[pageState];
        return curr;
    }, [pageState]);

    const handler = (src, index) => {
        if (pageState === 'Звуки' || pageState === 'Звуки мемы'){
            const audio = document.getElementById('audio-2');
            audio.src = src;
            audio.play();
            return;
        }

        setCurrentAudio(src);
        audioPlayerService.setPlaylist(curentMusics, (val) => setCurrentAudio(val));
        audioPlayerService.playTrack(index);
    };

    return (
        <div className="musics">
            <audio id="audio-2" class="musics__audio">
                Your browser does not support the audio element.
            </audio>


            <SwitcherHeader 
                options={props.options} 
                setPageState={setPageState} 
                currentState={pageState}
            />

            <div className="musics__body">
            {curentMusics.map((option, index) => (
                <span 
                    key={index}
                    onClick={() => handler(option.url, index)}
                    className={`switcher-option ${currentAudio === option.url ? 'musics__audio_selected' : ''}`}
                >
                    {option.name}
                </span>
            ))}
            </div>
        </div>
    
    );
};