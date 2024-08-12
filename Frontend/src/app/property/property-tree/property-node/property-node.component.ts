import { Component, Input, OnInit } from '@angular/core';
import { ITree } from '../../../model/ITree.interface';
import { Property } from '../../../model/Property.interface';
import { HousingService } from '../../../services/housing.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-property-node',
  templateUrl: './property-node.component.html',
  styleUrls: ['./property-node.component.css']
})
export class PropertyNodeComponent implements OnInit {

  @Input() node!: ITree;
  Property: Property;
  thumbnailFolder: string = environment.thumbnailFolder;
  constructor(private housingService: HousingService) { }

  ngOnInit() {
    this.housingService.getPropertyById(this.node.nodeID).subscribe(data => {
      this.Property = data;
    });
  }

}