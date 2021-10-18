export interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  levels: TopicLevel[];
}

export type TopicLevel = {
  number: number;
  enemyId: string;
  enemyName: string;
  enemyImageUrl: string;
};

export type AddTopicType = Omit<Topic, 'id' | 'imageUrl' | 'levels'> & {
  image: File;
  enemyIds: string[];
};

export type AddTopicResult = Pick<Topic, 'id' | 'imageUrl'>;

export type UpdateTopicType = {
  name?: string;
  description?: string;
  image?: File;
  enemyIds?: string[];
};

export type UpdateTopicResult = {
  imageUrl: string;
};
