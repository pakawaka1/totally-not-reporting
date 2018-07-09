import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Rating } from './results.rating';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: [ './results.component.scss' ]
})

export class ModalComponent implements OnInit {

  constructor(
    public openModal: MatDialogRef<ModalComponent>,
    public _rating: Rating,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.data._rating();
  }

  onNoClick(): void {
    this.openModal.close();
  }

  public roundMillion(number: number) {
    const roundedMillion  = Math.round(number * 10 / 1000000) / 10;
    return '$' + roundedMillion.toString() + 'm';
  }

}
