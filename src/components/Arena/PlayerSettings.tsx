import {ChangeEvent, FC, useState} from "react";
import "./PlayerSettings.css";

interface PlayerSettingsProps {
    state: string;
    setState: (color: string) => void;
    isOpen: boolean;
    setClose: () => void;
}

export const PlayerSettings: FC<PlayerSettingsProps> = ({state, setState, isOpen, setClose}) => {

    const [color, setColor] = useState(state);

    const handleChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const handleApply = () => {
        setState(color);
        setColor(state);
        setClose();
    };

    const handleCancel = () => {
        setColor(state);
        setClose();
    };

    return (
        (isOpen) ?
            <div className={'player-settings-modal'} onClick={handleCancel}>
                <div className={'player-settings'} onClick={(event) => event.stopPropagation()}>
                    <div className={'player-settings-title'}>
                        Настройки персонажа
                    </div>
                    <div className={'player-settings-container'}>
                        <div className={'player-settings-block'}>
                            <div className={'player-settings-label'}>
                                Цвет
                            </div>
                            <input type="color" defaultValue={color} onChange={handleChangeColor}/>
                        </div>
                    </div>
                    <div className={'player-settings-button-container'}>
                        <div className={'player-settings-button'} onClick={handleCancel}>
                            отмена
                        </div>
                        <div className={'player-settings-button'} onClick={handleApply}>
                            применить
                        </div>
                    </div>
                </div>
            </div>
            : <></>
    );
};