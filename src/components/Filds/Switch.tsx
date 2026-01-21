import {ChangeEventHandler, FC} from "react";
import './Switch.css';

export interface SwitchProps {
    label: string;
    value?: number;
    onChange?: (value: number) => void;
}

export const Switch: FC<SwitchProps> = ({label, value = 50, onChange = () => {}}) => {

    const changeValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(Number(event.target.value));
    };

    return (
        <div className="switch">
            <div className={'switch-label'}>
                {label}
            </div>
            <div className={'switch-section'}>
                <input type={'range'} min={1} max={100} step={1} defaultValue={value} onChange={changeValue}
                       list={'switch-section'}/>
            </div>
        </div>
    );
};