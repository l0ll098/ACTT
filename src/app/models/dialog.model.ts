export interface DialogData {
    title: string;
    message: string;

    doActionBtn: DialogButton;
    cancelBtn?: DialogButton;
}

export interface DialogButton {
    text: string;
    onClick?: Function;
}
