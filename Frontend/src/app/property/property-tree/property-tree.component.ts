import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ITree } from '../../model/ITree.interface';
import { Property } from '../../model/Property.interface';
import { MatSelectChange } from '@angular/material/select';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { environment } from '../../../environments/environment';



@Component({
    selector: 'app-property-tree',
    templateUrl: './property-tree.component.html',
    styleUrls: ['./property-tree.component.css']
})
export class PropertyTreeComponent implements OnInit {
    PropertyTree: ITree[] = [];
    Properties: Property[] = [];
    ResultProperties: Property[] = [];

    breadcrumb: Array<{ label: string, url: string }> = [];

    treeControl = new NestedTreeControl<ITree>(node => node.properties);
    dataSource = new MatTreeNestedDataSource<ITree>();

    FoundProperty: Property = {} as Property;
    originalFolder: string = environment.originalPictureFolder;

    constructor(private housingService: HousingService) { }

    ngOnInit() {
        this.housingService.getPropertyTree(0).subscribe(data => {
            this.PropertyTree = data;
            this.dataSource.data = this.PropertyTree;
        });



        this.housingService.getAllProperties(1).subscribe(data => {
            this.Properties.push(...data);
        });

        this.housingService.getAllProperties(2).subscribe(data => {
            this.Properties.push(...data);
        })

    }


    hasChild = (_: number, node: ITree) => !!node.properties && node.properties.length > 0;

    onSelectionChange($event: MatSelectChange) {
        const selectedOption = $event.value;
        if (this.ResultProperties.length > 0) {
            this.ResultProperties = [];
        }
        const propertyParent = this.Properties.find(prop => prop.id === selectedOption) as Property;
        this.ResultProperties.push(propertyParent);
        const parentNode = this.PropertyTree.find(elem => elem.nodeID === selectedOption);


        parentNode?.properties.forEach(child => {
            const propertyChild = this.Properties.find(prop => prop.id === child.nodeID) as Property;
            this.ResultProperties.push(propertyChild);
        })

    }


    getPropertyById(nodeID: number): Property {

        this.FoundProperty = this.Properties.find(prop => prop.id === nodeID) as Property;

        return this.FoundProperty || {} as Property;
    }
}
