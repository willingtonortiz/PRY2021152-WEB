import { Component, Input } from '@angular/core';
import { EquipmentTypes } from '../../../domain';

@Component({
  selector: 'app-equipment-image',
  templateUrl: './equipment-image.component.html',
  styleUrls: ['./equipment-image.component.scss'],
})
export class EquipmentImageComponent {
  @Input() imageUrl: string = '';
  @Input() size: number = 100;
  @Input() type: EquipmentTypes = EquipmentTypes.helmet;

  get getTransformByType() {
    let transform = {};

    // * Helmet
    if (this.type == EquipmentTypes.helmet) {
      const translateY = (this.size * 42) / 125;
      transform = { transform: `scale(2.5, 2.5) translate(-2px, ${translateY}px)` };
    }

    // * Chestplate
    else if (this.type == EquipmentTypes.chestplate) {
      transform = { transform: `scale(2, 2) translate(0px, 0px)` };
    }

    // * Leggings
    else if (this.type == EquipmentTypes.leggings) {
      const translateY = (-1 * this.size * 30) / 125;
      transform = { transform: `scale(2, 2) translate(0px, ${translateY}px)` };
    }

    // * Boots
    else if (this.type == EquipmentTypes.boots) {
      const translateY = (-1 * this.size * 40) / 125;
      transform = { transform: `scale(2, 2) translate(0px, ${translateY}px)` };
    }

    // * Weapon
    else if (this.type == EquipmentTypes.weapon) {
      const translateX = (this.size * 30) / 125;
      const translateY = (this.size * 10) / 125;

      transform = {
        transform: `rotate(-0.1turn) scale(1.4, 1.4) translate(${translateX}px, ${translateY}px)`,
      };
    }

    // * Shield
    else if (this.type == EquipmentTypes.shield) {
      const translateX = (-1 * this.size * 35) / 125;
      const translateY = (this.size * -50) / 1000;
      transform = {
        transform: `scale(1.4, 1.4) translate(${translateX}px, ${translateY}px)`,
      };
    }

    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      ...transform,
    };
  }
}
