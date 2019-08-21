import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarServiceService {

  constructor(
    private bar: MatSnackBar,
  ) { }

  popUpMessage(message: string, _duration?: number, action?: string, errorSource?: any) {
    let duration = (_duration || _duration === 0) ? _duration : 4000;
    let messageText = null;

    if (errorSource) {
      let error = errorSource;
      let errorMessage = null;
      if ((error.toString() instanceof String)) {
        errorMessage = error.toString();
      } 
      else if (error.message) {
        errorMessage = error.message;
      }
      else {
        errorMessage = JSON.stringify(error);
      }
      messageText = `🛑 ${message} Error message: ${errorMessage}`;
    }
    else {
      messageText = message;
    }

    this.bar.open(messageText, (action) ? action : undefined, {
      duration
    });
  }
}
