export class EntityManager{
  private nextID:number
  private entities: Map<number, Map<string, object>>

  constructor(){
    this.nextID = 1;
    this.entities = new Map();
  }

  createEntity(): number{
    let returnNumber:number = this.nextID
    this.nextID += 1;
    this.entities.set(returnNumber,  new Map());
    return returnNumber;
  }

  destroyEntity(entity: number): void{
    this.entities.delete(entity);

  }

  entityExists(entity:number):boolean{
    return this.entities.has(entity);
  }

  addComponent(entity:number, name:string, data: object):void{
    let components = this.entities.get(entity);
    components?.set(name, data);
  }

  getComponent(entity: number, name: string):any{
    let component = this.entities.get(entity)
    return component?.get(name);
  }

  hasComponent(entity:number, name:string):boolean{
    return this.entities.has(entity);
  }

  removeComponent(entity:number, name:string){
    this.entities.delete(entity);
  }

  query(...componentNames:string[]):  number[]{
    let entities:number[] = []
    for(let [id, components] of this.entities.entries()){
      let anyMissing:boolean = false;

      for(let i = 0; i< componentNames.length; i++){

        if (!components?.has(componentNames[i]!)){
          anyMissing = true
          break;
        }      
      }
      if(anyMissing === false){
        entities.push(id);
      }
    }
    return entities;
  }

}
