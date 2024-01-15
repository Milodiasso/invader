class Scene1 extends Phaser.Scene{
    constructor(){
        super("bootGame")
    }

    preload(){
        this.load.image("background", 'assets/city_draw.png');
        this.load.image("blaster", 'assets/invader/blaster.png');
        this.load.image("shoot", 'assets/invader/blaster3.png');
        this.load.image("boss", 'assets/invader/boss_ship.png');

        this.load.audio('bullet', 'assets/invader/laser.mp3');
        this.load.audio('hit', 'assets/invader/hit.mp3');
        this.load.audio('shoot', 'assets/invader/big_shoot.mp3');
        this.load.audio('explosion_song', 'assets/invader/explosion.mp3');
        this.load.audio('bonus_song', 'assets/invader/bonus.mp3');
        this.load.audio('collect', 'assets/invader/collect.mp3');
        this.load.audio('boss_song', 'assets/invader/boss.mp3');
        this.load.audio('gameOver', 'assets/invader/gameover.mp3');
        this.load.audio('victory', 'assets/invader/cheer.mp3');

        this.load.spritesheet("bonus", 'assets/invader/sprite/balls.png', { 
            frameWidth: 17, 
            frameHeight: 17 
        });
        this.load.spritesheet("ship", 'assets/invader/sprite/ship.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ennemy", 'assets/invader/sprite/ship2.png', {
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("explosion", 'assets/invader/sprite/explosion.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create(){
        this.add.text(20,20, "Loading game...")
        this.scene.start("playGame")
    }
}

