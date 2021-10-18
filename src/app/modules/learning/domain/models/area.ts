export interface Area {
  id: string;
  name: string;
  mathTopics: AreaTopic[];
}

export interface AreaTopic {
  id: string;
  name: string;
  imageUrl: string;
}
