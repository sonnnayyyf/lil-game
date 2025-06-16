import Phaser from 'phaser';
import StartScene from './StartScene';
import InstructionScene from './InstructionScene'
import Level1Scene from './Level1Scene';
import Level2Scene from './Level2Scene';
import ReplayScene from './replayScene';
import Level3Scene from './Level3Scene';
import Level4Scene from './Level4Scene';
import Level5Scene from './Level5Scene';
import Level6Scene from './Level6Scene';
import Level7Scene from './Level7Scene';
import Level8Scene from './Level8Scene';
import Level9Scene from './Level9Scene';
import Level10Scene from './Level10Scene';
import Level11Scene from './Level11Scene';
import Level12Scene from './Level12Scene';
import Level13Scene from './Level13Scene';
import explanationScene from './explanationScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800, 
    height: 600,
    backgroundColor: '#2d2d30',
    scene: [StartScene, explanationScene, InstructionScene, Level1Scene, Level2Scene, ReplayScene, Level3Scene, Level4Scene, Level5Scene, Level6Scene, Level7Scene, Level8Scene, Level9Scene, Level10Scene, Level11Scene, Level12Scene, Level13Scene], // Add the scenes
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

console.log('Birthday_Girl game started');
