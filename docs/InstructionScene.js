import Phaser from 'phaser';

export default class InstructionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionScene' });
    }

    preload() {
        // Load the button click sound
        this.load.audio('buttonClick', '/assets/button_click.mp3'); 
    }


    create() {
        console.log('InstructionScene create');
        // Fallback text to confirm scene creation
        this.add.text(400, 100, "Instructions", { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);

        // Set background color
        this.cameras.main.setBackgroundColor('#2d2d30');

        const text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
            "Hi hun! Use WASD or arrow keys to move.\nThe objective is to run to\nthe next room before the timer expires!", {
                fontSize: '20px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: this.cameras.main.width - 100 }
            }).setOrigin(0.5);

        // Function to create buttons with hover effects
        const createButton = (x, y, label, callback) => {
            const button = this.add.text(x, y, label, {
                fontSize: '64px',
                fill: '#ffffff',
                padding: { x: 20, y: 10 },
                align: 'center'
            }).setOrigin(0.5).setInteractive();

            const buttonRect = this.add.rectangle(button.x, button.y, button.width + 40, button.height + 20)
                .setStrokeStyle(4, 0xffffff)
                .setOrigin(0.5);

            button.on('pointerdown', callback);

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

        // Back Button
        createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'BACK', () => {
            console.log('Main button clicked');
            this.scene.start('StartScene');
        });
    }
}
