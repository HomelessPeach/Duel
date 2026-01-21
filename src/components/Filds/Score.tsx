import {FC} from "react";
import './Score.css';

interface ScoreProps {
    label: string;
    value: number;
}

export const Score: FC<ScoreProps> = ({label, value}) => {
    return (
        <div className={'score'}>
            <div className={'score-label'}>
                {label}
            </div>
            <div className={'score-value'}>
                {(value > 999999999) ?
                    '999.999.999+' :
                    String(value).replace(/(?:(^\d{1,3})(?=(?:\d{3})*$)|(\d{3}))(?!$)/mg, '$1$2.')
                }
            </div>
        </div>
    );
};