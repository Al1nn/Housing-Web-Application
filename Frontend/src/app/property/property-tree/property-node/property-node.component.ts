import { Component, Input, OnInit } from '@angular/core';
import { Property } from '../../../model/Property.interface';
import { ITree } from '../../../model/ITree.interface';

@Component({
  selector: 'app-property-node',
  templateUrl: './property-node.component.html',
  styleUrls: ['./property-node.component.css']
})
export class PropertyNodeComponent implements OnInit {
  @Input() node!: ITree[];
  @Input() Property!: Property;

  constructor() { }

  ngOnInit() {
  }

}
