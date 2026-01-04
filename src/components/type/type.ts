export type Board = {
  id: string;
  name: string; 
  lists: List[],
};

export type List = {
  id: string;
  name:string;
  position: number;
  cards: Card[]
}

export type Card = {
  id: string;
  name: string;
  position: number;
  isComplete: boolean
}