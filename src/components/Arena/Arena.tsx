import {Dispatch, FC, MouseEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {PlayerState} from "../../App";
import {PlayerSettings} from "./PlayerSettings";
import './Arena.css';

export interface ArenaProps {
    player1: PlayerState;
    player2: PlayerState;
    onChangeScorePlayer1: (score: number) => void;
    onChangeScorePlayer2: (score: number) => void;
}

interface ArenaPlayerState {
    positionX: number;
    positionY: number;
    color: string;
    direction: 'up' | 'down';
    shootTimeOut: number;
    isOpenPlayerSettings: boolean;
}

interface MousePositionState {
    x: number;
    y: number;
}

interface MagicFireState {
    x: number;
    y: number;
    endPoint: 'left' | 'right';
    color: string;
    onChangeScore: (score: number) => void;
}

const canvasSize = {
    width: 1380,
    height: 780,
    positionX: {
        left: 100,
        right: 1280,
    },
    positionY: {
        top: 50,
        middle: 390,
        bottom: 730,
    }
};

const speedFactor: number = 5;
const fireFactor: number = 1.3;

const defaultArenaPlayer1State: ArenaPlayerState = {
    positionX: canvasSize.positionX.left,
    positionY: canvasSize.positionY.middle,
    color: '#000000',
    direction: 'down',
    shootTimeOut: 0,
    isOpenPlayerSettings: false,
};

const defaultArenaPlayer2State: ArenaPlayerState = {
    positionX: canvasSize.positionX.right,
    positionY: canvasSize.positionY.middle,
    color: '#ffffff',
    direction: 'down',
    shootTimeOut: 0,
    isOpenPlayerSettings: false,
};

export const Arena: FC<ArenaProps> = ({player1, player2, onChangeScorePlayer2, onChangeScorePlayer1}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [arenaPlayer1, setArenaPlayer1] = useState<ArenaPlayerState>(defaultArenaPlayer1State);
    const [arenaPlayer2, setArenaPlayer2] = useState<ArenaPlayerState>(defaultArenaPlayer2State);
    const [mousePosition, setMousePosition] = useState<MousePositionState>({x: 0, y: 0});
    const [magicFires, setMagicFires] = useState<MagicFireState[]>([]);

    const getCanvasContext = () => {
        const canvasContext: CanvasRenderingContext2D | null | undefined = canvasRef.current?.getContext('2d');
        if (canvasContext) {
            canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        }
        return canvasContext;
    };

    const drawArena = (canvasContext: CanvasRenderingContext2D) => {
        handlePlayer(canvasContext, player1, arenaPlayer1, setArenaPlayer1, onChangeScorePlayer1);
        handlePlayer(canvasContext, player2, arenaPlayer2, setArenaPlayer2, onChangeScorePlayer2);
        handleShootsWays(canvasContext);
    };

    const handlePlayer = (canvasContext: CanvasRenderingContext2D,
                          playerData: PlayerState,
                          arenaPlayer: ArenaPlayerState,
                          setArenaPlayer: Dispatch<SetStateAction<ArenaPlayerState>>,
                          onChangeScore: (score: number) => void,
    ) => {
        setPlayer(canvasContext, arenaPlayer, setArenaPlayer, playerData.speed);
        setShoot(arenaPlayer, setArenaPlayer, playerData.fire, onChangeScore);
    };

    const setPlayer = (canvasContext: CanvasRenderingContext2D, arenaPlayer: ArenaPlayerState, setArenaPlayer: Dispatch<SetStateAction<ArenaPlayerState>>, speed: number) => {
        canvasContext.beginPath();
        canvasContext.arc(arenaPlayer.positionX, arenaPlayer.positionY, 50, 0, 3 * Math.PI);
        canvasContext.fillStyle = arenaPlayer.color;
        canvasContext.fill();
        handlePlayerWay(arenaPlayer, setArenaPlayer, speed);
    };

    const handlePlayerWay = (arenaPlayer: ArenaPlayerState, setArenaPlayer: Dispatch<SetStateAction<ArenaPlayerState>>, playerSpeed: number) => {

        const speed: number = speedFactor * (playerSpeed / 100) ** 2;

        if (arenaPlayer.direction === 'down' &&
            ((arenaPlayer.positionX - mousePosition.x) ** 2 + (arenaPlayer.positionY - mousePosition.y) ** 2) ** 0.5 < 51 &&
            arenaPlayer.positionY < mousePosition.y
        ) {
            setArenaPlayer((arenaPlayerData) => ({
                ...arenaPlayerData,
                direction: 'up',
                positionY: (arenaPlayerData.positionY > canvasSize.positionY.top) ? arenaPlayerData.positionY - speed : canvasSize.positionY.top
            }));
            return;
        }

        if (arenaPlayer.direction === 'down') {
            setArenaPlayer({
                ...arenaPlayer,
                direction: (arenaPlayer.positionY - speed >= canvasSize.positionY.bottom) ? 'up' : 'down',
                positionY: arenaPlayer.positionY + speed
            });
            return;
        }

        if (arenaPlayer.direction === 'up' &&
            ((arenaPlayer.positionX - mousePosition.x) ** 2 + (arenaPlayer.positionY - mousePosition.y) ** 2) ** 0.5 < 51 &&
            arenaPlayer.positionY > mousePosition.y
        ) {
            setArenaPlayer((arenaPlayerData) => ({
                ...arenaPlayerData,
                direction: 'down',
                positionY: (arenaPlayerData.positionY < canvasSize.positionY.bottom) ? arenaPlayerData.positionY + speed : canvasSize.positionY.bottom
            }));
            return;
        }

        if (arenaPlayer.direction === 'up') {
            setArenaPlayer((arenaPlayerData) => ({
                ...arenaPlayerData,
                direction: (arenaPlayerData.positionY - speed <= canvasSize.positionY.top) ? 'down' : 'up',
                positionY: arenaPlayerData.positionY - speed
            }));
            return;
        }
    };

    const setShoot = (arenaPlayer: ArenaPlayerState, setArenaPlayer: Dispatch<SetStateAction<ArenaPlayerState>>, playerFire: number, onChangeScore: (score: number) => void) => {

        const fire: number = fireFactor ** (playerFire / 10);

        if (arenaPlayer.shootTimeOut <= 0) {
            setMagicFires((magicFires) => [...magicFires, {
                x: arenaPlayer.positionX,
                y: arenaPlayer.positionY,
                endPoint: (arenaPlayer.positionX === canvasSize.positionX.right) ? 'left' : 'right',
                color: arenaPlayer.color,
                onChangeScore: onChangeScore
            }])
            setArenaPlayer((arenaPlayerData) => ({...arenaPlayerData, shootTimeOut: 1000}));
        } else {
            setArenaPlayer((arenaPlayerData) => ({
                ...arenaPlayerData,
                shootTimeOut: arenaPlayerData.shootTimeOut - fire
            }));
        }
    };

    const handleShootsWays = (canvasContext: CanvasRenderingContext2D) => {
        const copyMagicFires: MagicFireState[] = [...magicFires];
        magicFires.length = 0;
        copyMagicFires.forEach((shoot: MagicFireState) => {
            canvasContext.beginPath();
            canvasContext.arc(shoot.x, shoot.y, 20, 0, 3 * Math.PI);
            canvasContext.fillStyle = shoot.color;
            canvasContext.fill();
            if (shoot.endPoint === 'left') {
                shoot.x = shoot.x - 1;
            } else {
                shoot.x = shoot.x + 1;
            }
            clearShoots(shoot);
        });
    };

    const clearShoots = (shoot: MagicFireState) => {
        const [playerLeft, playerRight] = (arenaPlayer1.positionX === canvasSize.positionX.left) ? [arenaPlayer1, arenaPlayer2] : [arenaPlayer2, arenaPlayer1];

        if (shoot.endPoint === 'right' &&
            ((shoot.x - playerRight.positionX) ** 2 + (shoot.y - playerRight.positionY) ** 2) ** 0.5 < 70
        ) {
            shoot.onChangeScore(((playerRight === arenaPlayer2)? player1 : player2).score + 1)
            return;
        }

        if (shoot.endPoint === 'left' &&
            ((shoot.x - playerLeft.positionX) ** 2 + (shoot.y - playerLeft.positionY) ** 2) ** 0.5 < 70
        ) {
            shoot.onChangeScore(((playerLeft === arenaPlayer2)? player1 : player2).score + 1)
            return;
        }

        if ((shoot.endPoint === 'right' && shoot.x < canvasSize.width) ||
            (shoot.endPoint === 'left' && shoot.x > 0)
        ) {
            setMagicFires((magicFires) => [...magicFires, shoot])
            return;
        }
    };

    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const rect: DOMRect = event.currentTarget.getBoundingClientRect();
        if (rect) {
            setMousePosition({
                x: (event.clientX - rect.left) * canvasSize.width / rect.width + 1,
                y: (event.clientY - rect.top) * canvasSize.height / rect.height + 1
            });
        }
    };

    const handleClick = (event: any) => {
        const rect: DOMRect = event.currentTarget.getBoundingClientRect();
        if (rect) {
            const x: number = (event.clientX - rect.left) * canvasSize.width / rect.width + 1;
            const y: number = (event.clientY - rect.top) * canvasSize.height / rect.height + 1;
            if (((arenaPlayer1.positionX - x) ** 2 + (arenaPlayer1.positionY - y) ** 2) ** 0.5 < 51) {
                setArenaPlayer1((arenaPlayer) => ({...arenaPlayer, isOpenPlayerSettings: true}));
                return;
            }
            if (((arenaPlayer2.positionX - x) ** 2 + (arenaPlayer2.positionY - y) ** 2) ** 0.5 < 51) {
                setArenaPlayer2((arenaPlayer) => ({...arenaPlayer, isOpenPlayerSettings: true}));
                return;
            }
        }
    };

    const handleMouseLeave = () => {
        setMousePosition({x: 0, y: 0});
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const canvasContext = getCanvasContext();
            if (!canvasContext) return;
            drawArena(canvasContext);
        }, 1);
        return () => clearInterval(timer);
    }, [drawArena]);

    return (
        <>
            <div className={'arena'}>
                <canvas ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        onClick={handleClick}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                />
            </div>
            <PlayerSettings state={arenaPlayer1.color}
                            setState={(color) => setArenaPlayer1((player) => ({...player, color: color}))}
                            isOpen={arenaPlayer1.isOpenPlayerSettings}
                            setClose={() => setArenaPlayer1((arenaPlayer) => ({...arenaPlayer, isOpenPlayerSettings: false}))}
            />
            <PlayerSettings state={arenaPlayer2.color}
                            setState={(color) => setArenaPlayer2((player) => ({...player, color: color}))}
                            isOpen={arenaPlayer2.isOpenPlayerSettings}
                            setClose={() => setArenaPlayer2((arenaPlayer) => ({...arenaPlayer, isOpenPlayerSettings: false}))}
            />
        </>
    );


};