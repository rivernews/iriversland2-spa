import { Injectable } from '@angular/core';

import * as tinycolor from "tinycolor2";
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class LogMessageService {
    private contextName: string;
    private disabledLog: boolean;

    private cachedColorSet: any = {};
    private fallbackColorPair: any[] = [tinycolor(`#d1e1f9`), tinycolor(`#112b51`)];

    constructor(
        private apiService: ApiService
    ) { }

    public print(contextCOmponent: any, message: any, truncate?: number): void {
        this.setContext(contextCOmponent);

        // if (this.disabledLog) return;
        if (this.disabledLog || !this.apiService.isLocalDev()) return;

        let finalizedMessage: String = null;
        if (message instanceof String) {
            finalizedMessage = message;
        }
        else if (message === null || message === undefined) {
            finalizedMessage = 'empty: ' + message;
        }
        else {
            try {
                finalizedMessage = JSON.stringify(message);                
            }
            catch {
                finalizedMessage = '' + message.toString();
            }
        }

        let colorPair = this.getColorPairs();

        // truncate string
        finalizedMessage = this.truncateString(finalizedMessage, truncate);

        console.log(`%c${this.contextName}:`,
            `
            color: ${colorPair[0].toHexString()}; 
            background-color: ${colorPair[1].toHexString()};
            border-radius: 3px `,
            `${finalizedMessage}`,
        );
    }

    private truncateString(msg: String, truncateSpec?: number) : String {
        let truncate = (truncateSpec === 0 || truncateSpec) ? truncateSpec : 200;
        let finalizedMessage = msg;
        let tailNotes = (msg.length > truncate) ? `...(truncated)` : ``;

        if (truncate > 0) {
            finalizedMessage = finalizedMessage.substring(0, truncate);            
        }
        else if (truncate === 0) {
            tailNotes = '';
        }

        return `${finalizedMessage}${tailNotes}`;
    }

    private getColorPairs() : any[] {
        if (this.contextName in this.cachedColorSet) {
            return this.cachedColorSet[this.contextName];
        }
        else {
            return this.cachedColorSet[this.contextName] = this.generateRandomColorPairs();
        }
    }

    private printColors__debug(colorSet: any[]) {
        colorSet.forEach(color => {
            let light = (color.isLight())? 'light' : '';
            let dark = (color.isDark())? 'dark' : '';
            console.log(`%cHey the color is ...${light}/${dark}, this lum: ${color.getLuminance()}`, `background-color: ${color.toHexString()}`);
        });
    }

    private generateRandomColorPairs() : any[] {
        let c1 = tinycolor.random().lighten().desaturate();
        let c2 = null;

        let emphasized = c1;
        let contrastSet = emphasized.monochromatic(30);
        let niceContrastSet = contrastSet.filter((c) => c.getLuminance() < 1 && c.getLuminance() > 0.02);
        niceContrastSet.sort( (a: any, b: any) => {
            return a.getLuminance() -  b.getLuminance();
        });

        if (niceContrastSet.length < 3) {
            return (tinycolor.random().isLight())? this.fallbackColorPair: this.fallbackColorPair.reverse();
        }

        c1 = niceContrastSet[0];
        c2 = tinycolor.mostReadable(c1, niceContrastSet, {
            includeFallbackColors: true,
            level: "AA",
            size: 'small'
        })
        .spin(0);

        return [c2, c1];
    }

    private setContext(contextComponent: any): void {
        if (contextComponent.DEBUG) {
            this.disabledLog = ! contextComponent.DEBUG ;
        } else {
            this.disabledLog = true;
        }
        this.contextName = contextComponent.constructor.name;
    }
}
