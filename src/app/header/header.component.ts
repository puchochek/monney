import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  date: string;
  dateShift = 0;

  constructor() { }

  ngOnInit() {
    this.date = this.getCurrentDate();
  }

  getCurrentDate(): string {
    const dayWithShift = new Date();
    const today = new Date();
    dayWithShift.setDate(today.getDate() + this.dateShift);
    const currentDate = dayWithShift.getDate();
    const currentMonth = dayWithShift.getMonth() + 1;
    const currentYear = dayWithShift.getFullYear();
    const currentDay = this.getDayOfWeek(dayWithShift.getDay());
    return `${currentDate}.${currentMonth}.${currentYear} ${currentDay} `;
  }

  getDayOfWeek(currentDay: number): string {
    switch(currentDay) { 
      case 0: { 
        return 'Sunday';  
      } 
      case 1: { 
        return 'Monday';  
      } 
      case 2: { 
        return 'Tuesday';  
      } 
      case 3: { 
        return 'Wednesday';  
      } 
      case 4: { 
        return 'Thursday';  
      } 
      case 5: { 
        return 'Friday';  
      } 
      case 6: { 
        return 'Saturday';  
      } 
    }
  }

  goToPrevDate(): void {
    console.log('click');
    this.dateShift = this.dateShift - 1;
    this.date = this.getCurrentDate();
  }

}
