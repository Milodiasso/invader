var config = {
    width: 800,
    height: 580,
    backgroundColor : 'black',
    scene: [ Accueil, Scene1, Scene2],
    pixelArt : true,
    physics : {
        default : "arcade",
        arcade : {
            gravity : {
                y : 0,
                
            },
            debug: false
        },
        
    },
};

var game = new Phaser.Game(config);
