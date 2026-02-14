import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  id: number;
  label: string;
  image: string;
}

@Component({
  selector: 'app-image-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-dropdown.html',
  styleUrls: ['./image-dropdown.css']
})
export class ImageDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder = 'Select';
  @Input() showThumb = false; // match compact look by default
  @Input() fullWidth = true;
  @Output() select = new EventEmitter<DropdownOption>();

  open = false;
  selected?: DropdownOption;

  toggle() {
    this.open = !this.open;
  }

  choose(opt: DropdownOption) {
    this.selected = opt;
    this.select.emit(opt);
    this.open = false;
  }

  trackById(_i: number, o: DropdownOption) {
    return o.id;
  }
}
