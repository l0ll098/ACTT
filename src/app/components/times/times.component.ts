import { Component, OnInit, ViewChild } from "@angular/core";
import { LapTime } from "../../models/data.model";
import { FirebaseService } from "../../services/firebase.service";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";

@Component({
	selector: 'app-times',
	templateUrl: './times.component.html',
	styleUrls: ['./times.component.css']
})
export class TimesComponent implements OnInit {

	public lapTimes: LapTime[] = [];
	public displayedColumns: string[] = ["position", "carName", "trackName", "trackLength", "lapTime", "lapNumber"];
	public dataSource: MatTableDataSource<LapTime>;

	@ViewChild(MatSort) sort: MatSort;
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
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
		}).catch(err => {
			console.log(err);
		});
	}

}
