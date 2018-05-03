import { Component, OnInit } from '@angular/core';
import  {  DatepickerOptions  } from 'ng2-datepicker';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  fname="";
  lname="";
  email="";
  dob:Date = new Date(Date.now());//new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  password="";
  confirm="test";

  datePickerOptions: DatepickerOptions = {
    minYear: new Date().getFullYear()-70,
    maxYear: new Date().getFullYear()+1,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 1, // 0 - Sunday, 1 - Monday
    minDate: null, // Minimal selectable date
    maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date'
  };

  constructor() { 
    
  }

  ngOnInit() {
  }

  registerUser(){
    if(this.password != this.confirm){
      alert("Doesnt match");
    }

  }

}
