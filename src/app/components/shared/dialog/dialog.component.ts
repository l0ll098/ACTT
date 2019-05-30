import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { DialogData } from "../../../models/dialog.model";

@Component({
    selector: "app-dialog",
    styleUrls: ["dialog.component.css"],
    templateUrl: "dialog.component.html"
})
export class DialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onDoClick() {
        this.close();

        if (this.data.doActionBtn.onClick) {
            return this.data.doActionBtn.onClick();
        } else {
            return null;
        }
    }

    onCancelClick() {
        this.close();

        if (this.data.cancelBtn && this.data.cancelBtn.onClick) {
            return this.data.cancelBtn.onClick();
        } else {
            return null;
        }
    }

    private close() {
        this.dialogRef.close();
    }
}
