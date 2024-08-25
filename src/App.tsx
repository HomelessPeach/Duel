import {useState} from "react";
import {Score} from "./components/Filds/Score";
import {Arena} from "./components/Arena/Arena";
import {Switch} from "./components/Filds/Switch";
import './App.css';

export interface PlayerState {
    score: number;
    speed: number;
    fire: number;
}

const defaultPlayerState: PlayerState = {
    score: 0,
    fire: 40,
    speed: 40,
};

export const App = () => {

    const [player1, setPlayer1] = useState<PlayerState>(defaultPlayerState);
    const [player2, setPlayer2] = useState<PlayerState>(defaultPlayerState);

    return (
        <div className="app">
            <div className={'score-container'}>
                <div className={'player-container player-1'}>
                    <Score label={'Игрок 1'} value={player1.score}/>
                </div>
                <div className={'player-container player-2'}>
                    <Score label={'Игрок 2'} value={player2.score}/>
                </div>
            </div>
            <div className={'arena-container'}>
                <Arena
                    player1={player1}
                    player2={player2}
                    onChangeScorePlayer1={(score: number) => setPlayer1((player) => ({...player, score}))}
                    onChangeScorePlayer2={(score: number) => setPlayer2((player) => ({...player, score}))}
                />
            </div>
            <div className={'score-container'}>
                <div className={'player-container player-1'}>
                    <Switch label={'Cкорость передвижения'} value={player1.speed}
                            onChange={(speed) => setPlayer1((player) => ({...player, speed}))}/>
                    <Switch label={'Cкорость магии'} value={player1.fire}
                            onChange={(fire) => setPlayer1((player) => ({...player, fire}))}/>
                </div>
                <div className={'player-container player-2'}>
                    <Switch label={'Cкорость передвижения'} value={player2.speed}
                            onChange={(speed) => setPlayer2((player) => ({...player, speed}))}/>
                    <Switch label={'Cкорость магии'} value={player2.fire}
                            onChange={(fire) => setPlayer2((player) => ({...player, fire}))}/>
                </div>
            </div>
        </div>
    );
};
