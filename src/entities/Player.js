export class Player{
constructor(){this.radius=12;this.speed=300;this.x=0;this.y=0;this.bounds={width:0,height:0}}
reset(width,height){this.x=width/2;this.y=height*.78;this.setBounds(width,height)}
setBounds(width,height){this.bounds.width=width;this.bounds.height=height;this.x=Math.max(this.radius,Math.min(this.x||width/2,width-this.radius));this.y=Math.max(this.radius,Math.min(this.y||height*.78,height-this.radius))}
update(delta,input,width,height){const movement=input.getMovement();if(movement.pointer){const followSpeed=Math.min(1,delta*9);this.x+=(movement.pointer.x-this.x)*followSpeed;this.y+=(movement.pointer.y-this.y)*followSpeed}else{this.x+=movement.x*this.speed*delta;this.y+=movement.y*this.speed*delta}this.x=Math.max(this.radius+4,Math.min(this.x,width-this.radius-4));this.y=Math.max(this.radius+4,Math.min(this.y,height-this.radius-4))}
}