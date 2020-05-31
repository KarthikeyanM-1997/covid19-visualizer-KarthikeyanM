import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GoogleChartsModule } from 'angular-google-charts';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  type = 'GeoChart';
  geoData = [];

  chartColumns = ['State', 'Cases'];

  allData = [];

  lineData = [
    ['2004', 1000],
    ['2005', 1170],
    ['2006', 660],
    ['2007', 1030],
  ];

  geoOptions = {
    region: 'IN',
    displayMode: 'regions',
    resolution: 'provinces',
    width: 640,
    height: 480,
    datalessRegionColor: 'transparent',
    enableRegionInteractivity: true,
    colorAxis: { colors: ['#00ff33', '#ff0000'] },
  };

  lineOptions = {
    title: 'Daily New Cases',
    width: "900",
    height: "500",
    hAxis: {
      title: 'Cases'
    },
    vAxis: {
      title: 'Time',
    }
  };

  nationActiveLine = [];
  nationDeceasedLine = [];
  nationConfirmedLine = [];

  onSelectState(evt) {
    try {
      let selectedState = this.geoData[evt['selection'][0]['row']][0];
      if(selectedState === "Odisha"){
        selectedState = "Orissa";
      }
      if(selectedState === "IN-UT"){
        selectedState = "Uttarakhand";
      }
      console.log(selectedState);
      for(let i = 0; i < this.allData.length; i++){
        //console.log(this.allData[i]['State']);
        if(this.allData[i]['State'] === selectedState){
          console.log(this.allData[i]);
        }
      }
    }
    catch (e) {
      console.log("None selected");
    }

  }

  nationObjectActive = [];
  nationObjectDeceased = [];
  nationObjectConfirmed = [];


  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('https://api.covid19india.org/v2/state_district_wise.json').subscribe(data => {

      console.log(data);
      for (let i = 0; i < 37; i++) {
        let stateObject = [];
        let stateObject2 = [];
        let stateObject3 = [];
        if (data[i]['state'] === "Odisha") {
          stateObject.push("Orissa");
          stateObject2.push("Orissa");
          stateObject3.push("Orissa");
        }
        else if (data[i]['state'] === "Uttarakhand") {
          stateObject.push("IN-UT");
          stateObject2.push("IN-UT");
          stateObject3.push("IN-UT");
        }
        else {
          stateObject.push(data[i]['state']);
          stateObject2.push(data[i]['state']);
          stateObject3.push(data[i]['state']);
        }


        let totalConfirm = 0;
        let totalDeceased = 0;
        let totalActive = 0;
        for (let j = 0; j < data[i]['districtData'].length; j++) {
          totalConfirm += data[i]['districtData'][j]['confirmed'];
          totalDeceased += data[i]['districtData'][j]['deceased'];
          totalActive += data[i]['districtData'][j]['active'];
        }

        stateObject.push(totalActive);
        stateObject2.push(totalDeceased);
        stateObject3.push(totalConfirm);

        this.nationObjectActive.push(stateObject);
        this.nationObjectDeceased.push(stateObject2);
        this.nationObjectConfirmed.push(stateObject3);

        this.allData.push({
          "State": data[i]['state'],
          "Confirmed": totalConfirm,
          "Deceased": totalDeceased,
          "Active": totalActive
        });
      }

      this.geoData = this.nationObjectConfirmed;
    });


    this.httpClient.get('https://api.covid19india.org/data.json').subscribe(data => {

      let date: Date = new Date("30 January 2020");
      for (let i = 0; i < data['cases_time_series'].length; i++) {

        this.nationActiveLine.push([this.addDays(date, i), +data['cases_time_series'][i].dailyconfirmed]);
        this.nationDeceasedLine.push([this.addDays(date, i), +data['cases_time_series'][i].dailydeceased]);
        this.nationConfirmedLine.push([this.addDays(date, i), +data['cases_time_series'][i].totalconfirmed]);
      }
      this.lineData = this.nationActiveLine;
    });
  }
  ngOnInit(): void {
    var token = localStorage.getItem('currentUser');;

    if(token === null){
      this.router.navigate(["/login"]);
    }
    
  }

  showActive() {
    this.geoData = this.nationObjectActive;
    this.lineData = this.nationActiveLine;
    this.lineOptions = {
      title: 'Daily New Cases',
      width: "900",
      height: "500",
      hAxis: {
        title: 'Cases'
      },
      vAxis: {
        title: 'Time',
      }
    }
  }

  showConfirmed() {
    this.geoData = this.nationObjectConfirmed;
    console.log(this.geoData);
    this.lineData = this.nationConfirmedLine;
    this.lineOptions = {
      title: 'Total Confirmed Cases',
      width: "900",
      height: "500",
      hAxis: {
        title: 'Cases'
      },
      vAxis: {
        title: 'Time',
      }
    }
  }

  addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy;
  }


  showDeceased() {
    this.geoData = this.nationObjectDeceased;
    this.lineData = this.nationDeceasedLine;

    this.lineOptions = {
      title: 'Daily Deceased Cases',
      width: "900",
      height: "500",
      hAxis: {
        title: 'Cases'
      },
      vAxis: {
        title: 'Time',
      }
    }
  }

  switchScale() {
    let newLineOpts = {
      title: this.lineOptions.title,
      width: "900",
      height: "500",
      hAxis: {
        title: 'Cases'
      },
      vAxis: {
        title: 'Time',
      }
    }

    this.lineOptions = newLineOpts;
  }

  logout(){

    localStorage.removeItem('currentUser');
    
    this.router.navigate(['/logout']);

  }

}
