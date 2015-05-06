//Initialize data if its not already there.
//No reason for this to be accessible so put
//it in a closure
(function(){
	
	if(!localStorage.students){
		
		//Anything greater or equal to .5 is true,
		//rest is false
		function getRandom() {
            return (Math.random() >= 0.5);
        };
		
		var students = [];
		
		for(var i = 0; i < attendanceApp.studentNameList.length; i++){
			var student = {};
			student.name = attendanceApp.studentNameList[i];
			student.attendance = [];
			for (var j = 0; j <= 11; j++) {
                student.attendance.push(getRandom());
            };
			students.push(student);
		};
		
		localStorage.students = JSON.stringify(students);
	}
}());

var attendanceApp = attendanceApp || {};

attendanceApp.model ={
	init: function(){
		this.students = JSON.parse(localStorage.students);
	} 
};


attendanceApp.controller = {
	
	init: function(){
		attendanceApp.model.init();
		attendanceApp.view.init();
	},
    //Returns student object matching the name parameter
	getStudent: function(name){
		for(var i = 0; i < attendanceApp.model.students.length; i++){
			if(attendanceApp.model.students[i].name == name){
				return attendanceApp.model.students[i];
			}
		}
		return false;
	},
	//Return attendance array for student
	getFullAttendanceOfStudent: function(name){
		var student = this.getStudent(name);
		if(student){
			return student.attendance;
		}
		else{
			return false;
		}

	},
	//Takes in student name, single day, and attendance value for that day
	setSingleDayAttendance: function(name, day, value){
		var student = this.getStudent(name);
		if(!student){
			alert("No such student as " + name);
		}
		else{
			student.attendance[day] = value;
		}
		localStorage.students = JSON.stringify(attendanceApp.model.students);
	},
	//Takes name and full attendance array for that student
	setFullAttendanceOfStudent: function(name, attendance){
		var student = attendanceApp.model.getStudent(name);
		if(!student){
			alert("No such student as " + name);
		}
		else{
			student.attendance = attendance;
		}
		localStorage.students = JSON.stringify(attendanceApp.model.students);
	},
	//Students array size
	getNumberOfStudents: function(){
		return attendanceApp.model.students.length;
	},
	//For retrieving students with a loop
	getStudentByIndex: function(index){
		return attendanceApp.model.students[index];
	}
	
};

attendanceApp.view = {
	init: function(){
		
		var numberOfStudents = attendanceApp.controller.getNumberOfStudents();
		var student;
		var table = document.getElementById("AttendanceTable");
		var tbody = document.createElement("tbody");
		var currentRow;
		var currentMissedTotal = 0;
		
		table.appendChild(tbody);
		
		for(var i = 0; i < numberOfStudents; i++){
			
			student = attendanceApp.controller.getStudentByIndex(i);
			currentRow = tbody.insertRow(i);
			currentRow.id = student.name;
			currentCell = currentRow.insertCell(0);
			currentCell.innerHTML = student.name;
			
			for(var j = 0; j < student.attendance.length; j++){
				currentCell = currentRow.insertCell(j+1);
				currentCheckbox = document.createElement("input");
				currentCheckbox.type = "checkbox";
				currentCheckbox.checked = student.attendance[j];
				if(student.attendance[j] == false){
					currentMissedTotal++;
				}
				currentCheckbox.addEventListener("change", (function(student, day){
					return function(){
						attendanceApp.view.saveAttendance(student, day, this.checked);
					}
				}(student, j)));
				currentCell.appendChild(currentCheckbox);
			}
			
			currentCell = currentRow.insertCell(student.attendance.length + 1);
			currentCell.id = student.name + "Attendance";
			currentCell.innerHTML = currentMissedTotal;
			currentMissedTotal = 0;
			
		}
	},
	updateAttendance: function(id, value){
		var daysMissed = document.getElementById(id + "Attendance")
		if(value == false){
			daysMissed.innerHTML = parseInt(daysMissed.innerHTML) + 1;
		}
		else{
			daysMissed.innerHTML = parseInt(daysMissed.innerHTML) - 1;
		}
	},
	saveAttendance: function(student, day, value){
		attendanceApp.controller.setSingleDayAttendance(student.name, day, value);
		this.updateAttendance(student.name, value);
	}
};

attendanceApp.controller.init();