export interface Enemy {
  id: string;
  name: string;
  imageUrl: string;
}

export type AddEnemyType = {
  name: string;
  image: File;
};

export type AddEnemyResult = {
  id: string;
  imageUrl: string;
};

export type UpdateEnemyType = {
  name?: string;
  image?: File;
};

export type UpdateEnemyResult = {
  imageUrl?: string;
};
