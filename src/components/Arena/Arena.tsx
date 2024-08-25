import './Arena.css';
import {Player} from "./Player";

export const Arena = () => {
    return(
        <div className={'arena'}>
            <div className={'player-container'}>
                <Player/>
            </div>
            <div className={'arena-container'}>
                <Player/>
            </div>
        </div>
    )
}