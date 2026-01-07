export type Board = {
  id: string;
  name: string; 
  lists: List[],
  members: Member[]
};

export type Member = {
  userId: string;
  userName: string;
  avatarUrl?: string;
}

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