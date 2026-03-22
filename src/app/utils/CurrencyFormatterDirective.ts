import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef, private control: NgControl) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    value = value.replace(/[^0-9.]/g, ''); // Remove all non-numeric characters except the decimal point
    const [integer, decimal] = value.split('.');
    const formattedValue = `${integer}.${(decimal || '00').substring(0, 2)}`; // Ensure two decimal places
    this.control.control?.setValue(formattedValue);
    this.el.value = formattedValue;
  }

  @HostListener('blur')
  onBlur(): void {
    let value = this.el.value;
    if (!value.includes('.')) {
      value += '.00';
    }
    this.control.control?.setValue(value);
    this.el.value = value;
  }

  @HostListener('focus')
  onFocus(): void {
    if (this.el.value === '0.00') {
      this.el.value = '';
    }
  }
  
}
