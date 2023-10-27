class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image("ball","ball.png");
        this.load.image("wall","wall.png");
        this.load.image("oneway","one_way_wall.png");
    }

    create() {
        // shot counter
        this.shotCounter = 0;
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/8,"cup").setOrigin(0.5);
        this.cup.body.setCircle(this.cup.width/4); // turn body into a circle
        this.cup.body.setOffset(this.cup.width/4); // move it towards the center
        this.cup.body.setImmovable(true); // cannot move

        // add ball
        this.ball = this.physics.add.sprite(width/2, height*9/10,"ball");
        this.ball.body.setCircle(this.ball.width/2); // body into a circle
        this.ball.body.setCollideWorldBounds(true); // world bounds
        this.ball.body.setBounce(0.5); // bounce
        this.ball.body.setDamping(true).setDrag(0.5); // add drag
        //this.ball.setPushable(true);

        // add walls, ctrl + D to select add instance below
        let wallA = this.physics.add.sprite(0, height/4, "wall"); // create wall
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2)); //randomize x-position
        wallA.setPushable(false); //cannot be pushed, but can be moved

        let wallB = this.physics.add.sprite(0, height/2, "wall"); // create wall
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2)); //randomize x-position
        wallB.setPushable(false);
        wallB.body.setCollideWorldBounds(true); // world bounds
        wallB.body.setBounce(1); // bounce
        wallB.body.setVelocityX(500);

        // add one way
        this.oneWay = this.physics.add.sprite(0, height/3, "oneway");
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width));
        this.oneWay.setPushable(false);
        this.oneWay.body.checkCollision.down = false;

        this.walls = this.add.group([wallA, wallB, this.oneWay]); // must be after all walls are initialized

        // variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

        this.input.on("pointerdown", (pointer) => { //on click
            this.shotCounter++;
            let shotDirectionY, shotDirectionX;
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1; // turnery op. if cursor is below or equal to ball, else
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1; // turnery op. if cursor is below or equal to ball, else
            this.ball.body.setVelocityX(shotDirectionX * Phaser.Math.Between(this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X * 2)); // random x range
            this.ball.body.setVelocityY(shotDirectionY * Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)); // random y range
        });

        this.physics.add.collider(this.cup, this.ball, (cup, ball) => { // when cup and ball collide
            this.ball.destroy(); // destroy ball
            this.scene.restart(); //restart scene
        });

        this.physics.add.collider(this.walls, this.ball); //no callback, will bounce and collide
        //this.physics.add.collider(this.oneWay, this.ball);


    }

    update() {

    }
}