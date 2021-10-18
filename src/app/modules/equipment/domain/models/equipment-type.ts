export class EquipmentTypes {
  private static HELMET_VALUE = 0;
  private static CHESTPLATE_VALUE = 1;
  private static LEGGINGS_VALUE = 2;
  private static BOOTS_VALUE = 3;
  private static WEAPON_VALUE = 4;
  private static SHIELD_VALUE = 5;

  static helmet = new EquipmentTypes(EquipmentTypes.HELMET_VALUE);
  static chestplate = new EquipmentTypes(EquipmentTypes.CHESTPLATE_VALUE);
  static leggings = new EquipmentTypes(EquipmentTypes.LEGGINGS_VALUE);
  static boots = new EquipmentTypes(EquipmentTypes.BOOTS_VALUE);
  static weapon = new EquipmentTypes(EquipmentTypes.WEAPON_VALUE);
  static shield = new EquipmentTypes(EquipmentTypes.SHIELD_VALUE);

  private constructor(private readonly value: number) {}

  toString(): string {
    if (this.isHelmet) {
      return 'Helmet';
    }
    if (this.isChestplate) {
      return 'Chestplate';
    }
    if (this.isLeggings) {
      return 'Leggings';
    }
    if (this.isBoots) {
      return 'Boots';
    }
    if (this.isWeapon) {
      return 'Weapon';
    }
    if (this.isShield) {
      return 'Shield';
    }
    return '';
  }

  toSpanishString(): string {
    if (this.isHelmet) {
      return 'Casco';
    }
    if (this.isChestplate) {
      return 'Peto';
    }
    if (this.isLeggings) {
      return 'Pantalón';
    }
    if (this.isBoots) {
      return 'Botas';
    }
    if (this.isWeapon) {
      return 'Arma';
    }
    if (this.isShield) {
      return 'Escudo';
    }
    return '';
  }

  equals(other: EquipmentTypes) {
    return this.value === other.value;
  }

  get isHelmet(): boolean {
    return this.value === EquipmentTypes.HELMET_VALUE;
  }
  get isChestplate(): boolean {
    return this.value === EquipmentTypes.CHESTPLATE_VALUE;
  }
  get isLeggings(): boolean {
    return this.value === EquipmentTypes.LEGGINGS_VALUE;
  }
  get isBoots(): boolean {
    return this.value === EquipmentTypes.BOOTS_VALUE;
  }
  get isWeapon(): boolean {
    return this.value === EquipmentTypes.WEAPON_VALUE;
  }
  get isShield(): boolean {
    return this.value === EquipmentTypes.SHIELD_VALUE;
  }
}
