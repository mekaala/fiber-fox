import { useRecoilState } from "recoil";
import { enemyPositionState, laserPositionState, scoreState } from "./GameState";
import { useFrame } from "react-three-fiber";

const LASER_RANGE = 100;
const LASER_Z_VELOCITY = 1;
const ENEMY_SPEED = 0.1;
const GROUND_HEIGHT = -50;

function distance(p1, p2) {
    const a = p2.x - p1.x;
    const b = p2.y - p1.y;
    const c = p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
}

function GameTimer() {
    const [enemies, setEnemies] = useRecoilState(enemyPositionState);
    const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
    const [score, setScore] = useRecoilState(scoreState);

    useFrame(({ mouse }) => {
        const hitEnemies = enemies
        ? enemies.map(
            (enemy) =>
              lasers.filter(
                (laser) =>
                  lasers.filter((laser) => distance(laser, enemy) < 3).length > 0
              ).length > 0
          )
        : [];
        if (hitEnemies.includes(true)) {
            setScore(score + hitEnemies.filter((hit) => hit).length);
            console.log("hit detected");
          }
        setEnemies(
            enemies
              .map((enemy) => ({ x: enemy.x, y: enemy.y, z: enemy.z + ENEMY_SPEED }))
              .filter((enemy, idx) => !hitEnemies[idx] && enemy.z < 0)
        );
        setLaserPositions(
            lasers
                .map((laser) => ({
                    id: laser.id,
                    x: laser.x + laser.velocity[0],
                    y: laser.y + laser.velocity[1],
                    z: laser.z - LASER_Z_VELOCITY,
                    velocity: laser.velocity,
                }))
                .filter((laser) => laser.z > -LASER_RANGE && laser.y > GROUND_HEIGHT)
        );
    });
    return null;
}

export default GameTimer;