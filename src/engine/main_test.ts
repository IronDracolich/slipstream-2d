import {Input} from "./Input"

function main(){
  let input = new Input()
  let intervalid = setInterval(((a)=>{
    if (input.isKeyPressed("d")){
      console.log("d pressed")
    }}), 100)

  //while (!input.isKeyPressed("a"));
}
main();

