import './Score.css'
import {FC} from "react";

interface ScoreProps {
    label: string
    value: number
}

export const Score: FC<ScoreProps> = ({label, value}) => {
    return(
        <div className={'score'}>
            <div className={'score-label'}>
                {label}
            </div>
            <div className={'score-value'}>
                {value}
            </div>
        </div>
    )
}