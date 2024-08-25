import {FC} from "react";
import "./PlayerSettings.css"

interface PlayerSettingsProps {
    isOpen: boolean;
    setClose: () => void;
    setState: (props: any) => void
}

export const PlayerSettings: FC<PlayerSettingsProps> = ({
                                                            isOpen,
                                                            setClose,
                                                            setState
                                                        }) => {
    return (
        (isOpen) ?
            <div className={'player-settings-modal'} onClick={setClose}>
                <div className={'player-settings'}>
                    <div className={'player-settings-container'}>

                    </div>
                    <div className={'player-settings-button-container'}>
                        <div className={'player-settings-button'}>
                            отмена
                        </div>
                        <div className={'player-settings-button'}>
                            применить
                        </div>
                    </div>
                </div>
            </div>
            : <></>
    )
}