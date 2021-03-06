import {
  Component,
  ViewChild
} from '@angular/core';

import { MenuComponent, MenuOpenFrom } from '@angular-mdc/web';

@Component({
  selector: 'menu-demo',
  templateUrl: './menu-demo.component.html'
})
export class MenuDemoComponent {
  selectedIndex = -1;
  focusedItemIndex = null;
  openingPoint: any = "topLeft";
  @ViewChild('menu') menu: MenuComponent;

  handleChange() {
    this.menu.openFrom = this.openingPoint;
  }

  showMenu() {
    this.menu.open(this.focusedItemIndex);
  }
  handleMenuSelect(event: number) {
    this.selectedIndex = event;
  }
}
