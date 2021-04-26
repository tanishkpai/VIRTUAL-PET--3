var dog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var sadDog,happyDog,bedroom,deadDog,dogvaccination,garden,injection,lazy,livingroom,milk,milkim,running,runningleft,vaccination,washroom;
var gameState = "game";
function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
bedroom = loadImage("BedRoom.png");
deadDog = loadImage("deadDog.png");
dogvaccination = loadImage("dogVaccination.png")
garden = loadImage("Garden.png")
injection= loadImage("Injection.png")
lazy= loadImage("Lazy.png")
livingroom= loadImage("Living Room.png")
milk= loadImage("Milk.png")
milkim = loadImage("milkImage.png");
running= loadImage("running.png")
runningLeft= loadImage("runningLeft.png")
vaccination= loadImage("Vaccination.jpg")
washroom= loadImage("WashRoom.png")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);



}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  //read game state from database
  readState= database.ref('gameState');
  readState.on("value",function(data){

    gameState = data.val();

  })

  fill(255,255,254);
  textSize(15);
  currentTime=seconds,hour();
if(currentTime==(lastFed+1)){
  update("playing");
  foodObj.garden();

}else if(currentTime == (lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();

}else{
  update("hungry");
  foodObj.display();
}
 //hide buttons if the state is not hungry
 if(gameState!="hungry"){
   feed.hide()
   addFood.hide();
   dog.remove();

 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
 }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

  //function to update gameStates in database
  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }