import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LogMessageService } from '../../services/log-message.service';

class Label {

    iconFontSet: string;
    iconLigature: string;
    text: string;

    constructor(ligature, text?, fontSet?) {

        this.iconLigature = ligature || '';
        this.text = text || this.capitalize(this.iconLigature);
        this.iconFontSet = fontSet || `material-icons`;
    }

    private capitalize(string: string) {
        if (string.length <= 1) {
            return string.toLocaleUpperCase();
        }
        return string.charAt(0).toLocaleUpperCase() + string.slice(1);
    }
}

@Component({
    selector: 'app-labeled-switch',
    templateUrl: './labeled-switch.component.html',
    styleUrls: ['./labeled-switch.component.scss']
})
export class LabeledSwitchComponent implements OnInit {
    @ViewChild('matSwitch') matSwitch;

    @Input()
    public checkedValue: boolean = false;

    @Output() 
    public checkedChange = new EventEmitter<boolean>();    

    public checkedLabel: Label;
    public unCheckedLabel: Label;

    public onChange: Function;

    private DEBUG: boolean = false;

    constructor(
        private logService: LogMessageService,
    ) { }

    ngOnInit() {
        this.checkedLabel = new Label(`public`);
        this.unCheckedLabel = new Label(`lock`);

        this.logService.print(this, this.checkedLabel);
    }

    public switchChanged(event) {
        this.checkedValue = ! this.checkedValue;
        this.checkedChange.emit(this.checkedValue);
    }

    set checked(value) {
        this.checkedValue = value;
    }

    @Input()
    get checked() {
        return this.checkedValue;
    }

}
