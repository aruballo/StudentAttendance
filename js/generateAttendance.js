(function(){
	if(!localStorage.attendance){
		
		//Anything greater or equal to .5 is true,
		//rest is false
		function getRandom() {
            return (Math.random() >= 0.5);
        };
		
		var attendance;
		var studentName;
		for(var i = 0; i < attendanceApp.students.length; i++){
			studentName = attendanceApp.students[i];
			for (var i = 0; i <= 11; i++) {
                attendance[studentName].push(getRandom());
            };
		};
		
		localStorage.attendance = JSON.stringify(attendance);
	}
}());