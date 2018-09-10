import { Component, OnInit, ViewChild } from "@angular/core";
import { LapTime } from "../../models/data.model";
import { FirebaseService } from "../../services/firebase.service";
import { MatTableDataSource, MatSort, MatPaginator, Sort } from "@angular/material";

@Component({
	selector: 'app-times',
	templateUrl: './times.component.html',
	styleUrls: ['./times.component.css']
})
export class TimesComponent implements OnInit {

	public lapTimes: LapTime[] = [];
	public displayedColumns: string[] = ["index", "carName", "trackName", "trackLength", "lapTime", "lap"];
	public dataSource: MatTableDataSource<LapTime>;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private firebaseService: FirebaseService) { }

	ngOnInit(): void {
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
}

function compare(a: any, b: any, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
