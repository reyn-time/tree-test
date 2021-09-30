import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

interface FoodNode {
  id: number;
  name: string;
  children?: FoodNode[];
}

interface ExampleFlatNode {
  id: number;
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    id: 1,
    name: 'Fruit',
    children: [],
  },
  {
    id: 2,
    name: 'Vegetables',
    children: [
      {
        id: 3,
        name: 'Green',
        children: [],
      },
    ],
  },
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private _transformer = (node: FoodNode, level: number): ExampleFlatNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    let i = 0;
    const loop = () => {
      TREE_DATA[0].name = 'Fruit' + String.fromCharCode(65 + (i++ % 26));
      this.dataSource.data = TREE_DATA;
      setTimeout(() => loop(), 1000);
    };
    loop();
  }

  hasChild(_: number, node: ExampleFlatNode): boolean {
    return node.expandable;
  }

  trackBy(_: number, node: ExampleFlatNode): number {
    return node.id;
  }
}
