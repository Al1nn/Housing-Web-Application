import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ITree } from '../../model/ITree.interface';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-property-tree',
  templateUrl: './property-tree.component.html',
  styleUrls: ['./property-tree.component.css']
})
export class PropertyTreeComponent implements OnInit {
  PropertyTree: ITree[];
  Properties: Property[] = [];

  constructor(private housingService: HousingService) { }

  ngOnInit() {
    this.housingService.getPropertyTree(0).subscribe(data => {
      this.PropertyTree = data;
      this.traversePropertyTree(this.PropertyTree);
    });
  }

  traversePropertyTree(tree: ITree[]) {
    const observables: Observable<Property>[] = [];

    const traverse = (node: ITree) => {
      observables.push(this.housingService.getPropertyById(node.nodeID));

      if (node.properties && node.properties.length > 0) {
        node.properties.forEach(child => traverse(child));
      }
    };

    tree.forEach(node => traverse(node));

    forkJoin(observables).subscribe(properties => {
      this.Properties = properties;
      this.organizeProperties();
    });
  }

  organizeProperties() {
    const organizedProperties: Property[] = [];

    const findAndOrganize = (nodeId: number) => {
      const property = this.Properties.find(p => p.id === nodeId);
      if (property) {
        organizedProperties.push(property);

        const node = this.findNodeById(this.PropertyTree, nodeId);
        if (node && node.properties) {
          node.properties.forEach(child => findAndOrganize(child.nodeID));
        }
      }
    };

    this.PropertyTree.forEach(node => findAndOrganize(node.nodeID));

    this.Properties = organizedProperties;
    console.log(this.Properties)
  }

  findNodeById(tree: ITree[], nodeId: number): ITree | null {
    for (const node of tree) {
      if (node.nodeID === nodeId) {
        return node;
      }
      if (node.properties) {
        const found = this.findNodeById(node.properties, nodeId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}