import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy } from "@angular/core";
import { MatTableDataSource, MatPaginator, Sort, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

import { DialogComponent } from "../dialog/dialog.component";

import { LapTime } from "../../models/data.model";

import { FirebaseService } from "../../services/firebase.service";
import { SettingsService, SettingsName } from "../../services/settings.service";

@Component({
	selector: 'app-times',
	templateUrl: './times.component.html',
	styleUrls: ['./times.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesComponent implements AfterViewInit {

	public lapTimes: LapTime[] = [];
	public displayedColumns: string[] = ["index", "carName", "trackName", "trackLength", "lapTime", "lap"];
	public dataSource: MatTableDataSource<LapTime>;
	public pageSizeOptions: number[] = [];

	public initialSelection = [];
	public allowMultiSelect = true;
	public selection: SelectionModel<LapTime>;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	public deleteFAB = {
		show: true,
		icon: "delete"
	};

	constructor(
		private dialog: MatDialog,
		private firebaseService: FirebaseService,
		private settingsService: SettingsService
	) {
		this.selection = new SelectionModel<LapTime>(this.allowMultiSelect, this.initialSelection);

		this.settingsService
			.getSttingsValues(SettingsName.LapTimesPageSize)
			.then(data => {
				this.pageSizeOptions = data.map(size => (<number>size.value));
				this.paginator.pageSizeOptions = this.pageSizeOptions;
			});

		this.settingsService
			.getSettingValue(SettingsName.LapTimesPageSize)
			.then(value => {
				this.paginator.pageSize = (<number>value);
			});
	}

	ngAfterViewInit(): void {
		// Load data
		this.refresh();
	}

	sortData(sort: Sort) {
		const data = this.dataSource.data;
		this.dataSource.data = data.sort((a, b) => {
			const isAsc = sort.direction === "asc";
			switch (sort.active) {
				case "index":
					return compare(a["index"], b["index"], isAsc);
				case "carName":
					return compare(a.car.name, b.car.name, isAsc);
				case "trackName":
					return compare(a.track.name, b.track.name, isAsc);
				case "trackLength":
					return compare(a.track.length, b.track.length, isAsc);
				case "lapTime":
					return compare(a.time.millisecs, b.time.millisecs, isAsc);
				case "lap":
					return compare(a.lap, b.lap, isAsc);
				default:
					return 0;
			}
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filterPredicate = (data: LapTime, filter: string) => {
			return data.car.name.toLowerCase().includes(filter.toLowerCase()) ||
				data.track.name.toLowerCase().includes(filter.toLowerCase()) ||
				(data.track.length + "").includes(filter) ||
				(data.lap + "").includes(filter) ||
				(data.humanTime.minutes + "").includes(filter) ||
				(data.humanTime.seconds + "").includes(filter) ||
				(data.humanTime.millisecs + "").includes(filter);
		};
		this.dataSource.filter = filterValue.trim();
	}

	/**
	 * Whether the number of selected elements matches the total number of rows.
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/**
	 * Selects all rows if they are not all selected; otherwise clear selection.
	 */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	/**
	 * Reloads the data table
	 */
	public refresh() {
		this.firebaseService.getLapTimes().then(data => {
			this.lapTimes = data;

			// Add an index property
			this.lapTimes.forEach((el, index) => {
				el["index"] = <number>index + 1;
			});

			this.dataSource = new MatTableDataSource(this.lapTimes);
			this.dataSource.paginator = this.paginator;
		}).catch(err => {
			console.log(err);
		});
	}

	public showCheckboxes() {
		// Check if the table is already showing the col with checkboxes
		if (this.displayedColumns.includes("select")) {
			// If so remove that col from the table as user wants to delete a previously selected record
			this.displayedColumns.shift();

			// Show the initial icon in the FAB
			this.deleteFAB.icon = "delete";

			console.group("Delete laptimes");

			// Delete the selected data
			this.dialog.open(DialogComponent, {
				data: {
					title: "Caution",
					message: "Are you sure you want to delete those records?",
					doActionBtn: {
						text: "Yes",
						onClick: () => {
							console.log("Deleting these lapTimes: ", this.selection.selected);

							// If he presses ok, delete the data
							this.firebaseService
								.deleteLapTimes(this.selection.selected)
								.then(done => {
									console.log("Finished deleting!");
									console.groupEnd();
									this.refresh();
								})
								.catch(err => {
									console.log(err);
									console.groupEnd();
								});
						}
					},
					cancelBtn: {
						text: "No",
						onClick: () => {
							console.log("Pressed no");
							console.groupEnd();

							// De-select all the checkboxes
							this.selection.clear();		// TODO: Can be personalized through settings
						}
					}
				}
			});
		} else {
			// First interaction with the FAB. Show the col with checkboxes.
			// If pressed again, delete the selected data (handled in the code above).
			this.displayedColumns.unshift("select");

			// Change the icon to support the second interaction.
			this.deleteFAB.icon = "delete_forever";
		}
	}

	public pageChanged(event) {
		// When the page size has been changed from the paginator, update the saved value so that
		// it can be used the next time
		this.settingsService.updateSettingValue(event.pageSize, SettingsName.LapTimesPageSize);
	}
}

function compare(a: any, b: any, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
