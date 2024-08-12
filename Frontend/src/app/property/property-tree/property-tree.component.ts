import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ITree } from '../../model/ITree.interface';
import { Property } from '../../model/Property.interface';

@Component({
  selector: 'app-property-tree',
  templateUrl: './property-tree.component.html',
  styleUrls: ['./property-tree.component.css']
})
export class PropertyTreeComponent implements OnInit {

  PropertyTree: ITree[] = [];
  Properties: Property[];
  constructor(private housingService: HousingService) { }

  ngOnInit() {
    this.housingService.getPropertyTree(0).subscribe(data => {
      this.PropertyTree = data;
    });



  }

}