export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  attack: number;
  defense: number;
  isActive: boolean;
  sellPrice?: number;
  buyPrice?: number;
}

export type AddEquipmentType = {
  name: string;
  description: string;
  attack: number;
  defense: number;
  buyPrice: number;
  image: File;
};

export type AddEquipmentResult = {
  id: string;
  imageUrl: string;
};

export type EditEquipmentType = {
  name?: string;
  description?: string;
  attack?: number;
  defense?: number;
  buyPrice?: number;
  image?: File;
};

export type EditEquipmentResult = {
  imageUrl: string | null;
};
