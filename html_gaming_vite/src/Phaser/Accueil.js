class Accueil extends Phaser.Scene {
    constructor() {
        let lastScore = localStorage.getItem('score')
        super("Accueil")
        this.lastScore = lastScore || 0;
    }

    preload(){
        this.load.audio('menu_music', 'assets/invader/menu_music.mp3');
        this.load.image("instruction", 'assets/invader/instruction.png');
    }

    create(data) {
        // this.sound.stopAll();
        this.add.image(400, 430, 'instruction');

        let menu_music = this.sound.add('menu_music', { mute: false });
        
        let startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY -50, 'Start game', { fontSize: '45px', fill: '#0f0' })
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start("bootGame")
            })
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))
        console.log(this.lastScore);
        this.add.text(0, 20 , " Made by Saidolim\r");
        this.add.text(this.cameras.main.centerX -130, this.cameras.main.centerY -200 , data.score ? 'Last score: ' + data.score  : 'Last score : ' + this.lastScore, { font: '32px Courier', fill: '#0f0' })

        if (this.scene.key === 'Accueil') {
            setTimeout(() => {
                menu_music.play();
                
            }, 2000);
            this.events.on('shutdown', () => {
                menu_music.stop();
            });
        }
    }


}