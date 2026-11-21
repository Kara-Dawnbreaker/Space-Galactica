import { Input } from "./Input.js";import { Renderer } from "./Renderer.js";import { Player } from "../entities/Player.js";
export class Game{
constructor(canvas,callbacks={}){this.canvas=canvas;this.callbacks=callbacks;this.context=canvas.getContext("2d",{alpha:false});this.input=new Input(canvas);this.renderer=new Renderer(this.context);this.player=new Player();this.mode="space";this.state="menu";this.lastTime=0;this.frameId=0;this.width=0;this.height=0;this.resizeObserver=new ResizeObserver(()=>this.resize())}
initialize(){this.resizeObserver.observe(this.canvas);this.resize();this.render()}
resize(){const rect=this.canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);this.width=Math.max(1,rect.width);this.height=Math.max(1,rect.height);this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.context.setTransform(dpr,0,0,dpr,0,0);this.player.setBounds(this.width,this.height);this.render()}
start(mode){if(mode!=="space"&&mode!=="sea")return;this.mode=mode;this.player.reset(this.width,this.height);this.state="running";this.lastTime=0;this.callbacks.onModeChange?.(mode);this.input.reset();cancelAnimationFrame(this.frameId);this.frameId=requestAnimationFrame(time=>this.loop(time))}
loop(time){if(this.state!=="running")return;const delta=this.lastTime?Math.min((time-this.lastTime)/1000,.033):0;this.lastTime=time;this.update(delta);this.render();this.frameId=requestAnimationFrame(next=>this.loop(next))}
update(delta){this.player.update(delta,this.input,this.width,this.height)}
render(){this.renderer.draw(this.width,this.height,this.mode,this.player,this.state)}
togglePause(){if(this.state==="running")this.pause();else if(this.state==="paused")this.resume()}
pause(){if(this.state!=="running")return;this.state="paused";cancelAnimationFrame(this.frameId);this.callbacks.onPauseChange?.(true);this.render()}
resume(){if(this.state!=="paused")return;this.state="running";this.lastTime=0;this.callbacks.onPauseChange?.(false);this.frameId=requestAnimationFrame(time=>this.loop(time))}
restart(){if(this.state==="menu")return;this.player.reset(this.width,this.height);this.state="running";this.lastTime=0;this.callbacks.onPauseChange?.(false);this.input.reset();cancelAnimationFrame(this.frameId);this.frameId=requestAnimationFrame(time=>this.loop(time))}
}