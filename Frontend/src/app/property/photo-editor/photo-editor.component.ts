import { Component, Input, OnInit } from '@angular/core';
import { Property } from '../../model/Property.interface';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() property: Property;
  constructor() { }

  ngOnInit() {
  }

}
