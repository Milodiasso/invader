var Bullet = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Image,

    initialize: function Bullet(scene) {
        Phaser.Physics.Arcade.Image.call(this, scene, 150, 150, 'blaster');

        this.setBlendMode(1);
        this.setDepth(1);
        this.setScale(0.2);
        this.speed = 500;
        this.lifespan = 10000;
        this._temp = new Phaser.Math.Vector2();
    },

    fire: function (ship) {
        this.lifespan = 10000;

        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(10);
        this.setAngle(0);
        // this.setRotation(90);
        this.setPosition(ship.x, ship.y);
        this.body.reset(ship.x, ship.y);


        var angle = Phaser.Math.DegToRad(270);
        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    },

    update: function (time, delta) {
        this.lifespan -= delta;
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

});
class Shoots extends Phaser.Physics.Arcade.Group {
    constructor(scene, who='mob', quantity = 100) {
        super(scene.physics.world, scene)
        this.who = who;
        this.createMultiple({
            frameQuantity: quantity,
            key: 'shoot',
            active: false,
            visible: false,
            classType: Shoot,
        });
    }

    fireBullet(x, y) {
        let bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.setDepth(1);
            if (this.who == 'boss') {
                bullet.fireBoss(x, y);
            } else {
                bullet.fire(x, y);
            }
            return true;
        }
    }
}

class Shoot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'shoot');

    }
    // if this is called by boss
    fireBoss(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(700);
        this.setVelocityX(Math.ceil(Math.random() * 500) * (Math.round(Math.random()) ? 1 : -1));
    }
    fire(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(300);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= -32) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
class Scene2 extends Phaser.Scene {

    constructor() {
        super("playGame")
        this.bullets;
        this.lastFired = 0;
        this.timeLastFired = 0;
        this.delayFire = 300;
        this.cursors;
        this.fire;
        this.timer = 0;
        this.level = 1;
        this.group;
        this.score = 0;
        this.nb_ennemy = 0;
        this.life = 5;
        this.alpha = 1;
        this.speed = 200;
        this.ennemy_speed = 200;
        this.ennemy_speed_y = 700;
        this.ennemy_speed_x = 500;
    }

    create() {
        let ennemy_shoot = new Shoots(this);
        let background = this.add.image(0, 0, "background")
        background.setScale(0.6)
        background.setOrigin(0, 0);

        this.bullet_sound = this.sound.add('bullet');
        this.shoot_sound = this.sound.add('shoot');
        this.hit_sound = this.sound.add('hit');
        this.explosion_sound = this.sound.add('explosion_song');
        this.bonus_sound = this.sound.add('bonus_song');
        this.collect_sound = this.sound.add('collect');
        this.boss_sound = this.sound.add('boss_song');
        this.gameover_sound = this.sound.add('gameOver');
        this.victory_sound = this.sound.add('victory');

        this.ship1 = this.physics.add.sprite(config.width / 2 - 380, config.height / 1.1, "ship");
        this.bonus = this.physics.add.sprite(config.width - Math.random() * 800, config.height / 10, "bonus");
        this.group = this.physics.add.group({
            key: 'ennemy',
            repeat: this.nb_ennemy,
            setXY: { x: 12, y: 0, stepX: 70 },
            collideWorldBounds: true,
            setScale: { x: 1.5, y: 1.5 },
        });
        
        this.group.children.iterate((child) => {
            child.flipY = true;
            // ennemy_shoot.fireBullet(child.x, child.y);
            // ennemy_shoot collide with ship
            // this.physics.add.collider(ennemy_shoot, this.ship1, this.attack, null, this);
        });
        this.ship1.setScale(2.5)
        this.ship1.flipY = true
        
        this.anims.create({
            key: "bonus",
            frames: this.anims.generateFrameNumbers("bonus"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1,
            
        });
        this.anims.create({
            key: "ennemy_anim",
            frames: this.anims.generateFrameNumbers("ennemy"),
            frameRate: 20,
            repeat: -1
        });
        
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        if (this.level% 5 == 0 ) {
            let boss_text= this.add.text(config.width / 2, config.height / 4, "BOSS", {
                font: "40px Arial",
                fill: "red"
            });
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    boss_text.destroy();
                },
                loop: false
            });
            this.boss = this.physics.add.sprite(config.width / 2, config.height/10 , "boss");
            this.boss.setScale(1.5);
            this.boss_sound.play();
            let boss_shoot = new Shoots(this, 'boss', 500);
            this.time.addEvent({
                delay: 5000/this.level,
                callback: () => {
                        if (boss_shoot.fireBullet(this.boss.x, this.boss.y)) {
                            this.shoot_sound.play();
                        }
                    this.physics.add.collider(boss_shoot, this.ship1, this.destroyShip, null, this);
                },
                loop: true
            });
        }
      
        
        this.scoreText = this.add.text(20, 20, "Score " + this.score, {
            font: "25px Arial",
            fill: "yellow"
        })

        this.levelText = this.add.text(20, 50, "Niveau " + this.level, {
            font: "25px Arial",
            fill: "red"
        })

        this.lifeText = this.add.text(20, 80, "Life " + this.life, {
            font: "25px Arial",
            fill: "gold",
        })

        this.ship1.play("ship1_anim");
        this.bonus.play("bonus");
        this.bonus.visible = false;
        this.ship1.setInteractive();

        this.ship1.body.collideWorldBounds = true;

        Bullet.collideWorldBounds = true;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            setDisplayWidth: 10,
            setQuantity: 1,
        });


        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.group.children.iterate( (child)=> {
                    child.fireRate = 1000;
                    child.nextFire = 0;
                    if(ennemy_shoot.fireBullet(child.x, child.y)){
                        this.shoot_sound.play();
                    }
                });
                this.physics.add.collider(ennemy_shoot, this.ship1, this.destroyShip, null, this);
            },
            loop: true
        });
        this.physics.add.collider(this.bullets, this.group.getChildren(), this.destroyShip, null, this);
    }

    update() {

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        this.timer += 1;
        if (this.timer == 0) {
            this.group.getChildren().forEach( (child)=> {
                child.body.setVelocityX(getRandomArbitrary(- this.ennemy_speed_x, this.ennemy_speed_x));
                child.body.setVelocityY(getRandomArbitrary(- this.ennemy_speed_y, this.ennemy_speed_y));
            });
        }
        if (this.timer % 100 == 0) {
            this.group.getChildren().forEach( (child)=> {
                child.body.setVelocityX(getRandomArbitrary(- this.ennemy_speed_x, this.ennemy_speed_x));
                child.body.setVelocityY(getRandomArbitrary(- this.ennemy_speed_y, this.ennemy_speed_y));
            });
        }

        this.group.getChildren().forEach(function (child) {
            if (child.y > 400) {
                child.body.setVelocityY(-100);
            }
            if (child.x < 30) {
                child.body.setVelocityX(200);
            }
            if (child.y < 15) {
                child.body.setVelocityY(200);
            }
            if (child.x > 775) {
                child.body.setVelocityX(-200);
            }
        });


        if (this.cursors.left.isDown) {
            this.ship1.setVelocityX(-this.speed);

        }
        else if (this.cursors.right.isDown) {
            this.ship1.setVelocityX(this.speed);
        }
        else {
            this.ship1.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.ship1.body.touching.down) {
            this.ship1.setVelocityY(-360);
        }

        if (this.fire.isDown) {
            if (this.time.now > this.timeLastFired) {
                let bullet = this.bullets.get();
                this.timeLastFired = this.time.now + this.delayFire;
                bullet.fire(this.ship1);
                this.bullet_sound.play();
            }
        }
    }

    destroyShip(pointer, gameObject) {
        if (pointer.texture.key == 'ship') {
            this.life--;
            this.hit_sound.play();
            gameObject.destroy();
            this.lifeText.text = "Life " + this.life;
            if (this.life == 0) {
                pointer.setTexture('explosion')
                pointer.play('explode')
                this.text3 = this.add.text(220, 170, "Game Over", {
                    font: "85px Arial Bold",
                    fill: "gold",
                })
                this.gameover_sound.play();
                this.physics.pause();
                this.time.delayedCall(2500, function () {
                    localStorage.setItem('score', this.score)
                    this.scene.start('Accueil', { score: this.score });
                    this.resetGame();
                }, [], this);
            }
            pointer.alpha = this.alpha - 0.2;
            // this.scene.restart("playGame");         
        } else {
            gameObject.destroy();
            this.explosion_sound.play();
            pointer.body.enable = false;
            pointer.setTexture("explosion");
            pointer.play("explode");

            this.time.delayedCall(100, function () {
                pointer.destroy();
            }, [], this);
            this.scoreText.text = "Score " + ++this.score;
            this.nb_ennemy--
            if (this.score % 15 == 0) {
                this.bonus.visible = true;
                this.bonus_sound.play();
                this.bonus.setVelocityY(150)
                this.physics.add.collider(this.bonus, this.ship1, this.bonusEffect, null, this);
                this.time.delayedCall(5000, function () {
                    this.bonus.visible = false;
                    this.bonus.destroy();
                }, [], this);
            }
            if (this.nb_ennemy < 0 && this.level < 10) {
                this.level++;
                this.levelText.text = "Niveau " + this.level;
                this.nb_ennemy = 3 * this.level;
                this.time.delayedCall(1000, function () {
                    this.scene.restart("playGame");
                }, [], this);
            }
            if(this.level == 10 && this.nb_ennemy == -1){
                this.text3 = this.add.text(220, 170, "You Win", {
                    font: "85px Arial Bold",
                    fill: "gold",
                })
                localStorage.setItem('score', this.score)
                this.sound.stopAll();
                this.boss.setTexture("explosion");
                this.boss.play("explode");
                this.physics.pause();
                this.victory_sound.play();
                this.time.delayedCall(5000, function () {
                    this.scene.start('Accueil', { score: this.score });
                    this.resetGame();
                }, [], this);
            }
        }
    }

    resetGame() {
        this.life = 5;
        this.nb_ennemy = 0;
        this.level = 1;
        this.speed = 200;
        this.score = 0;
        this.delayFire = 300;
    }
    
    bonusEffect(pointer) {
        pointer.destroy()
        this.collect_sound.play();
        this.life++;
        this.lifeText.text = "Life " + this.life;
        if(this.speed <=500){
            this.delayFire -= 100;
            this.speed +=100
            this.text2 = this.add.text(320, 100, "Life +1\nSpeed +1\nFire +1", {
                font: "35px Arial Bold",
                fill: "gold",
            })
        }else{
            this.text2 = this.add.text(320, 100, "Life +1", {
                font: "35px Arial Bold",
                fill: "gold",
            })
        }
        this.time.delayedCall(1000, function () {
            this.text2.destroy();
        } , [], this);
    }
}