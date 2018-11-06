export interface ListItem {
	// Button related things
	text?: string;
	icon?: string;
	isDisabled?: boolean;

	isDivider?: boolean;

	isSubheader?: boolean;
}

export interface SidenavButton extends ListItem {
	path?: string;
}

export interface SettingsItem extends ListItem {
	secondaryText?: string;
	type?: "checkbox" | "toggle" | "select";
	formControlName?: string;
	onChange?: Function;

	defualtValue?: any;
	values?: SettingsSelectItem[];
}

export interface SettingsSelectItem {
	value: string | number;
	viewValue: string | number;
}
