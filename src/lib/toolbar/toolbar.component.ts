import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { EventRegistry } from '../common/event-registry';
import { isBrowser } from '../common/platform';

import { ToolbarTitleDirective } from './toolbar-title.directive';
import { ToolbarRowDirective } from './toolbar-row.directive';

import { MDCToolbarAdapter } from './toolbar-adapter';
import { MDCToolbarFoundation } from '@material/toolbar';

@Component({
  selector: 'mdc-toolbar',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
  @Input() flexible: boolean;
  @Input() flexibleDefaultBehavior: boolean = true;
  @Input() fixed: boolean;
  @Input() waterfall: boolean;
  @Input() fixedLastrow: boolean;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  @ContentChild(ToolbarRowDirective) mdcFirstRow;
  @ContentChild(ToolbarTitleDirective) mdcTitle;
  @HostBinding('class.mdc-toolbar') isHostClass = true;
  @HostBinding('class.mdc-toolbar--fixed') get classFixedToolbar(): string {
    return this.fixed ? 'mdc-toolbar--fixed' : '';
  }
  @HostBinding('class.mdc-toolbar--waterfall') get classWaterfallToolbar(): string {
    return this.waterfall ? 'mdc-toolbar--waterfall' : '';
  }
  @HostBinding('class.mdc-toolbar--flexible') get classFlexibleToolbar(): string {
    return this.flexible ? 'mdc-toolbar--flexible' : '';
  }
  @HostBinding('class.mdc-toolbar--fixed-lastrow-only') get classFixedLastrow(): string {
    return this.fixedLastrow ? 'mdc-toolbar--fixed-lastrow-only' : '';
  }
  @HostBinding('class.mdc-toolbar--flexible-default-behavior') get classFlexibleDefaultBehavior(): string {
    return this.flexible && this.flexibleDefaultBehavior ? 'mdc-toolbar--flexible-default-behavior' : '';
  }

  private _mdcAdapter: MDCToolbarAdapter = {
    hasClass: (className: string) => {
      return this._root.nativeElement.classList.contains(className);
    },
    addClass: (className: string) => {
      this._renderer.addClass(this._root.nativeElement, className);
    },
    removeClass: (className: string) => {
      this._renderer.removeClass(this._root.nativeElement, className);
    },
    registerScrollHandler: (handler: EventListener) => {
      if (isBrowser()) {
        this._registry.listen_(this._renderer, 'scroll', handler, 'window');
      }
    },
    deregisterScrollHandler: (handler: EventListener) => {
      if (isBrowser()) {
        this._registry.unlisten_('scroll', handler);
      }
    },
    registerResizeHandler: (handler: EventListener) => {
      if (isBrowser()) {
        this._registry.listen_(this._renderer, 'resize', handler, 'window');
      }
    },
    deregisterResizeHandler: (handler: EventListener) => {
      if (isBrowser()) {
        this._registry.unlisten_('resize', handler);
      }
    },
    getViewportWidth: () => {
      return isBrowser() ? window.innerWidth : 0;
    },
    getViewportScrollY: () => {
      return isBrowser() ? window.pageYOffset : 0;
    },
    getOffsetHeight: () => this._root.nativeElement.offsetHeight,
    getFirstRowElementOffsetHeight: () => {
      return this.mdcFirstRow ? this.mdcFirstRow.elementRef.nativeElement.offsetHeight : 0;
    },
    notifyChange: (evtData: { flexibleExpansionRatio: number }) => {
      this.change.emit(evtData.flexibleExpansionRatio);
    },
    setStyle: (property: string, value: string) => {
      this._renderer.setStyle(this._root.nativeElement, property, value);
    },
    setStyleForTitleElement: (property: string, value: string) => {
      if (this.mdcTitle) {
        this._renderer.setStyle(this.mdcTitle.elementRef.nativeElement, property, value);
      }
    },
    setStyleForFlexibleRowElement: (property: string, value: string) => {
      if (this.mdcFirstRow) {
        this._renderer.setStyle(this.mdcFirstRow.elementRef.nativeElement, property, value);
      }
    },
    setStyleForFixedAdjustElement: (property: string, value: string) => {
      if (isBrowser() && this.fixed) {
        this._renderer.setStyle(document.body, property, value);
      }
    }
  };

  private _foundation: {
    init: Function,
    destroy: Function,
    updateAdjustElementStyles: Function
  } = new MDCToolbarFoundation(this._mdcAdapter);

  constructor(
    private _renderer: Renderer2,
    private _root: ElementRef,
    private _registry: EventRegistry) { }

  ngAfterViewInit() {
    this._foundation.init();
  }
  ngOnDestroy() {
    this._foundation.destroy();
  }

  updateAdjustElementStyles() {
    this._foundation.updateAdjustElementStyles();
  }
}
