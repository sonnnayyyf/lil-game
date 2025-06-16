import Phaser from 'phaser';
import GlobalData from './GlobalData';

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level6Scene' });
        this.playerMovementData = [];
        this.lastRecordedPosition = { x: null, y: null };
        this.recordInterval = 100; // Record position every 100ms
        this.lastRecordTime = 0;
        this.levelCompleted = false; // Flag to check if level is completed
        this.keyCount = 0; // Key counter
    }

    preload() {
        // Load assets
        this.load.image('Emilee', '../Assets/Emilee_image.png');
        this.load.image('key', '../Assets/Regular_key.png');
        this.load.image('door', '../Assets/door.png');
        this.load.image('gate', '../Assets/gate.jpg');
        this.load.image('settingsIcon', '../Assets/settings_icon.png');
        this.load.image('circleWall', '../Assets/circle_wall.png');

        // Load sounds
        this.load.audio('keySound', '../Assets/key_sound.mp3');
        this.load.audio('doorSound', '../Assets/door_sound.mp3');
        this.load.audio('clickSound', '../Assets/button_click.mp3');
    }

    create() {
        console.log('Level6Scene create');

        // Set background color
        this.cameras.main.setBackgroundColor('#444444'); // Dark grey background

        // Add top bar
        const topBarHeight = 50;
        const topBar = this.add.rectangle(0, 0, this.cameras.main.width, topBarHeight, 0x222222).setOrigin(0, 0).setDepth(1);

        // Add level name
        const levelName = this.add.text(10, topBarHeight / 2, 'Level 6', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0, 0.5).setDepth(1);

        // Timer variables
        this.timer = 6380;
        this.timerActive = false;

        // Add timer text and update it immediately to reflect the initial timer value
        this.timerText = this.add.text(this.cameras.main.width / 2, topBarHeight / 2, '', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1);
        this.updateTimerText();

        // Add settings button
        const settingsButton = this.add.image(this.cameras.main.width - 10, topBarHeight / 2, 'settingsIcon').setOrigin(1, 0.5).setInteractive().setDepth(1);
        settingsButton.setScale(0.08); // Adjust scale as needed

        // Add circular wall with circular collision
        const wallRadius = 100;
        this.circleWall = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 120, 'circleWall').setDisplaySize(wallRadius * 2, wallRadius * 2).setDepth(1);
        this.physics.add.existing(this.circleWall, true);
        this.circleWall.body.setCircle(wallRadius, 0, 0);

        this.circleWall2 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 120, 'circleWall').setDisplaySize(wallRadius * 2, wallRadius * 2).setDepth(1);
        this.physics.add.existing(this.circleWall2, true);
        this.circleWall2.body.setCircle(wallRadius, 0, 0);

        // Add gate (brown) and extend it to the bottom of the screen
        const gateHeight = this.cameras.main.height;

        this.gate = this.add.tileSprite(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2 -200, wallRadius + 90, gateHeight, 'gate').setOrigin(0.5);
        this.physics.add.existing(this.gate, true);

        this.gate2 = this.add.tileSprite(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2 +300, wallRadius + 90, gateHeight, 'gate').setOrigin(0.5);
        this.physics.add.existing(this.gate2, true);

        // Add keys
        this.key1 = this.physics.add.image(this.cameras.main.width / 2 - 120, this.cameras.main.height / 2 , 'key').setOrigin(0.5).setScale(0.08).setDepth(1);
        this.key2 = this.physics.add.image(this.cameras.main.width / 2 + 30, this.cameras.main.height / 2, 'key').setOrigin(0.5).setScale(0.08).setDepth(1);
        this.key3 = this.physics.add.image(this.cameras.main.width / 2 + -120, this.cameras.main.height / 2+50, 'key').setOrigin(0.5).setScale(0.08).setDepth(1);


        // Add door
        this.door = this.physics.add.image(this.cameras.main.width - 400, this.cameras.main.height - 100, 'door').setOrigin(0.5).setScale(0.08);
        this.door.body.immovable = true;

        // Add player (Emilee image) under the door
        this.player = this.physics.add.image(this.cameras.main.width - 400, this.cameras.main.height - 50, 'Emilee').setOrigin(0.5).setScale(0.2);
        this.player.setCollideWorldBounds(true);

        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create collisions
        this.physics.add.collider(this.player, this.circleWall);
        this.physics.add.collider(this.player, this.circleWall2); // Add collision for the second circular wall
        this.physics.add.overlap(this.player, this.key1, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.key2, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.key3, this.collectKey, null, this);
        this.physics.add.collider(this.player, this.gate, this.unlockGate, null, this);
        this.physics.add.collider(this.player, this.gate2, this.unlockGate, null, this); // Add collision for the second gate
        this.physics.add.overlap(this.player, this.door, this.reachDoor, null, this);

        // Handle settings button click
        settingsButton.on('pointerdown', () => {
            this.sound.play('clickSound');
            this.showSettingsPopup();
        });
    }

    update(time, delta) {
        if (this.levelCompleted) return;

        // Player movement
        let moving = false;
        let leftOrRight = false;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            moving = true;
            leftOrRight = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            moving = true;
            leftOrRight = true;
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            moving = true;
        } else {
            this.player.setVelocityY(0);
        }

        // Record player's position if moving and at regular intervals
        if (moving && (time > this.lastRecordTime + this.recordInterval)) {
            if (this.player.x !== this.lastRecordedPosition.x || this.player.y !== this.lastRecordedPosition.y) {
                this.playerMovementData.push({ x: this.player.x, y: this.player.y });
                this.lastRecordedPosition = { x: this.player.x, y: this.player.y };
                this.lastRecordTime = time;
            }
        }

        // Start timer when the player moves
        if (moving && !this.timerActive) {
            this.timerActive = true;
        }

        // Update and display timer
        if (this.timerActive) {
            this.timer -= delta;
    
            if (this.timer <= 0) {
                this.timer = 0;
                this.resetLevel();
            }
            this.updateTimerText();
        }
    }

    updateTimerText() {
        let seconds = Math.floor(this.timer / 1000);
        let milliseconds = Math.floor(this.timer % 1000 / 10);
        this.timerText.setText(`${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`);
    }

    collectKey(player, key) {
        key.destroy();
        this.keyCount += 1;
        console.log('Key collected:', this.keyCount);
        this.sound.play('keySound');
        this.showKeyPopup();
    }

    unlockGate(player, gate) {
        if (this.keyCount > 0) {
            this.keyCount -= 1;
            console.log('Gate unlocked, keys remaining:', this.keyCount);
            gate.destroy(); // Use the parameter gate to destroy the gate being unlocked
            this.sound.play('doorSound');
        }
    }

    reachDoor(player, door) {
        if (this.keyCount > 0) {
            console.log('Door reached with key');
            this.sound.play('doorSound');

            // Mark the level as completed to stop further updates
            this.levelCompleted = true;

            // Add final position to ensure the last movement is recorded once
            this.playerMovementData.push({ x: this.player.x, y: this.player.y });
            GlobalData.savePlayerMovementData('6', this.playerMovementData);
            // Transition to the next level scene
            this.time.delayedCall(100, () => {
                this.scene.start('Level7Scene', { playerMovementData: this.playerMovementData });
            });
        } else {
            console.log('Door reached without key');
        }
    }

    resetLevel() {
        console.log('Time ran out! Resetting level...');
        this.playerMovementData = [];
        this.keyCount = 0;
        this.scene.restart();
    }

    showSettingsPopup() {
        const popupWidth = 400;
        const popupHeight = 300;
        const popupDepth = 10; // Ensure the popup is on top of all other elements
        const popup = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, popupWidth, popupHeight, 0x000000).setOrigin(0.5).setInteractive().setDepth(popupDepth);
        popup.setStrokeStyle(4, 0xca5cdd).setDepth(popupDepth);

        const createButton = (x, y, label, callback) => {
            const button = this.add.text(x, y, label, {
                fontSize: '24px',
                fill: '#ffffff',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive().setDepth(popupDepth);

            const buttonRect = this.add.rectangle(button.x, button.y, button.width + 40, button.height + 20)
                .setStrokeStyle(4, 0xffffff)
                .setOrigin(0.5).setDepth(popupDepth);

            button.on('pointerdown', () => {
                this.sound.play('clickSound');
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

            return { button, buttonRect };
        };

        const { button: returnButton, buttonRect: returnButtonRect } = createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Return to Main Screen', () => {
            this.scene.start('StartScene');
        });

        const { button: resumeButton, buttonRect: resumeButtonRect } = createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Resume', () => {
            popup.destroy();
            returnButton.destroy();
            returnButtonRect.destroy();
            resumeButton.destroy();
            resumeButtonRect.destroy();
        });
    }

    showKeyPopup() {
        const popupDepth = 10; // Ensure the key popup is on top of all other elements
        const popup = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'You got the key!', { fontSize: '32px', fill: '#ca5cdd', backgroundColor: '#ffffff' }).setOrigin(0.5).setDepth(popupDepth);
        this.time.delayedCall(500, () => {
            popup.destroy();
        });
    }
}
