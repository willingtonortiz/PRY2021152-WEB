export interface Problem {
  id: string;
  difficulty: string;
  description?: string;
  imageUrl?: string;
}

export type GetOneProblemResult = {
  id: string;
  difficultyId: string;
  difficultyName: string;
  description?: string;
  imageUrl?: string;
  answers: ProblemAnswer[];
};

export type ProblemAnswer = {
  id: string;
  description: string;
  isCorrect: boolean;
};

export type AddProblemType = {
  difficultyId: string;
  answers: { description: string; isCorrect: boolean }[];

  description?: string;
  image?: File;

  // For store
  difficultyName: string;
};

export type AddProblemResult = {
  id: string;
  imageUrl?: string;
};

export type UpdateProblemType = {
  difficultyId?: string;

  description?: string;
  image?: File;

  answers?: ProblemAnswer[];
};

export type UpdateProblemResult = {
  imageUrl?: string;
};
