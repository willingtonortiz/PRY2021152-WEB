import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-problem-preview',
  templateUrl: './problem-preview.component.html',
  styleUrls: ['./problem-preview.component.scss'],
})
export class ProblemPreviewComponent {
  @Input() description: string = '';
  @Input() imageUrl?: string = '';
  @Input() selectedAnswer?: number = 0;
  @Input() answers: string[] = [];

  answerLetters = ['A', 'B', 'C', 'D', 'E'];
  constructor() {}
}
