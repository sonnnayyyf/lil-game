import Phaser from 'phaser';
import GlobalData from './GlobalData';

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level10Scene' });
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
        this.load.image('wall', '../Assets/wall.png'); 

        // Load sounds
        this.load.audio('keySound', '../Assets/key_sound.mp3'); 
        this.load.audio('doorSound', '../Assets/door_sound.mp3'); 
        this.load.audio('clickSound', '../Assets/click_sound.mp3'); 
    }

    create() {
        console.log('Level10Scene create');

        // Set background color
        this.cameras.main.setBackgroundColor('#444444'); // Dark grey background

        // Add top bar
        const topBarHeight = 50;
        const topBar = this.add.rectangle(0, 0, this.cameras.main.width, topBarHeight, 0x222222).setOrigin(0, 0).setDepth(1);

        // Add level name
        const levelName = this.add.text(10, topBarHeight / 2, 'Level 10', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0, 0.5).setDepth(1);

        // Timer variables
        this.timer = 6000; 
        this.timerActive = false;

        // Add timer text and update it immediately to reflect the initial timer value
        this.timerText = this.add.text(this.cameras.main.width / 2, topBarHeight / 2, '', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1);
        this.updateTimerText();

        // Add settings button
        const settingsButton = this.add.image(this.cameras.main.width - 10, topBarHeight / 2, 'settingsIcon').setOrigin(1, 0.5).setInteractive().setDepth(1);
        settingsButton.setScale(0.08); // Adjust scale as needed

        // Define wall positions
        const wallWidth = this.cameras.main.width - 625;
        const wallX = this.cameras.main.width / 2;
        const topWallY = topBarHeight + 25;
        const bottomWallY = this.cameras.main.height - 25;

        // Add walls (light grey areas)
        this.walls = this.physics.add.staticGroup();
        this.walls.create(wallX, topWallY, 'wall').setDisplaySize(wallWidth, 340).refreshBody();
        this.walls.create(wallX, bottomWallY, 'wall').setDisplaySize(wallWidth, 440).refreshBody();

        // Add gate (brown)
        // this.gate = this.physics.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gate').setOrigin(0.5).setScale(0.325);
        // this.gate.body.immovable = true;

        // Add keys
        this.key1 = this.physics.add.image(275, 75, 'key').setOrigin(0.5).setScale(0.08).setDepth(1);
        // Uncomment and define this.key2 if you need a second key
        // this.key2 = this.physics.add.image(this.cameras.main.width - 275, 75, 'key').setOrigin(0.5).setScale(0.08).setDepth(1);

        // Add door
        this.door = this.physics.add.image(this.cameras.main.width / 2 + 125, this.cameras.main.height - 100, 'door').setOrigin(0.5).setScale(0.08);
        this.door.body.immovable = true;

        // Add player (Emilee image)
        this.player = this.physics.add.image(this.cameras.main.width / 2 - 125, this.cameras.main.height - 150, 'Emilee').setOrigin(0.5).setScale(0.2);
        this.player.setCollideWorldBounds(true);

        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create collisions
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.overlap(this.player, this.key1, this.collectKey, null, this);
        // Uncomment if you have a second key defined
        // this.physics.add.overlap(this.player, this.key2, this.collectKey, null, this);
        this.physics.add.collider(this.player, this.gate, this.unlockGate, null, this);
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
            // Penalize time if moving left or right
            if (leftOrRight) {
                // Check if key2 exists before accessing its x property
                if (this.player.x < this.key1.x || (this.key2 && this.player.x > this.key2.x)) {
                    this.timer -= delta * 2;
                } else {
                    this.timer -= delta;
                }
            } else {
                this.timer -= delta;
            }

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
            this.gate.destroy();
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
            GlobalData.savePlayerMovementData('10', this.playerMovementData);
            // transition to the second scene
            this.time.delayedCall(100, () => {
                this.scene.start('Level11Scene', { playerMovementData: this.playerMovementData });
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
        const popup = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, popupWidth, popupHeight, 0x000000).setOrigin(0.5).setInteractive();
        popup.setStrokeStyle(4, 0xca5cdd);
        const createButton = (x, y, label, callback) => {
            const button = this.add.text(x, y, label, {
                fontSize: '24px',
                fill: '#ffffff',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            const buttonRect = this.add.rectangle(button.x, button.y, button.width + 40, button.height + 20)
                .setStrokeStyle(4, 0xffffff)
                .setOrigin(0.5);

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
        const popup = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'You got the key!', { fontSize: '32px', fill: '#ca5cdd', backgroundColor: '#ffffff' }).setOrigin(0.5);
        this.time.delayedCall(500, () => {
            popup.destroy();
        });
    }
}
