import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NoParams } from '../../../../../core/domain';
import { ConfirmationDialogComponent } from '../../../../../shared/presentation';
import {
  AddEnemyType,
  AddEnemyUseCase,
  DeleteEnemyUseCase,
  Enemy,
  GetAllEnemiesUseCase,
  UpdateEnemyUseCase,
} from '../../../domain';

@Component({
  selector: 'app-enemies-page',
  templateUrl: './enemies-page.component.html',
  styleUrls: ['./enemies-page.component.scss'],
})
export class EnemiesPageComponent implements OnInit {
  isLoading = true;
  enemies: (Enemy & {
    mode: 'PREVIEW' | 'SHOW' | 'ADD' | 'EDIT' | 'DELETE';
  })[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly getAllEnemiesUseCase: GetAllEnemiesUseCase,
    private readonly addEnemyUseCase: AddEnemyUseCase,
    private readonly updateEnemyUseCase: UpdateEnemyUseCase,
    private readonly deleteEnemyUseCase: DeleteEnemyUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    this.fetchAllEnemies();
  }

  async fetchAllEnemies(): Promise<void> {
    this.isLoading = true;

    (await this.getAllEnemiesUseCase.execute(new NoParams())).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: (enemies) => {
        this.enemies = enemies.map((x) => ({ ...x, mode: 'SHOW' }));
      },
    });

    this.isLoading = false;
  }

  onAddNewEnemy(): void {
    const isAddingOne = this.enemies.find((x) => x.mode === 'ADD');
    if (isAddingOne) {
      this.showSnackBar('Ya se está añadiendo un enemigo');
      return;
    }

    this.enemies = [
      { id: '', name: '', imageUrl: '', mode: 'ADD' },
      ...this.enemies,
    ];
  }

  async addEnemy({ name, image }: AddEnemyType): Promise<void> {
    this.isLoading = true;
    (await this.addEnemyUseCase.execute({ name, image })).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: ({ id, imageUrl }) => {
        this.removeAddCards();
        this.enemies = [{ id, imageUrl, name, mode: 'SHOW' }, ...this.enemies];
        this.showSnackBar('El enemigo fue agregado correctamente');
      },
    });
    this.isLoading = false;
  }

  async updateEnemy({
    enemyId,
    name,
    image,
  }: {
    enemyId: string;
    name?: string;
    image?: File;
  }): Promise<void> {
    (await this.updateEnemyUseCase.execute({ enemyId, name, image })).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: ({ imageUrl }) => {
        this.fetchAllEnemies();
        this.showSnackBar('Enemigo editado correctamente');
      },
    });
  }

  removeAddCards(): void {
    this.enemies = this.enemies.filter((x) => x.mode !== 'ADD');
  }

  async deleteEnemy(enemy: Enemy): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        name: `"${enemy.name}"`,
        content:
          'No se pueden eliminar enemigos que se encuentren asociados a un nivel de un tema.',
      },
    });

    dialogRef.afterClosed().subscribe(async (x) => {
      if (x !== true) {
        return;
      }

      (await this.deleteEnemyUseCase.execute({ enemyId: enemy.id })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (_) => {
          this.showSnackBar('Enemigo eliminado correctamente');
          this.fetchAllEnemies();
        },
      });
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }
}
