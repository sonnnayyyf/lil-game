import Phaser from 'phaser';

export default class InitialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InitialScene' });
    }

    create() {
        // Set background color to black
        this.cameras.main.setBackgroundColor('#000000');

        // Add a "Start" button
        const startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Start', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Make the button interactive
        startButton.setInteractive();

        // Add click event
        startButton.on('pointerdown', () => {
            this.scene.start('Cutscene');
        });
    }
}
