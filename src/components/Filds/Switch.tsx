import './Switch.css'
import {ChangeEventHandler, FC, useState} from "react";

export interface SwitchProps {
    label: string
    value?: number
    onChange?: (value: number) => void
}

export const Switch: FC<SwitchProps> = ({label, value, onChange = () => {}}) => {

    const [switchValue, setSwitchValue] = useState<number>(value || 1)

    const changeValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSwitchValue(Number(event.target.value))
        onChange(Number(event.target.value))
    }

    return (
        <div className="switch">
            <div className={'switch-label'}>
                {label}
            </div>
            <div className={'switch-section'}>
                <input type={'range'} min={0.1} max={10} step={0.1} defaultValue={switchValue} onChange={changeValue} list={'switch-section'}/>
            </div>
        </div>
    )
}