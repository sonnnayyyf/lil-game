import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load the button click sound
        this.load.audio('buttonClick', '/assets/button_click.mp3'); 
        
    }

    create() {
        console.log('StartScene create');
        // Fallback text to confirm scene creation
        this.add.text(400, 100, "A lil game for u", { fontSize: '50px', fill: '#ffffff' }).setOrigin(0.5);

        // Set background color
        this.cameras.main.setBackgroundColor('#2d2d30');

        // Function to create buttons with hover effects
        const createButton = (x, y, label, callback) => {
            const button = this.add.text(x, y, label, {
                fontSize: '64px',
                fill: '#ffffff',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            const buttonRect = this.add.rectangle(button.x, button.y, button.width + 40, button.height + 20)
                .setStrokeStyle(4, 0xffffff)
                .setOrigin(0.5);

            button.on('pointerdown', () => {
                this.sound.play('buttonClick');
                callback();
            });

            button.on('pointerover', () => {
                button.setStyle({ fill: '#ca5cdd' });
                this.tweens.add({
                    targets: buttonRect,
                    strokeColor: 0xca5cdd,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            button.on('pointerout', () => {
                button.setStyle({ fill: '#ffffff' });
                this.tweens.add({
                    targets: buttonRect,
                    strokeColor: 0xffffff,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            return button;
        };

        // Start Button
        createButton(this.cameras.main.width / 2, this.cameras.main.height / 2, 'START GAME', () => {
            console.log('Start button clicked');
            this.scene.start('Level1Scene');
        });

        // Instruction Button
        createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'INSTRUCTIONS', () => {
            console.log('Instruction button clicked');
            this.scene.start('InstructionScene');
        });
    }
}
