import { Student } from './Student';

export class Account {
  _id: string = '';
  student: Student = new Student();
  rollNo: number = 0;
  totalFeeAmount: number = 0;
  modeOfPayment: string = '';
  board: string = '';
  noOfInstallment: number = 0;
  remarks: string = '';
  installOne: number = 0;
  installDateOne: Date = new Date();
  statusOne: boolean = false;
  installTwo: number = 0;
  installDateTwo: Date = new Date();
  statusTwo: boolean = false;
  installThree: number = 0;
  installDateThree: Date = new Date();
  statusThree: boolean = false;
  installFour: number = 0;
  installDateFour: Date = new Date();
  statusFour: boolean = false;
  createdAt: Date = new Date();
}
